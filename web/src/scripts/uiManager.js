import { getClients } from "./clients";
import { getClientId } from "./events";

const friendContent = `
<div class="flex flex-col justify-center text-slate-50 mr-2 ml-1">
    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
</div>
<div class="flex flex-col justify-center">
    <p class="text-xl font-semibold text-slate-50 whitespace-nowrap"> {{CLIENT_NAME}} </p>
</div>`;

let drawerOpen = false;
let drawer = null;

function toogleDrawer() {
    /**@type {HTMLElement} */
    if (drawer == null) drawer = document.getElementById("drawer");
    if (drawerOpen) {
        drawer.classList.remove("min-w-fit");
        drawer.classList.remove("w-[20em]");
        drawer.classList.add("min-w-0");
        drawer.classList.add("w-0");
    } else {
        drawer.classList.remove("w-0");
        drawer.classList.add("w-[20em]");
        drawer.classList.add("min-w-fit");
        drawer.classList.remove("min-w-0");
    }
    drawerOpen = !drawerOpen;
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    return `${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
}

let maxLength = -1;
function setMaxTime(time) {
    maxLength = time;
    document.getElementById("time")
    .innerHTML = formatTime(time / 1000);
}

function setPreview(url) {
    document.getElementById("preview")
    .style.backgroundImage = "url("+url+")";
    document.getElementById("background")
    .style.backgroundImage = "url("+url+")";
}

function setTitle(title) {
    document.getElementById("title")
    .innerHTML = title;
}

let friendsDiv = null;
function updateClientsList() {
    if (friendsDiv == null) friendsDiv = document.getElementById("friends");
    while (friendsDiv.firstChild) friendsDiv.firstChild.remove();

    const clients = getClients();
    // console.log("clients: ", clients.map(c => c.name));
    const others = clients.filter(c => c.id != getClientId());
    // console.log("others: ", others.map(c => c.name));
    others.forEach(client => {
        const div = document.createElement("div");
        div.classList.add("flex", "rounded-lg", "shadow", "border-2", "border-slate-600", "bg-slate-900/[0.3]", "p-2");
        div.innerHTML = friendContent.replace("{{CLIENT_NAME}}", client.name);
        friendsDiv.appendChild(div);
    });
}

/** @type {HTMLDivElement} */
let lyricsContainer = null;
function lyricsScroll(amount) {
    if (amount == null) return;
    if (lyricsContainer == null) lyricsContainer = document.getElementById("lyrics");
    
    if (typeof(amount) != "number") {
        const containerHeight = lyricsContainer.getBoundingClientRect().height;
        const lyricsHeight = amount.getBoundingClientRect().height;
        amount = amount.offsetTop - containerHeight / 2 + lyricsHeight / 2
    }

    lyricsContainer.scrollTo({
        top: amount,
        behavior: "smooth"
    });
}

function lyricsSelect(el) {
    if (el == null) return;
    if (lyricsContainer == null) lyricsContainer = document.getElementById("lyrics");
    
    for (let i = 0; i < lyricsContainer.childElementCount; i++) {
        lyricsContainer.children.item(i).classList.remove("selected");
    }
    el.classList.add("selected");
}

let progress = null;
let bar = null;
function setProgress(time) {
    if (time > maxLength) time = maxLength;
    if (progress == null) progress = document.getElementById("progress");
    if (bar == null) bar = document.getElementById("bar");

    progress.innerHTML = formatTime(time/1000);
    bar.style.width = `${(time / maxLength) * 100}%`;
}

let showingLyrics = false;
let divLyrics = null;
let lyrics = null;

function showLyrics(state) {
    showingLyrics = state;
    if (divLyrics == null) divLyrics = document.getElementById("div-lyrics");
    if (lyrics == null) lyrics = document.getElementById("lyrics");

    if (showingLyrics) {
        divLyrics.classList.add("bg-black/[0.4]", "blur-bg");
        lyrics.classList.add("opacity-1", "pointer-events-all");
        divLyrics.classList.remove("bg-black/[0]");
        lyrics.classList.remove("opacity-0", "pointer-events-none");
    } else {
        divLyrics.classList.add("bg-black/[0]");
        lyrics.classList.add("opacity-0", "pointer-events-none");
        divLyrics.classList.remove("bg-black/[0.4]", "blur-bg");
        lyrics.classList.remove("opacity-1", "pointer-events-all");
    }
}

function doesShowLyrics() {
    return showingLyrics;
}

let playBtn = null;
function setPlayingIcon(state) {
    if (playBtn == null) playBtn = document.getElementById("btn-play");
    const pauseIcon = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
    const playIcon = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;

    playBtn.firstElementChild.innerHTML = state ? pauseIcon : playIcon;
}

function displaySoundPanel() {
    const panel = document.getElementById("sound-panel");
    const child = document.getElementById("sound-panel-child");
    panel.classList.add("border-2");
    panel.style.maxWidth = child.getBoundingClientRect().width + 40 + "px";

    let soundBar = null;
    let audio = null;
    const setVolume = volume => {
        if (soundBar == null) soundBar = document.getElementById("sound-bar");
        if (audio == null) audio = document.getElementById("audio");

        audio.volume = volume;
        soundBar.style.width = `${volume * 100}%`;
        localStorage.setItem("volume", volume);
    };

    let oldVolume = localStorage.getItem("volume") || 1;
    setVolume(oldVolume);
    const adjustVolume = ev => {
        const rect = ev.target.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const width = rect.width;
        const volume = Math.round(x * 4 / width) / 4;
        if (oldVolume != volume) {
            setVolume(volume);
            oldVolume = volume;
        }
    };

    let pressed = false;
    child.addEventListener("mousedown", ev => { pressed = true; adjustVolume(ev); });
    child.addEventListener("mouseup", ev => { pressed = false; });
    child.addEventListener("mousemove", ev => { if (pressed) adjustVolume(ev); });
}

function hideSoundPanel() {
    const panel = document.getElementById("sound-panel");
    panel.classList.remove("border-2");
    panel.style.maxWidth = "0px";
}

export {
    setMaxTime,
    setPreview,
    setTitle,
    lyricsScroll,
    setProgress,
    lyricsSelect,
    toogleDrawer,
    showLyrics,
    doesShowLyrics,
    setPlayingIcon,
    updateClientsList,
    displaySoundPanel,
    hideSoundPanel
};