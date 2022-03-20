let socket = io();
let startTime = Date.now();
let guestName = "Guest";
let videoDetails = null;

const CONSTANTS = {
    SEARCHING: "custom/searchingURL",
    LOADING: "custom/loadingURL",
    SET_URL: "custom/setURL",
    GUEST_LIST: "custom/guestsList",
    CHANGE_NAME: "custom/changeName",
    GET_URL: "custom/getURL",
    ERROR: "custom/error",
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    UPDATE_PLAYLIST: "custom/updatePlaylist"
}

function tryToPlay() {
    const dj = document.getElementById("dj");
    if (!dj.paused) return;
    dj.play();
    dj.currentTime = (Date.now()/1000 - startTime);
}

let timeoutIndex = -1;
function logMessage(message) {
    const log = document.getElementById("log");
    if (timeoutIndex > 0) clearTimeout(timeoutIndex);
    log.style.opacity = "1";
    log.innerHTML = message;
    timeoutIndex = setTimeout(() => {
        log.style.opacity = "0";
    }, 3000);
}

socket.on("custom/searchingURL", () => {
    logMessage("Searching video ...");
});

socket.on("custom/loadingURL", () => {
    logMessage("Loading audio ...");
});

socket.on("custom/error", err => {
    logMessage("Error: "+err);
});

socket.on(CONSTANTS.UPDATE_PLAYLIST, playlist => {
    console.log("playlist: ", playlist.map(s => s.title));
    const container = document.getElementById("playlist");
    container.innerHTML = "";
    playlist.forEach(song => {
        const content = document.createElement("div");
        content.classList.add("list-prev");
        const img = document.createElement("div");
        img.classList.add("list-img");
        img.style.backgroundImage = "url("+song.thumbnail+")";
        const text = document.createElement("p");
        text.classList.add("list-text");
        text.innerHTML = song.title;
        const rm = document.createElement("img");
        rm.classList.add("list-remove");
        rm.onclick = () => {};
        content.appendChild(img);
        content.appendChild(text);
        container.appendChild(content);
    });
});

socket.on("custom/setURL", val => {
    logMessage("Done");
    videoDetails = val;
    if (val == null) return;
    document.getElementById("thumbnail").style.backgroundImage = "url(\""+val.infos.thumbnail+"\")";
    document.getElementById("title").innerHTML = val.infos.title;
    const dj = document.getElementById("dj");
    dj.src = val.audio.url;
    startTime = val.infos.startTime;
    tryToPlay();
});

socket.on("custom/guestsList", list => {
    const gList = document.getElementById("guest-list");
    gList.innerHTML = "";
    list.forEach(name => {
        const style = (name == guestName)? " style=\"color: var(--color-secondary)\"": "";
        name = (name == guestName)? "(You) "+name: name;
        gList.innerHTML += `
        <div class="guest-box">
            <p${style}>${name}</p>
        </div>`;
    });
});

onmousedown = tryToPlay;

onload = () => {
    document.querySelector(".content").style.height =
        (window.innerHeight-document.getElementById("header").getBoundingClientRect().height)+"px";
    const input = document.getElementById("yt-input");
    input.onkeyup = ev => {
        if (ev.key.toLowerCase() == "enter")
        socket.emit("custom/getURL", input.value);
    };
    const name = document.getElementById("username");
    name.onblur = ev => {
        guestName = name.value
        localStorage.setItem("username", guestName);
        socket.emit("custom/changeName", guestName);
    };
    // try to get name from localstorage
    const localName = localStorage.getItem("username");
    if (localName != null) name.value = localName;
    name.onblur();

    const barContent = document.getElementById("bar-content");
    setInterval(() => {
        if (videoDetails == null) return;
        const progress = (Date.now()/1000 - videoDetails.infos.startTime);
        const percent = progress*100 / videoDetails.infos.length;
        barContent.style.width = percent+"%";
    }, 200);
}