import ytdl from 'ytdl-core';

function infos(id) {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(id).then(info => {
            const res = info.formats.find(format => format.mimeType.startsWith("audio"));
            resolve({
                id: info.videoDetails.videoId,
                title: info.videoDetails.title,
                author: info.videoDetails.author.name,
                length: info.videoDetails.lengthSeconds,
                thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
                description: info.videoDetails.description,
                stream: res.url,
                startTime: Date.now()
            });
        });
    });
}

export default infos;