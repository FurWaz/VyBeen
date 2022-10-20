import express from 'express';
import search from './modules/search.js';
import infos from './modules/infos.js';

const app = express();
let currentVideoInfos = null;

app.get("/", (req, res) => {
    res.redirect("https://furwaz.com/vybeen");
});

app.get("/search", (req, res) => {
    const q = req.query.q;
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
        res.json("Error : Cannot find a video from the given prompt");
    })
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
    res.send({
        stream: currentVideoInfos.stream,
        progress: Date.now() - currentVideoInfos.startTime
    });
});

app.listen(80);