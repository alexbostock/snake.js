// snake.js
// Base data model

function Game(interval) {
	this.clock = 0;
	this.interval = interval
	this.snakes = [];

	this.addSnake = function() {
		var pos = new Vector(0, 0);
		var vel = new Vector(1, 0);

		this.snakes.push(new Snake(pos, vel));

		return this.snakes.length - 1;
	}

	this.move = function(dir, id) {
		if (id < this.snakes.length) {
			var s = this.snakes[id];

			switch (dir) {
				case "w":
					s.vel = new Vector(0, 1);
					break;

				case "a":
					s.vel = new Vector(-1, 0);
					break;

				case "s":
					s.vel = new Vector(0, -1);
					break;

				case "d":
					s.vel = new Vector(1, 0);
					break;
			}
		}
	}

	this.step = function() {
		this.clock++;

		for (var i = 0; i < this.snakes.length; i++) {
			this.snakes[i].move();
		}

		for (var i = 0; i < this.snakes.length; i++) {
			// Detect collisions

			snake:
			for (var j = 0; j < this.snakes.length; j++) {
				for (var k = 0; k < this.snakes[j].tail.length; k++) {
					if (i === j && k === 0) {
						continue;
					}

					if (this.snakes[i].position.equals(this.snakes[j].tail[k])) {
						this.snakes.splice(i, 1);
						break snake;
					}
				}
			}
		}

		return JSON.stringify(this);
	}
}

function Snake(pos, vel) {
	this.position = pos;
	this.velocity = vel;
	this.tail = [pos];

	this.move = function() {
		this.position = this.position.add(this.velocity);
	
		for (var i = 0; i < this.tail.length; i++) {
			this.tail[i] = this.tail[i].add(this.velocity);
		}
	}
}

function Vector(x, y) {
	this.x = x;
	this.y = y;

	this.add = function(v) {
		return new Vector(this.x + v.x, this.y + v.y);
	}

	this.equals = function(v) {
		return this.x == v.x && this.y == v.y;
	}

	this.subtract = function(v) {
		return new Vector(this.x - v.x, this.y - v.y);
	}
}

exports.Game = Game;

