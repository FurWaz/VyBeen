const app = new require("express")();
const server = require("http").createServer(app);
const clients = require("./modules/clients");

app.get("/*", (req, res) => {
    if (req.url == "/") req.url = "/index.html";
    try {
        res.sendFile(__dirname+"/client"+req.url);
    } catch (e) {
        res.write("404 Error");
        res.end();
    }
});

clients.setup(server);
server.listen(5621);

process.on("SIGINT", () => {
    server.close();
    process.exit(0);
});