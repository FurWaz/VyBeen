import fetch from 'node-fetch';
import fs from 'fs';

const SPOTIFY_LINK = "https://api.spotify.com/v1/search?q={REQUEST}&type=track&limit=1";
const LYRICS_LINK = "https://spotify-lyric-api.herokuapp.com/?trackid={ID}";
let TOKEN = "";

function lyrics(artist, song) {
    return new Promise((resolve, reject) => {
        if (TOKEN == "") {
            fs.readFile("spotify.txt", "utf8", (err, data) => {
                if (err) reject(err);
                else {
                    TOKEN = data;
                    findLyrics(artist, song).then(resolve).catch(reject);
                }
            });
        } else findLyrics(artist, song).then(resolve).catch(reject);
    });
}

function findLyrics(artist, song) {
    return new Promise((resolve, reject) => {
        getSongID(artist + " - " + song).then(res => {
            fetchLyrics(res).then(resolve).catch(reject);
        }).catch(reject);
    });
}

function getSongID(query) {
    return new Promise((resolve, reject) => {
        fetch(SPOTIFY_LINK.replace("{REQUEST}", query), {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + TOKEN,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }).then(res => {
            res.json().then(json => {
                resolve(json.tracks.items[0].id);
            }).catch(reject);
        }).catch(reject);
    });
}

function fetchLyrics(id) {
    return new Promise((resolve, reject) => {
        fetch(LYRICS_LINK.replace("{ID}", id)).then(res => {
            res.json().then(json => {
                resolve(json.lines.map(line => ({
                    time: line.startTimeMs / 1000,
                    text: line.words
                })));
            }).catch(reject);
        }).catch(reject);
    });
}

export default lyrics;