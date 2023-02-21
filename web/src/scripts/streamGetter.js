import { setPlayingIcon, setProgress } from "./uiManager";

/**@type {HTMLAudioElement} */
let audio = null;

let asking_for_play = false;
let time_asking = 0;
let interacted = false;
let listenerSetup = false;
let should_play = false;

function setupListener() {
    if (listenerSetup) return;
    listenerSetup = true;

    setInteracted();
    document.addEventListener("click", setInteracted);
    document.addEventListener("touchstart", setInteracted);
    document.addEventListener("keydown", setInteracted);
}

function askForPlay() {
    asking_for_play = true;
    time_asking = Date.now();
    setupListener();
    tryToPlay();
}

function setInteracted() {
    interacted = true;
    tryToPlay();
}

function tryToPlay() {
    if (asking_for_play && interacted) {
        if (audio == null) audio = document.getElementById("audio");
        if (!audio.paused) return;
        if (!should_play) return;
        audio.currentTime += (Date.now() - time_asking) / 1000;
        audio.play();
        audio.onended = () => {
            setPlayingIcon(false);
            should_play = false;
        }
    }
}

function fetchStream(link) {
    fetch(link, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(res => {
        if (audio == null) audio = document.getElementById("audio");

        audio.currentTime = 0;
        res.json().then(infos => {
            if (typeof(infos) == "string" && infos.startsWith("Error")) {
                return;
            }
            audio.src = infos.stream;
            window.audio = audio;
            audio.currentTime = infos.progress / 1000;
            setTimeout(() => {
                setProgress(audio.currentTime * 1000);
                should_play = audio.currentTime == (infos.progress / 1000);
                askForPlay();
            }, 200);
        });
    });
}

export { fetchStream };