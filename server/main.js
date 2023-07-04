import cors from 'cors';
import express from 'express';
import search from './modules/search.js';
import infos from './modules/infos.js';
//import lyrics from './modules/lyrics.js';
import lyrics from './modules/spotifyLyrics.js';
import { Event, registerNewRequest, sendEvent } from './modules/longPooling.js';
import { changeClientName, getClients, registerClient } from './modules/users.js';
import SongController from './modules/SongController.js';
import Song from './modules/Song.js';
import { generateLoginToken } from './modules/login.js';

const app = express();
let currentVideoInfos = null;

app.use(cors({ origin: '*' }));

app.get("/", (req, res) => {
    res.json({
        name: "VyBeen",
        routes: [
            "/search?q={query}",
            "/infos",
            "/stream",
            "/lyrics",
        ]
    });
});

/** MUSIC ROUTES START **/

let q = null;
app.get("/search", (req, res) => {
    q = req.query["q"];
    if (q === null || q === undefined || q === "") {
        res.json("Error : Invalid search parameter");
        return;
    }

    search(q).then(id => {
        infos(id).then(infos => {
            currentVideoInfos = infos;
            const data = {
                title: infos.title,
                author: infos.author,
                thumbnail: infos.thumbnail,
                length: infos.length,
                stream: `/stream`,
                lyrics: `/lyrics`
            };
            SongController.instance.setSong(new Song(infos.title, infos.author, infos.length));
            res.json(data);
            sendEvent(new Event("newMusic", data));
        }).catch(err => {
            console.error(err);
            res.json("Error : Cannot get video infos");
        });
    }).catch(err => {
        console.error(err);
        res.json("Error : "+err);
    });
});

app.get("/infos", (req, res) => {
    if (currentVideoInfos === null) {
        res.json("Error : No video currently playing");
        return;
    }

    const data = {
        title: currentVideoInfos.title,
        author: currentVideoInfos.author,
        thumbnail: currentVideoInfos.thumbnail,
        length: currentVideoInfos.length,
        stream: `/stream`,
        lyrics: `/lyrics`
    };
    res.json(data);
});

app.get("/stream", (req, res) => {
    if (currentVideoInfos === null) {
        res.json("Error : No video currently playing");
        return;
    }

    res.json({
        stream: currentVideoInfos.stream,
        progress: SongController.instance.song.progress
    });
});

app.get("/lyrics", (req, res) => {
    if (currentVideoInfos === null) {
        res.json("Error : No video currently playing");
        return;
    }

    lyrics(currentVideoInfos.author+" - "+currentVideoInfos.title).then(result => {
        res.json({ lyrics: result });
    }).catch(err => {
        console.error(err);
        res.json("Error : Cannot get lyrics ("+err+")");
    });
});

app.get("/login", (req, res) => {
    generateLoginToken().then(token => {
        res.json({ token });
    }).catch(err => {
        console.error(err);
        res.json("Error : Cannot get login token");
    });
});

/** MUSIC ROUTES END **/

/** MUSIC CONTROLS START **/

app.get("/play", (req, res) => {
    SongController.instance.play();
    sendEvent(new Event("play", {}));
    res.end();
});

app.get("/pause", (req, res) => {
    SongController.instance.pause();
    sendEvent(new Event("pause", {}));
    res.end();
});

/** MUSIC CONTROLS END **/

/** USER ROUTES START **/

app.get("/register", (req, res) => {
    req.query["name"] = req.query["name"] || "Anonymous";
    registerClient(req.query["name"]).then(client => {
        res.json({name: client.name, id: client.id});
    });
});

app.get("/changeName", (req, res) => {
    if (req.query["id"] === null || req.query["id"] === undefined || req.query["id"] === "") {
        res.json("Error : Invalid id parameter");
        return;
    };
    if (req.query["name"] === null || req.query["name"] === undefined || req.query["name"] === "") {
        res.json("Error : Invalid name parameter");
        return;
    };
    
    changeClientName(req.query["id"], req.query["name"]).then(client => {
        res.json({name: client.name, id: client.id});
    });
});

app.get("/events", (req, res) => {
    registerNewRequest(req, res)
    .then(() => {})
    .catch(err => { res.json("Error : "+err); });
});

app.get("/clients", (req, res) => {
    getClients().then(clients => {
        res.json(clients.map(c => ({name: c.name, id: c.id})));
    }).catch(err => {
        console.error(err);
        res.json("Error : Cannot get clients");
    });
});

/** USER ROUTES END **/

app.listen(8080);