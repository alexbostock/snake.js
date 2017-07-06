const model = require("../model/snake.js");
const uniqid = require("uniqid");

var game = new model.Game();
var snakes = {};	// Maps client's unique id to array index in game model

function control($) {
	var id = snakes[$.params.key];

	if (id !== undefined) {
		game.move($.params.dir, id);
	}

	$.end();
}

function register($) {
	var id = game.addSnake();
	var key = uniqid(id);

	snakes[key] = id;

	$.end(key);
}

function state($) {
	$.end();
}

exports.control = control;
exports.register = register;
exports.state = state;

