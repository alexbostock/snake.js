const model = require("../model/snake.js");
const uniqid = require("uniqid");

var game = new model.Game();

function register($) {
	$.end(uniqid("0-"));
}

exports.register = register;

