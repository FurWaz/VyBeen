import { fetchLyrics, getLyricsBuffer } from "./lyricsGetter";
import { fetchStream } from "./streamGetter";
import { lyricsScroll, lyricsSelect, setMaxTime, setPlayingIcon, setPreview, setProgress, setTitle } from "./uiManager";

const API_URL = "https://vybeen.apis.furwaz.fr";

function fetchInfos() {
    fetch(API_URL+"/infos", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(res => {
        res.json().then(infos => {
            if (typeof(infos) == "string" && infos.startsWith("Error")) {
                return;
            }
            setInfos(infos);
        });
    });
}

function requestSearch(search) {
    fetch(API_URL+"/search?q="+search, {
        method: "GET",
        headers: { "Content-Type": "application/json"}
    }).then(res => {
        res.json().then(infos => {
            if (typeof(infos) == "string" && infos.startsWith("Error")) {
                console.log("error : "+infos);
                return;
            }
            setInfos(infos);
        });
    });
}

function setInfos(infos) {
    setPreview(infos.thumbnail);
    setTitle(infos.author + " - " + infos.title);
    setMaxTime(infos.length);
    fetchStream(API_URL+infos.stream);
    fetchLyrics(API_URL+infos.lyrics);
}

let lyricsUpdater = -1;
function startMainLoop() {
    if (audio == null) audio = document.getElementById("audio");

    if (lyricsUpdater != -1)
        clearInterval(lyricsUpdater);

    lyricsUpdater = setInterval(() => { update(); }, 100);
}

function stopMainLoop() {
    clearInterval(lyricsUpdater);
    lyricsUpdater = -1;
}

function update() {
    const lyricsBuffer = getLyricsBuffer();
    if (lyricsBuffer.length == 0) {
        // stopMainLoop();
        return;
    }

    const delay = audio.currentTime * 1000; // time since song start, in ms

    let index = 0;
    while (lyricsBuffer[index].time < delay) {
        index++;
        if (index >= lyricsBuffer.length) {
            // stopMainLoop();
            return;
        }
    }
    index--;

    if (index >= 0) {
        lyricsSelect(lyricsBuffer[index].el);
        lyricsScroll(lyricsBuffer[index].el);
    }

    setPlayingIcon(!audio.paused);
    setProgress(delay);
}

export { update, startMainLoop, stopMainLoop, setInfos, API_URL, fetchInfos, requestSearch };