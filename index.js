const game = require("./controller/logic.js");

const config = require("./config.js");

const root = config.root;

const express = require("express");
const app = express();

app.get("/", (req, res) => {
	res.sendFile("./view/index.html", {root: root});
});

app.get("/play", (req, res) => {
	res.sendFile("./view/play.html", {root: root});
});

app.post("/admin/:command/:key", game.admin);
app.post("/control/:key/:dir", game.control);
app.post("/register", game.register);
app.get("/state", game.state);

app.use(express.static("view"));

app.use((req, res) => {
	res.sendStatus(400);
}

app.listen(8000, () => console.log("snake.js running on port 8000"));

