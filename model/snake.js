// snake.js
// Base data model

function Game(interval, w, h) {
	this.clock = 0;
	this.interval = interval
	this.snakes = [];

	this.width = w;
	this.height = h;

	this.wall = [];
	this.apples = [];

	for (var i = 0; i < w; i++) {
		this.wall.push(new Vector(i, 0));
		this.wall.push(new Vector(i, h - 1));
	}

	for (var i = 1; i < h - 1; i++) {
		this.wall.push(new Vector(0, i));
		this.wall.push(new Vector(w - 1, i));
	}

	this.addSnake = function() {
		var pos = new Vector(this.width / 2, this.height / 2);
		var vel = new Vector(1, 0);

		var snake = new Snake(pos, vel);

		// First try to replace any dead snakes

		var index = -1;

		for (var i = 0; i < this.snakes.length; i++) {
			if (this.snakes[i].dead) {
				index = i;
				break;
			}
		}

		if (index === -1) {
			// If there are no dead snakes, add a new one to the list

			this.snakes.push(snake);
			index = this.snakes.length - 1;
		} else {
			this.snakes[i] = snake;
		}

		return index;
	}

	this.move = function(dir, id) {
		if (id < this.snakes.length) {
			var s = this.snakes[id];

			switch (dir) {
				case "w":
					var v = new Vector(0, -1);
					break;

				case "a":
					var v = new Vector(-1, 0);
					break;

				case "s":
					var v = new Vector(0, 1);
					break;

				case "d":
					var v = new Vector(1, 0);
					break;

				default:
					return false;
			}

			if (v.add(s.vel).equals(new Vector(0, 0))) {
				// Don't allow about turn
				return false;
			} else {
				s.vel = v;
				return true;
			}
		}
	}

	this.occupied = function(cell) {
		// Checks whether a cell is occupied

		for (var i = 0; i < this.wall.length; i++) {
			if (cell.equals(this.wall[i])) {
				return true;
			}
		}

		for (var i = 0; i < this.apples.length; i++) {
			if (cell.equals(this.apples[i])) {
				return true;
			}
		}

		for (var i = 0; i < this.snakes.length; i++) {
			var snake = this.snakes[i].tail;

			for (var j = 0; j < snake.length; j++) {
				if (cell.equals(snake[j])) {
					return true;
				}
			}
		}

		return false;
	}

	this.spawnApples = function() {
		var numApples = this.apples.length;

		var prob;
		if (numApples === 0) {
			prob = 1;
		} else if (numApples < 20) {
			prob = 1 - numApples / 20;
		} else {
			prob = 0;
		}

		// Fudge factor so we don't spawn apples too much
		prob /= 5;

		var rand = Math.random();

		if (rand < prob) {
			do {
				var x = randomInt(0, this.width - 1);
				var y = randomInt(0, this.height - 1);

				var cell = new Vector(x, y);
			} while (this.occupied(cell));

			this.apples.push(cell);
		}
	}

	this.step = function() {
		this.clock++;

		for (var i = 0; i < this.snakes.length; i++) {
			var snake = this.snakes[i];
			
			if (! snake.dead) {
				snake.move();
			}
		}

		// Detect collisions
		
		for (var i = 0; i < this.snakes.length; i++) {
			// Detect collisions

			var snake = this.snakes[i]

			if (snake.dead) {
				continue;
			}

			snake:
			for (var j = 0; j < this.snakes.length; j++) {
				if (this.snakes[j].dead) {
					continue;
				}

				for (var k = 0; k < this.snakes[j].tail.length; k++) {
					if (i === j && k === 0) {
						continue;
					}

					if (snake.pos.equals(this.snakes[j].tail[k])) {
						snake.dead = true;

						// Kill both snakes iff the collision is head on
						if (snake.vel.add(this.snakes[j].vel).equals(new Vector(0, 0))) {
							this.snakes[j].dead = true;
						}

						break snake;
					}
				}
			}

			for (var j = 0; j < this.wall.length; j++) {
				if (snake.pos.equals(this.wall[j])) {
					snake.dead = true;
					break;
				}
			}

			for (var j = 0; j < this.apples.length; j++) {
				if (snake.pos.equals(this.apples[j])) {
					snake.increaseLength();
					this.apples.splice(j, 1);
				}
			}
		}

		this.spawnApples();

		return JSON.stringify(this);
	}
}

function Snake(pos, vel) {
	this.pos = pos;
	this.vel = vel;
	this.tail = [pos];
	this.dead = false;

	this.colour = "#00FF00";

	this.increaseLength = function() {
		// Make the tail one cell longer

		this.tail.push(this.trail);
	}

	this.move = function() {
		this.pos = this.pos.add(this.vel);
	
		this.tail.unshift(this.pos);
		this.trail = this.tail.pop();
	}

	// Start with length 3
	this.move();
	this.increaseLength();
	this.move();
	this.increaseLength();
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

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

