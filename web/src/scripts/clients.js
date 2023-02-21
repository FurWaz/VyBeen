import { API_URL } from "./main";
import { updateClientsList } from "./uiManager";

const clients = [];

function fetchClients() {
    fetch(API_URL+"/clients", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(res => {
        res.json().then(clients => {
            if (typeof(clients) == "string" && clients.startsWith("Error")) {
                return;
            }
            setClients(clients);
        });
    });
}

function getClients() {
    return clients;
}

function addClient(client) {
    clients.push(client);
    updateClientsList();
}

function removeClient(id) {
    clients.splice(clients.findIndex(c => c.id == id), 1);
    updateClientsList();
}

function getClientById(id) {
    return clients.find(client => client.id == id);
}

function setClients(array) {
    clients.splice(0, clients.length);
    array.forEach(client => {
        clients.push(client);
    });
    updateClientsList();
}

export { addClient, getClientById, getClients, removeClient, setClients, fetchClients };