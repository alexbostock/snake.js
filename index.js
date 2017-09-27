"use strict";

const game = require("./controller/logic.js");

const express = require("express");
const app = express();

app.post("/admin/:command/:key", game.admin);
app.post("/control/:key/:dir", game.control);
app.post("/register", game.register);
app.get("/state", game.state);

app.use(express.static(__dirname + "/view"));

app.use((req, res) => {
	res.sendStatus(400);
});

app.listen(8000, () => console.log("snake.js running on port 8000"));

