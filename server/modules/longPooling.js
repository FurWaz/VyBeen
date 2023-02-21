import { getClients, removeClient } from "./users.js";

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

/**@type {{req: Request, res: Response, id: number}[]} */
const requests = [];

let requestChecker = -1;

function registerNewRequest(req, res) {
    return new Promise((resolve, reject) => {
        const id = req.query["id"];
        if (!id) {
            reject("No client id provided");
            return;
        }
        getClients().then(clients => {
            const cIndex = clients.findIndex(client => client.id == id);
            if (cIndex < 0) {
                reject("Client not found");
                return;
            }
            const request = requests.find(request => request.id == id);
            if (request) {
                reject("Request already exists");
                return;
            }
            requests.push({req: req, res: res, id: id});
            if (requestChecker == -1) {
                requestChecker = setInterval(() => {
                    sendEvent(new Event("ping", {}))
                    .then(() => {}).catch(err => {});
                }, 1000);
            }
            resolve();
        });
    });
}

function sendEvent(event) {
    return new Promise((resolve, reject) => {
        getClients().then(clients => {
            clients.forEach(client => {
                sendEventTo(client.id, event).catch(err => {});
            });
            resolve();
        })
    });
}

function sendEventExceptTo(id, event) {
    return new Promise((resolve, reject) => {
        getClients().then(clients => {
            clients.forEach(client => {
                if (client.id != id) {
                    sendEventTo(client.id, event).catch(err => {});
                }
            });
            resolve();
        });
    });
}

function executeRequest(req, event) {
    return new Promise((resolve, reject) => {
        try {
            req.res.json({data: event.data, type: event.type});
            requests.splice(requests.findIndex(r => r.id == req.id), 1);
            resolve();
        }
        catch (err) {
            reject(err);
        }
    });
}

function sendEventTo(id, event) {
    return new Promise((resolve, reject) => {
        const request = requests.find(request => request.id == id);
        if (request) {
            executeRequest(request, event).then(resolve).catch(reject);
        } else {
            setTimeout(() => {
                const request = requests.find(request => request.id == id);
                if (request) {
                    executeRequest(request, event).then(resolve).catch(reject);
                } else {
                    removeClient(id).then(resolve).catch(reject);
                }
            }, 2000);
        }
    });
}

export { registerNewRequest, sendEvent, sendEventTo, sendEventExceptTo, Event };