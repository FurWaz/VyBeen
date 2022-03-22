const { getVideoInfos, CONSTANTS } = require("./common");
const youtube = require("./youtube");
const playlist = require("./playlist");

let manager = {};

let clients = [];
const getClientIndex = client => {
    for (let i = 0; i < clients.length; i++)
        if (clients[i].id == client.id)
            return i;
    return -1;
}

function setup(server) {
    const io = require("socket.io")(server);
    youtube.setPlayCallback(sendVideoInfos);
    playlist.setUpdateCallback(updatePlaylist);
    io.on(CONSTANTS.CONNECTION, socket => {
        manager.sendTo(socket, CONSTANTS.SET_URL, getVideoInfos());
        manager.sendTo(socket, CONSTANTS.UPDATE_PLAYLIST, playlist.preview());
        clients.push({id: socket.id, name: "Guest"});
        manager.updateClients();
    
        socket.on(CONSTANTS.DISCONNECT, () => {
            clients.splice(getClientIndex(socket), 1);
            manager.updateClients();
        });
    
        socket.on(CONSTANTS.CHANGE_NAME, name => {
            clients[getClientIndex(socket)].name = name;
            manager.updateClients();
        });
    
        socket.on(CONSTANTS.GET_URL, search => {
            sendSearching();
            youtube.getVideoURL(search)
            .then(url => {
                sendLoading();
                youtube.getVideoInfos(url)
                .then(infos => {
                    playlist.addSong(infos);
                }).catch(err => {sendError("Error getting video informations"); console.error(err);});
            }).catch(err => {sendError("Error getting video url"); console.error(err);});
        });
    });
    
    manager.broadCast = (msg, args) => {
        io.sockets.emit(msg, args);
    };
    manager.sendTo = (socket, msg, args) => {
        socket.emit(msg, args);
    };
    manager.updateClients = () => {
        manager.broadCast(CONSTANTS.GUEST_LIST, clients);
    };
}

function updatePlaylist() {
    manager.broadCast(CONSTANTS.UPDATE_PLAYLIST, playlist.preview());
}
function sendVideoInfos() {
    manager.broadCast(CONSTANTS.SET_URL, getVideoInfos());
}
function sendSearching() {
    manager.broadCast(CONSTANTS.SEARCHING);
}
function sendLoading() {
    manager.broadCast(CONSTANTS.LOADING);
}
function sendError(err) {
    manager.broadCast(CONSTANTS.ERROR, err);
}

module.exports = {setup};