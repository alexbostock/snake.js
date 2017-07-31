const model = require("../model/snake.js");
const uniqid = require("uniqid");

const serverKey = uniqid();	// For admin purposes

console.log("Server key:", serverKey);

const interval = 300;	// milliseconds

const width = 100;
const height = 50;

var game = new model.Game(interval, width, height);
var snakes = {};	// Maps client's unique id to array index in game model

var jsonState = JSON.stringify(game);

function stepGame() {
	jsonState = game.step();
}

var timer = setInterval(stepGame, interval);

function admin(req, res) {
	if (req.params.key === serverKey) {
		switch (req.params.command) {
			case "reset":
				clearInterval(timer);
				game = new modeL.Game(interval, width, height);
				snakes = {};
				jsonState = JSON.stringify(game);

				// Fall through to restart

			case "start":
				timer = setInterval(stepGame, interval);
				break;

			case "stop":
				clearInterval(timer);
				break;
		}

		res.sendStatus(200);
	} else {
		res.sendStatus(403);
	}
}

function control(req, res) {
	var id = snakes[req.params.key];

	if (game.move(req.params.dir, id)) {
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}

function register(req, res) {
	var id = game.addSnake();
	var key = uniqid(id + "-");

	snakes[key] = id;

	res.send(key + "," + interval);
}

function state(req, res) {
	res.type("json");
	res.send(jsonState);
}

exports.admin = admin;
exports.control = control;
exports.register = register;
exports.state = state;

