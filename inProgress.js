const app = new require("express")();
const server = require("http").createServer(app);

app.get("/*", (req, res) => {
    if (req.url == "/") req.url = "/index.html";
    try {
        res.sendFile(__dirname+"/inProgress"+req.url);
    } catch (e) {
        res.write("404 Error");
        res.end();
    }
});

server.listen(5621);

process.on("SIGINT", () => {
    server.close();
    console.log("stopping server");
});