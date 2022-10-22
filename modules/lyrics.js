import fetch from 'node-fetch';
import jsdom from 'jsdom';

function lyrics(artist, song) {
    return new Promise((resolve, reject) => {
        artist = cleanString(artist);
        song = cleanString(song);
        const urlTemplate = "https://www.musixmatch.com/lyrics/{ARTIST}/{SONG}";
        const link = urlTemplate.replace("{ARTIST}", artist).replace("{SONG}", song);
        resolve(findInPage(link));
    });
}

function cleanString(str) {
    str = str.split("&").join("");
    str = str.split(".").join(" ");
    str = str.split(":").join("");
    str = str.split("  ").join(" ");
    str = str.split(" ").join("-");
    str = str.split("--").join("-");
    str = str.split("--").join("-");
    return str;
}

function lyricsFromHTML(str) {
    const dom = new jsdom.JSDOM(str);
    const document = dom.window.document;
    const p = document.querySelector(".mxm-lyrics__content");
    p.nextElementSibling.firstElementChild.remove();
    const text_p1 = p.firstElementChild.innerHTML;
    const text_p2 = p.nextElementSibling.firstElementChild.firstElementChild.innerHTML;
    const lyrics = (text_p1 + text_p2).split("\n\n").join("\n").split("\n");
    return lyrics;
}

function findInPage(link) {
    return new Promise((resolve, reject) => {
        fetch(link).then(res => {
            res.text().then(text => {
                resolve(lyricsFromHTML(text));
            }).catch(reject);
        }).catch(reject);
    });
}

export default lyrics;