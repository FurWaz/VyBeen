// import youtube search
import ytSearch from 'youtube-search';
import fs from 'fs';

let YT_KEY = "";
let lastReqTime = Date.now() - 10000;

function search(q) {
    return new Promise((resolve, reject) => {
        const curReqTime = Date.now();
        // max is one request every 10 seconds
        if (curReqTime - lastReqTime < 10000) {
            reject("Too many requests");
            return;
        }
        lastReqTime = curReqTime;

        if (YT_KEY === "") {
            fs.readFile("key.txt", "utf8", (err, data) => {
                if (err) reject(err);
                else {
                    YT_KEY = data;
                    makeSearch(q).then(resolve).catch(reject);
                }
            });
        } else makeSearch(q).then(resolve).catch(reject);
    });
}

function makeSearch(q) {
    return new Promise((resolve, reject) => {
        const opts = {
            maxResults: 1,
            key: YT_KEY,
            type: "video"
        };

        ytSearch(q + " lyrics", opts, (err, results) => {
            if (err) {
                reject("Cannot find a video from the given prompt (" + err + ")");
            } else {
                resolve(results[0].id);
            }
        });
    });
}

export default search;