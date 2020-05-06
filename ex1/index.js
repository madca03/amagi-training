"use strict";

const express = require("express");
const http = require("http");
const path = require("path");
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

const port = 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);

function onListening() {
    const addr = server.address();
    const bind = typeof(addr) === "string"
        ? "pipe " + addr
        : "port " + addr.port;

    console.log(`Listening on ${bind}`);
}