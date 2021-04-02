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
/**Current user socket connection */
var socket = null;
/**Current user informations */
var user = {username: ""};
/** List of all the connected users on the stream
 * @type {user[]}
 */
var connectedUsers = [];
/**Processed audio chunks */
var audioSources = [];
var indexShift = 0;
var isPlaying = false;
/**@type AudioContext*/
var context = null;
var output = null;
/**Is the song on pause or not */
var pauseState = false;
var songLength = 0;
var volume = 50;

window.onload = () => {
    socket = io();
    socket.on('setup', (data) => {
        user.username = data.username;
        if (localStorage.getItem('username') != null) {
            user.username = localStorage.getItem('username');
            socket.emit('changeUsername', {username: user.username});
        }
        updatePseudoView();
    });
    socket.on('changeConnected', (data) => {
        connectedUsers = data.users;
        updateConnectedList();
    });
    setupInputEvents();
    socket.on('clearaudio', loadNewAudioInfo);
    socket.on('audiodata', processChunk);
    socket.on('changePreview', changePreview);
    socket.on('message_start', (data) => {
        document.getElementById("message-container").style.maxHeight = "20px";
    });
    socket.on('message_end', (data) => {
        document.getElementById("message-container").style.maxHeight = "0px";
    });
    socket.on('message', (data) => {
        document.getElementById("message-text").innerHTML = data.message;
    });
    socket.on('setPause', (data) => {
        pauseState = true;
        document.getElementById("preview-pause-icon").innerHTML = "play_arrow";
    });
    socket.on('setPlay', (data) => {
        pauseState = false;
        document.getElementById("preview-pause-icon").innerHTML = "pause";
    });
}

/**
 * Setup the variables for a new music stream
 */
function loadNewAudioInfo(data) {
    songProgress = data.shift;
    audioSources.splice(0, audioSources.length);
}

function readNextSource() {
    if (indexShift < songLength) {
        setTimeout(readNextSource, 999.5);
        if (pauseState) return;
        try {
            let source = audioSources.splice(0, 1)[0]
            indexShift++;
            source.start();
        } catch (error) {console.log("error reading new chunk")}
    } else {
        console.log('ending song')
        isPlaying = false;
        indexShift = 0;
    }
    document.getElementById("preview-bar-content").style.width = (indexShift*100/songLength)+"%";
    document.getElementById("preview-bar-loaded").style.width = (audioSources.length*100/songLength)+"%";
}

/**
 * Processes the chunks sent from the stream
 */
function processChunk(data) {
    if (audioSources.length == 0) indexShift = data.index;
    if (!isPlaying) {
        isPlaying = true;
        readNextSource();
    }
    if (context == null) return;
    while (data.index >= audioSources.length+indexShift)
        audioSources.push(null);
    try {
        let chunk = withWaveHeader(data.chunk, 2, 48000);
        context.decodeAudioData(chunk, (buffer) => {
            let source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(output);
            audioSources[data.index-indexShift] = source;
        }, err => {console.log(err);});
    } catch (e) {}
}

/**
 * Update the preview infos to the new song sent
 */
function changePreview(data) {
    document.getElementById("preview-pic-title").innerHTML = data.title;
    document.getElementById("preview-pic-content").src = data.thumbnail;
    songLength = parseInt(data.length);
    indexShift = 0;
    isPlaying = false;
}

function debug() {
    socket.emit('debug', {});
}

/**
 * Setup all the input events callback for the html page
 */
function setupInputEvents() {
    document.getElementById("preview-pause-button").onclick = () => {
        socket.emit('tooglePause', {});
    };
    let sendUrl = () => {
        socket.emit('loadUrl', {
            url: document.getElementById("preview-link-input").value
        });
    };
    document.getElementById("preview-link-button").onclick = sendUrl;
    document.getElementById("preview-link-input").addEventListener('keydown', ev => {
        if (ev.key == "Enter") sendUrl();
    })
    document.getElementById("header-user-name").onblur = () => {
        user.username = document.getElementById("header-user-name").value;
        socket.emit('changeUsername', {username: user.username});
        localStorage.setItem('username', user.username);
    };
    document.getElementById("preview-volume-button").onmouseover = () => {
        document.getElementById("preview-volume-slider-container").style.height = "120px";
        document.getElementById("preview-volume-slider-content").style.boxShadow = "0px 0px 10px #0004";
    };
    document.getElementById("preview-volume-button").onmouseout = () => {
        document.getElementById("preview-volume-slider-container").style.height = "0px";
        document.getElementById("preview-volume-slider-content").style.boxShadow = "0px 0px 10px #0000";
    };
    document.getElementById("preview-volume-icon").onmousedown = () => {
        let slider = document.getElementById("preview-volume-slider-slide");
        if (slider.style.height == "0%") {
            slider.style.height = volume+"%";
            output.gain.value = volume/100;
            document.getElementById("preview-volume-icon").innerHTML = "volume_up";
        } else {
            slider.style.height = "0%";
            output.gain.value = 0;
            document.getElementById("preview-volume-icon").innerHTML = "volume_off";
        }
        localStorage.setItem('volume', volume);
    };
    document.getElementById("preview-volume-slider-container").onclick = ev => {
        volume = 100 + document.getElementById("preview-volume-slider-content").offsetTop - ev.y;
        document.getElementById("preview-volume-slider-slide").style.height = volume+"%";
        output.gain.value = volume/100;
        localStorage.setItem('volume', volume);
    };
    window.onmousemove = () => {
        if (context == null) {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            context = new AudioContext();
            output = context.createGain();
            if (localStorage.getItem('volume') == null) output.gain.value = 0.5;
            else {
                volume = localStorage.getItem('volume');
                output.gain.value = (volume/100);
            }
            output.connect(context.destination);
        }
    };
}

/**
 * Updates the peusdo view on the webpage
 */
function updatePseudoView() {
    document.getElementById("header-user-name").value = user.username;
}

/**
 * Updates the connected users list on the right
 */
function updateConnectedList() {
    let container = document.getElementById("listener-list-container");
    while (container.firstChild) container.firstChild.remove();
    for (let i = 0; i < connectedUsers.length; i++)
        container.appendChild(createUserDiv(connectedUsers[i]));
}

/**
 * Generates an html user div from users's informations
 * @param {user} user
 */
function createUserDiv(user) {
    let user_container = document.createElement("div");
    let user_center = document.createElement("div");
    let user_ncenter1 = document.createElement("div");
    let user_ncenter2 = document.createElement("div");
    let user_name = document.createElement("div");
    let user_icon = document.createElement("span");
    user_container.classList.add("user-container");
    user_center.classList.add("user-center");
    user_ncenter1.classList.add("user-ncenter");
    user_ncenter2.classList.add("user-ncenter");
    user_name.classList.add("user-name");
    user_icon.classList.add("material-icons");
    user_name.innerHTML = user.username;
    user_icon.innerHTML = "account_circle";
    user_ncenter1.appendChild(user_icon);
    user_ncenter2.appendChild(user_name);
    user_center.appendChild(user_ncenter1);
    user_center.appendChild(user_ncenter2);
    user_container.appendChild(user_center);
    return user_container;
}