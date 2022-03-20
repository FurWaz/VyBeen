let songs = [];
let playCallback = () => {};
let updateCallback = () => {};

function addSong(song) {
    song.id = Date.now();
    songs.push(song);
    updateCallback();
    playCallback();
    return true;
}

function addSongs(titles) {
    titles.forEach(addSong);
    return true;
}

function remSong(id) {
    const index = getSongIndex(id);
    if (index < 0) return false;
    const res = songs.splice(index, 1).length > 0;
    updateCallback();
    playCallback();
    return res;
}

function getSongIndex(id) {
    return songs.findIndex(s => s.id == id);
}

function getSong(id) {
    const index = getSongIndex(id);
    if (index < 0) return null;
    return songs[index];
}

function getLastSong() {
    return (songs.length > 0)? songs[0]: null;
}

function next() {
    if (songs.length < 1) return null;
    const song = songs[0];
    remSong(song.id);
    updateCallback();
    return song;
}

function clear() {
    songs = [];
    return true;
}

function setPlayCallback(callback) {
    playCallback = callback;
}

function setUpdateCallback(callback) {
    updateCallback = callback;
}

function preview() {
    return songs.map(s => {return {title: s.infos.title, thumbnail: s.infos.thumbnail}})
}

module.exports = {
    addSong,
    addSongs,
    remSong,
    getSong,
    setPlayCallback,
    setUpdateCallback,
    next,
    clear,
    preview,
    getLastSong,
    callback: () => {next(); playCallback();}
}