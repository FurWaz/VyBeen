const youtubeKey = require("fs").readFileSync("./ytKey.txt", {encoding: "utf-8"});
const ytdl = require("ytdl-core");
const ytSearch = require("youtube-search");
const playlist = require("./playlist");
const common = require("./common");

let playCallback = () => {};
let currentVideo = {
    startTime: 0,
    length: 0,
    callbackCalled: true,
    playing: false
}

setInterval(() => {
    if (!currentVideo.playing) {
        const song = playlist.next();
        if (song == null) return;
        song.infos.startTime = Date.now()/1000;
        currentVideo.callbackCalled = false;
        currentVideo.playing = true;
        currentVideo.length = song.infos.length;
        currentVideo.startTime = song.infos.startTime;
        common.setVideoInfos(song);
        playCallback();
    } else {
        if (Date.now()/1000 > currentVideo.startTime+currentVideo.length) {
            if (!currentVideo.callbackCalled) {try {playlist.callback();} catch (e) {}}
            currentVideo.callbackCalled = true;
            currentVideo.playing = false;
        }
    }
}, 1000);

function getVideoInfos(url) {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(url, {lang: "fr"}).then(val => {
            const format = val.formats.filter(el => el.mimeType.startsWith("audio")).map(el => {return {
                bitrate: el.audioBitrate,
                sampleRate: el.audioSampleRate,
                channels: el.audioChannels,
                url: el.url
            }})[0];
            let maxRes = {x: 0, y: 0};
            let bestThumbsnail = '';
            val.videoDetails.thumbnails.forEach(thumb => {
                if (thumb.height > maxRes.y && thumb.width > maxRes.x) {
                    maxRes = {x: thumb.width, y: thumb.height};
                    bestThumbsnail = thumb.url;
                }
            });
            let videoInfos = {
                audio: format,
                infos: {
                    title: val.videoDetails.title,
                    length: parseInt(val.videoDetails.lengthSeconds),
                    thumbnail: bestThumbsnail,
                    startTime: 0
                }
            };
            resolve(videoInfos);
        }).catch(reject);
    });
}

function getVideoURL(string) {
    return new Promise((resolve, reject) => {
        if (!string.startsWith("http")) { // get video id from key words
            ytSearch(string, {maxResults: 1, key: youtubeKey}).then((res, err) => {
                if (err) reject(err);
                else resolve(res.results[0].link);
            });
        } else resolve(string);
    });
}

function setPlayCallback(callback) {
    playCallback = callback;
}

module.exports = {getVideoInfos, getVideoURL, setPlayCallback};