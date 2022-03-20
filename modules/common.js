const CONSTANTS = {
    SEARCHING: "custom/searchingURL",
    LOADING: "custom/loadingURL",
    SET_URL: "custom/setURL",
    GUEST_LIST: "custom/guestsList",
    CHANGE_NAME: "custom/changeName",
    GET_URL: "custom/getURL",
    ERROR: "custom/error",
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    UPDATE_PLAYLIST: "custom/updatePlaylist"
}

let videoInfos = null;
function getVideoInfos() {return videoInfos;}
function setVideoInfos(infos) {videoInfos = infos;}

module.exports = {
    CONSTANTS,
    getVideoInfos,
    setVideoInfos
}