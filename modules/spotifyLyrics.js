import fetch from 'node-fetch';
import fs from 'fs';

const SPOTIFY_LINK = "https://api.spotify.com/v1/search?q={REQUEST}&type=track&limit=1";
const LYRICS_LINK = "https://spotify-lyric-api.herokuapp.com/?trackid={ID}";
let TOKEN = "";
let CLIENT_ID = "";
let CLIENT_SECRET = "";

let lastLyrics = null;
let lastRequest = "";

function loadClientCredentials() {
    return new Promise((resolve, reject) => {
        fs.readFile("spotify.txt", "utf8", (err, data) => {
            if (err) reject(err);
            else {
                const parts = data.split(":");
                CLIENT_ID = parts[0];
                CLIENT_SECRET = parts[1];
                resolve();
            }
        });
    });
}

function retreiveToken() {
    return new Promise((resolve, reject) => {
        loadClientCredentials().then(() => {
            fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Authorization": "Basic " + Buffer.from(CLIENT_ID+":"+CLIENT_SECRET).toString("base64"),
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "grant_type=client_credentials"
            }).then(res => {
                res.json().then(json => {
                    TOKEN = json.access_token;
                    resolve();
                }).catch(reject);
            }).catch(reject);
        });
    });
}

function lyrics(query) {
    return new Promise((resolve, reject) => {
        if (TOKEN == "") {
            retreiveToken().then(() => {
                findLyrics(query).then(resolve).catch(reject);
            }).catch(reject);
        } else findLyrics(query).then(resolve).catch(reject);
    });
}

function findLyrics(query) {
    return new Promise((resolve, reject) => {
        if (lastRequest == query) {
            resolve(lastLyrics);
            return;
        } else {
            lastLyrics = null;
            lastRequest = "";
        }

        getSongID(query).then(res => {
            fetchLyrics(res).then(res => {
                lastLyrics = res;
                lastRequest = query;
                resolve(res);
            }).catch(reject);
        }).catch(reject);
    });
}

function getSongID(query, retry = true) {
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
                try {
                    const res = json.tracks.items[0].id;
                    resolve(res);
                } catch (err) {
                    if (retry) {
                        retreiveToken().then(() => {
                            getSongID(query, false).then(resolve).catch(reject);
                        }).catch(reject);
                    } else reject(err);
                }
            }).catch(reject);
        }).catch(reject);
    });
}

function fetchLyrics(id) {
    return new Promise((resolve, reject) => {
        fetch(LYRICS_LINK.replace("{ID}", id)).then(res => {
            res.json().then(json => {
                resolve(json.lines.map(line => ({
                    time: line.startTimeMs,
                    text: line.words
                })));
            }).catch(reject);
        }).catch(reject);
    });
}

export default lyrics;