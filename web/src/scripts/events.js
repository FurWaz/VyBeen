// import User from "../../main/scripts/User";
import { fetchClients } from "./clients";
import { API_URL, fetchInfos } from "./main";

class Event {
    #type = "";
    #data = {};
    constructor(type, data) {
        this.#type = type;
        this.#data = data;
    }

    get type() { return this.#type; }
    get data() { return this.#data; }
}

let user_poll_id = -1;
function setupEvents() {
    pollEvents();
}

function getClientId() {
    return user_poll_id;
}

let audio = null;
function processEvent(event) {
    if (audio == null) audio = document.getElementById("audio");
    // console.log("new event: "+event.type+" (data: "+JSON.stringify(event.data)+")");
    switch (event.type) {
        case "newMusic":
            fetchInfos();
            break;
        case "newClient":
        case "clientRemoved":
            fetchClients();
            break;
        case "play":
            audio.play();
            setPlayingIcon(true);
            startMainLoop();
        case "pause":
            audio.pause();
            setPlayingIcon(false);
            break;
    
        default:
            break;
    }
}

function register() {
    return new Promise((resolve, reject) => {
        fetch(API_URL+"/register?name="+User.CurrentUser.username, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(res => {
            res.json().then(data => {
                if (typeof(data) == "string" && data.startsWith("Error")) {
                    reject(data);
                    return;
                }
                user_poll_id = data.id;
                // console.log("registered with id "+data.id);
                resolve();
            }).catch(reject);
        }).catch(reject);
    });
}

function pollEvents() {
    pollEvent().then(() => {
        pollEvents();
    }).catch(err => {
        // console.log("error while polling events: "+err);
        register().then(() => {
            pollEvents();
            fetchClients();
        }).catch(err => {
            // console.log("error while registering for events: "+err);
        });
    });
}

function pollEvent() {
    return new Promise((resolve, reject) => {
        // console.log("polling event with id "+user_poll_id);
        if (user_poll_id == -1) {
            reject("not registered");
            return;
        }
        fetch(API_URL+"/events?id="+user_poll_id, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Accept": "application/json" }
        }).then(res => {
            // console.log("event received !")
            res.json().then(data => {
                if (typeof(data) == "string" && data.startsWith("Error")) {
                    reject(data);
                    return;
                }
                processEvent(new Event(data.type, data.data));
                resolve();
            }).catch(reject);
        }).catch(reject);
    });
}

function getEvents() {
    return events.splice(0, events.length);
}

export { Event, getEvents, setupEvents, getClientId, pollEvents };