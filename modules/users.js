import { sendEvent, sendEventExceptTo, Event } from "./longPooling.js";

let USER_ID_COUNTER = 0;
function getNewUserID() { return USER_ID_COUNTER++; }

class Client {
    #name = "";
    #id = -1;

    constructor(name="Anonymous") {
        this.#name = name;
        this.#id = getNewUserID();
    }

    get name() { return this.#name; }
    get id() { return this.#id; }

    set name(name) { this.#name = name; }
}

const clients = [];

function registerClient(name) {
    return new Promise((resolve, reject) => {
        const client = new Client(name);
        clients.push(client);
        sendEventExceptTo(client.id, new Event("newClient", {id: client.id, name: client.name}));
        resolve(client);
    });
}

function getClients() {
    return new Promise((resolve, reject) => {
        resolve(clients);
    });
}

function getClient(id) {
    return new Promise((resolve, reject) => {
        const client = clients.find(client => client.id == id);
        if (client) resolve(client);
        else reject("Client not found");
    });
}

function changeClientName(id, name) {
    return new Promise((resolve, reject) => {
        getClient(id).then(client => {
            client.name = name;
            sendEventExceptTo(client.id, new Event("clientNameChanged", {id: client.id, name: client.name}))
            .then(() => { resolve(client); }).catch(reject);
        }).catch(reject);
    });
}

function removeClient(id) {
    return new Promise((resolve, reject) => {
        const index = clients.findIndex(client => client.id == id);
        if (index >= 0) {
            clients.splice(index, 1);
            sendEvent(new Event("clientRemoved", id))
            .then(resolve).catch(reject);
            resolve();
        } else reject("Client not found");
    });
}

export { registerClient, getClients, getClient, changeClientName, removeClient };