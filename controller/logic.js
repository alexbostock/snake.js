const model = require("../model/snake.js");
const uniqid = require("uniqid");

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

function control($) {
	var id = snakes[$.params.key];

	if (id !== undefined) {
		game.move($.params.dir, id);
		$.end("Done");
	} else {
		$.status("400", "Bad Request");
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

exports.control = control;
exports.register = register;
exports.state = state;

