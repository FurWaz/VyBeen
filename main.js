import cors from 'cors';
import express from 'express';
import search from './modules/search.js';
import infos from './modules/infos.js';
//import lyrics from './modules/lyrics.js';
import lyrics from './modules/spotifyLyrics.js';

const app = express();
let currentVideoInfos = null;

app.use(cors({ origin: '*' }));

app.get("/", (req, res) => {
    res.redirect("https://furwaz.com/projects/vybeen");
});

let q = null;
app.get("/search", (req, res) => {
    q = req.query.q;
    if (q === null || q === undefined || q === "") {
        res.json("Error : Invalid search parameter");
        return;
    }

    search(q).then(id => {
        infos(id).then(infos => {
            currentVideoInfos = infos;
            res.json({
                title: infos.title,
                author: infos.author,
                thumbnail: infos.thumbnail,
                length: infos.length,
                stream: `/stream`,
                lyrics: `/lyrics`
            });
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

    res.json({
        title: currentVideoInfos.title,
        author: currentVideoInfos.author,
        thumbnail: currentVideoInfos.thumbnail,
        length: currentVideoInfos.length,
        stream: `/stream`,
        lyrics: `/lyrics`
    });
});

app.get("/stream", (req, res) => {
    if (currentVideoInfos === null) {
        res.json("Error : No video currently playing");
        return;
    }

    res.json({
        stream: currentVideoInfos.stream,
        progress: Date.now() - currentVideoInfos.startTime
    });
});

app.get("/lyrics", (req, res) => {
    if (currentVideoInfos === null) {
        res.json("Error : No video currently playing");
        return;
    }

    lyrics(q).then(result => {
        res.json({
            lyrics: result
        });
    }).catch(err => {
        console.error(err);
        res.json("Error : Cannot get lyrics ("+err+")");
    });
});

app.listen(80);