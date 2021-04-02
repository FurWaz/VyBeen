/*
    Copyright (C) 2021 FurWaz

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
    MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
    OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
    CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

const https = require('https');
const http = require('http');
const fs = require('fs');
const ytdl = require('ytdl-core');
const {exec} = require('child_process');
const ytSearch = require('youtube-search')
const express = require('express');

var current_ytdl_stream = null;
/**@type ytdl.videoInfo */
var cur_vid = null;
var wav_parts = [];
var wav_index = 0;
var isStream = false;
var users = [];
var isPaused = false;
/**@type {{url: "", thumbnail: "", title: ""}[]} */
var song_queue = [];
var requestLocked = false;
var ytToken = "";
try {
    ytToken = fs.readFileSync(__dirname+"/yt-token.txt", "utf-8");
} catch (error) {console.log("Warning: Youtube API key not found");}

const app = express();
const server = http.createServer(app);
app.get('/*', (req, res) => {
    let path = req.url;
    if (req.url == "/") path = "/index.html";
    path = __dirname+"/client"+path;
    res.sendFile(path);
});
server.listen(5621);

function playNextSong() {
    if (song_queue.length < 1) return;
    let vidURL = song_queue.splice(0, 1);
    loadStream(vidUrl);
    refreshQueue();
}

function refreshQueue() {
    let videos = [];
    song_queue.forEach(s => {
        
    });
}

function getUserIndex(id) {
    for (let i = 0; i < users.length; i++) {
        const el = users[i];
        if (el.id == id) {
            return i;
        }
    }
    return -1;
}

const io = require("socket.io")(server, {});
io.on('connection', function(socket) {
    users.push({
        username: "User "+socket.id.substring(0, 6),
        id: socket.id
    });
    socket.emit('setup', users[users.length-1]);
    io.sockets.emit('changeConnected', {
        users: users
    });
    if (cur_vid != null) {
        socket.emit('changePreview', {
            title: cur_vid.videoDetails.title,
            thumbnail: cur_vid.videoDetails.thumbnails[cur_vid.videoDetails.thumbnails.length-1].url,
            length: cur_vid.videoDetails.lengthSeconds
        });
    }
    //if (isStream) sendPartsTo(socket);
    socket.on('getConnected', (data) => {
        socket.emit('changeConnected', {
            users: users
        });
    });
    if (isPaused) socket.emit('setPause', {});
    else socket.emit('setPlay', {});
    socket.on('changeUsername', (data) => {
        let index = getUserIndex(socket.id);
        if (index != -1) {
            users[index].username = data.username;
            io.sockets.emit('changeConnected', {users: users});
        }
    });
    socket.on('tooglePause', (data) => {
        isPaused = !isPaused;
        if (isPaused) io.sockets.emit('setPause', {});
        else io.sockets.emit('setPlay', {});
    })
    socket.on('loadUrl', (data) => {
        io.sockets.emit('message_start', {});
        io.sockets.emit('message', {message: "Searching video ..."});
        if (data.url.startsWith("https://www.youtube.com/watch?v=") || data.url.startsWith("https://music.youtube.com/watch?v=")) {
            loadStream(data.url);
        }
        else {
            if (ytToken == "") { // token not found
                io.sockets.emit('message', {message: "Youtube API Key not found, please give a youtube link instead"});
                setTimeout(() => {io.sockets.emit('message_end', {});}, 3000);
            } else {
                if (data.url == "") data.url = "Never gonna give you up";
                var opts = {
                    maxResults: 1,
                    key: ytToken
                };
                let videoLink = "";
                ytSearch(data.url, opts, function(err, results) {
                    if (err) return console.log("error");
                    videoLink=results[0].link;
                    loadStream(videoLink);
                });
            }
        }
    });
    socket.on('disconnect', () => {
        let index = getUserIndex(socket.id);
        if (index != -1) users.splice(index, 1);
        io.sockets.emit('changeConnected', {
            users: users
        });
    });
});

function changeTime() {
    if (!isStream) return;
    wav_index++;
    if (wav_index >= wav_parts.length) {
        isStream = false;
        playNextSong();
    }
    setTimeout(changeTime, 1000);
}

function sendPartsTo(s) {
    s.emit('clearaudio', {shift: wav_index, length: 138});
    let cur_wav_index = wav_index;
    let i = 0;
    let sendChunk = () => {
        const pa = wav_parts[i+cur_wav_index];
        s.emit('audiodata', {chunk: pa, index: i});
        if (i < (wav_parts.length - cur_wav_index)) {
            i++;
            setTimeout(sendChunk, 900);
        }
    }
    sendChunk();
}

function loadStream(vidUrl) {
    io.sockets.emit('message', {message: 'Getting informations ...'});
    ytdl.getBasicInfo(vidUrl).then((vidInfo) => {
        cur_vid = vidInfo;
        if (cur_vid.videoDetails.lengthSeconds > 600) return;
        current_ytdl_stream = ytdl(vidUrl, {
            filter: "audioonly",
            quality: "highest",
            format: "ogg",
            dlChunkSize: 96000
        });
        current_ytdl_stream.pipe(fs.createWriteStream('./input.ogg'));
        let progress = 0;
        let lastMessageTime = 0;
        current_ytdl_stream.on('data', (chunk) => {
            if (Date.now() < lastMessageTime+500) return;
            lastMessageTime = Date.now();
            progress += chunk.length;
            let percent = Math.round(progress/(cur_vid.videoDetails.lengthSeconds * 15));
            io.sockets.emit('message', {message: 'Downloading ... '+Math.min(percent, 100)+'%'});
        })
        current_ytdl_stream.on('end', () => {
            io.sockets.emit('message', {message: 'Converting ...'});
            exec('ffmpeg -i input.ogg -ar 48000 output.wav -y', (error, out, err) => {
                let fsStream = fs.createReadStream('./output.wav', {highWaterMark: 48000*2*2});
                fsStream.on('data', (chunk) => {
                    wav_parts.push(chunk);
                });
                fsStream.on('ready', () => {
                    io.sockets.emit('message', {message: 'Reading ...'});
                    wav_parts.splice(0, wav_parts.length)
                    wav_index=0; isStream = false;
                });
                fsStream.on('end', () => {
                    io.sockets.emit('message_end', {});
                    io.sockets.emit('changePreview', {
                        title: cur_vid.videoDetails.title,
                        thumbnail: cur_vid.videoDetails.thumbnails[cur_vid.videoDetails.thumbnails.length-1].url,
                        length: cur_vid.videoDetails.lengthSeconds
                    });
                    isStream = true;
                    sendPartsTo(io.sockets);
                    setTimeout(changeTime, 1000);
                })
            });
        });
    }).catch((e) => {
        io.sockets.emit('message', {message: "Error: Cannot get youtube stream, abording."});
        setTimeout(() => {io.sockets.emit('message_end', {});}, 3000);
    });
}