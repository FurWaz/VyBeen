import fs from 'fs';
import fetch from 'node-fetch';

let APP_KEY = null;
let API_URL = "https://main.apis.furwaz.fr";

async function getAppKey() {
    return new Promise((resolve, reject) => {
        if (APP_KEY === null) {
            fs.readFile("furwaz_key.txt", "utf8", (err, data) => {
                if (err) reject(err);
                else {
                    APP_KEY = data;
                    resolve(APP_KEY);
                }
            });
        } else resolve(APP_KEY);
    });
}

export async function generateLoginToken() {
    return new Promise((resolve, reject) => {
        getAppKey().then(key => {
            fetch(API_URL + "/portal/generate", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + key,
                }
            }).then(res => res.json()).then(json => {
                if (!json.data) {
                    reject(json.message);
                }
                resolve(json.data.token);
            }).catch(err => {
                reject(err);
            });
        }).catch(reject);
    })
}