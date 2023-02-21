import { startMainLoop } from "./main";
import { lyricsScroll } from "./uiManager";

let lyricsBuffer = [];
function getLyricsBuffer() {
    return lyricsBuffer;
}

function fetchLyrics(link) {
    lyricsBuffer.splice(0, lyricsBuffer.length);
    fetch(link, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(res => {
        res.json().then(infos => {
            let lyrics = infos.lyrics;
            lyricsBuffer.splice(0, lyricsBuffer.length);
            if (typeof(infos) == "string" && infos.startsWith("Error")) {
                lyrics = "Error : Can't find lyrics for this song";
            }
            
            const lyricsContainer = document.getElementById("lyrics");
            while (lyricsContainer.firstChild) lyricsContainer.firstChild.remove();

            if (typeof lyrics == "string") {
                const p = document.createElement("p");
                p.classList.add("paroles", "selected")
                p.innerHTML = lyrics;
                lyricsContainer.appendChild(p);
            } else {
                lyrics.forEach(line => {
                    const p = document.createElement("p");
                    if (line.text != "") {
                        p.classList.add("paroles")
                        p.innerHTML = line.text;
                        lyricsContainer.appendChild(p);
                    }
                    lyricsBuffer.push({
                        el: line.text == "" ? null: p,
                        time: Number(line.time)
                    });
                    window.lyricsBuffer = lyricsBuffer;
                });
            }

            lyricsScroll(0);
            startMainLoop();
            window.lyrics = lyricsBuffer;
        });
    });
}

export { fetchLyrics, getLyricsBuffer };