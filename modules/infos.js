import ytdl from 'ytdl-core';

function getSongInfos(title, author) {
    /**@type {String} */
    let res = title;
    res = res.replace(/ *\([^)]*\) */g, "");
    res = res.replace(/ *\[[^)]*\] */g, "");

    const separators = [":", "|", "-"];

    const splitBy = (str, char) => {
        if (str.includes(" "+char+" ")) {
            const split = str.split(" "+char+" ");
            return {
                artist: split[0].trim(),
                title: split[1].trim()
            };
        } else return str;
    };

    for (let i = 0; i < separators.length; i++) {
        const sep = separators[i];
        const split = splitBy(res, sep);
        if (typeof split !== "string") {
            return {
                artist: split.artist,
                title: split.title
            };
        }
    }
    
    return {
        artist: author,
        title: res
    };
}

function infos(id) {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(id).then(info => {
            const res = info.formats.find(format => format.mimeType.startsWith("audio"));
            const songInfos = getSongInfos(info.videoDetails.title, info.videoDetails.author.name);
            resolve({
                id: info.videoDetails.videoId,
                title: songInfos.title,
                author: songInfos.artist,
                length: info.videoDetails.lengthSeconds * 1000,
                thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
                description: info.videoDetails.description,
                stream: res.url,
                startTime: Date.now()
            });
        });
    });
}

export default infos;