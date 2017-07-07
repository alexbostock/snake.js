const model = require("../model/snake.js");
const uniqid = require("uniqid");

const serverKey = uniqid();	// For admin purposes

console.log("Server key:", serverKey);

const interval = 500;	// milliseconds

const width = 100;
const height = 50;

var game = new model.Game(interval, width, height);
var snakes = {};	// Maps client's unique id to array index in game model

var jsonState = JSON.stringify(game);

function stepGame() {
	jsonState = game.step();
}

var timer = setInterval(stepGame, interval);

function admin($) {
	if ($.params.key === serverKey) {
		switch ($.params.command) {
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

		$.end("Done");
	} else {
		$.status("403", "Forbidden");
		$.end("Forbidden");
	}
}

function control($) {
	var id = snakes[$.params.key];

	if (id !== undefined) {
		game.move($.params.dir, id);
		$.end("Done");
	} else {
		$.status("400", "Bad Request");
		$.end("Not done");
	}
}

function register($) {
	var id = game.addSnake();
	var key = uniqid(id + "-");

	snakes[key] = id;

	$.end(key);
}

function state($) {
	$.header("content-type", "application/json");
	$.end(jsonState);
}

exports.admin = admin;
exports.control = control;
exports.register = register;
exports.state = state;

