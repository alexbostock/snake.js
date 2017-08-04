"use strict";

function Game(interval) {
	var game = this

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (this.readyState === 4) {
			if (this.status === 200) {
				console.log(this.responseText);

				var res = this.responseText.split(",");

				game.id = res[0];
				game.interval = parseInt(res[1]);

				console.log(game.id);
				console.log(game.interval);

				setInterval(game.refresh, game.interval);

				console.log(game.id);
			} else {
				console.error(this.status, "could not register");
			}
		}
	}

	xhr.open("POST", "register", true);
	xhr.send();

	this.control = function(key) {
		var req = new XMLHttpRequest();

		req.open("POST", "control/" + this.id + "/" + key, true);
		req.send();
	}

	this.draw = function() {
		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");

		var w = canvas.width;
		var h = canvas.height;

		context.fillStyle = "#FFFFFF";
		context.fillRect(0, 0, w, h);

		var cellSize = Math.min(w / this.state.width, h / this.state.height);
		cellSize = Math.floor(cellSize);

		var leftMargin = (w - this.state.width * cellSize) / 2;
		var topMargin = (h - this.state.height * cellSize) / 2;

		for (var i = 0; i < this.state.snakes.length; i++) {
			var snake = this.state.snakes[i];

			if (snake.dead) {
				continue;
			}

			context.fillStyle = snake.colour;

			snake = snake.tail;

			for (var j = 0; j < snake.length; j++) {
				var x = snake[j].x;
				var y = snake[j].y;

				context.fillRect(leftMargin + x * cellSize, topMargin + y * cellSize, cellSize, cellSize);
			}
		}

		context.fillStyle = "#000000";

		for (var i = 0; i < this.state.wall.length; i++) {
			var x = this.state.wall[i].x;
			var y = this.state.wall[i].y;

			context.fillRect(leftMargin + x * cellSize, topMargin + y * cellSize, cellSize, cellSize);
		}

		context.fillStyle = "#FF0000";

		for (var i = 0; i < this.state.apples.length; i++) {
			var x = this.state.apples[i].x;
			var y = this.state.apples[i].y;

			context.fillRect(leftMargin + x * cellSize, topMargin + y * cellSize, cellSize, cellSize);
		}
	}

	this.keyPressHandler = function(k) {
		// Handles wasd and cursor keys

		switch (k.which) {
			case 38:
			case 87:
				game.control("w");
				break;

			case 37:
			case 65:
				game.control("a");
				break;

			case 40:
			case 83:
				game.control("s");
				break;

			case 39:
			case 68:
				game.control("d");
				break;

			// Do nothing for any other key
		}
	}

	this.refresh = function() {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					game.state = JSON.parse(this.responseText);
					game.draw();
				} else {
					console.error(this.status, "could not refresh");
				}
			}
		}
		
		xhr.open("GET", "state", true);
		xhr.send();
	}
}

function resizeCanvas() {
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
}

var game = new Game();

resizeCanvas();

window.addEventListener("resize", resizeCanvas, false);

window.addEventListener("keyup", game.keyPressHandler, false);

