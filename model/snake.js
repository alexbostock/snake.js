// snake.js
// Base data model

function Game(interval, w, h) {
	this.clock = 0;
	this.interval = interval
	this.snakes = [];

	this.width = w;
	this.height = h;

	this.wall = [];

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

	this.step = function() {
		this.clock++;

		for (var i = 0; i < this.snakes.length; i++) {
			var snake = this.snakes[i];
			
			if (! snake.dead) {
				snake.move();
			}
		}

		for (var i = 0; i < this.snakes.length; i++) {
			// Detect collisions

			if (this.snakes[i].dead) {
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

					if (this.snakes[i].pos.equals(this.snakes[j].tail[k])) {
						this.snakes[i].dead = true;

						// Kill both snakes iff the collision is head on
						if (this.snakes[i].vel.add(this.snakes[j].vel).equals(new Vector(0, 0))) {
							this.snakes[j].dead = true;
						}

						break snake;
					}
				}
			}

			for (var j = 0; j < this.wall.length; j++) {
				if (this.snakes[i].pos.equals(this.wall[j])) {
					this.snakes[i].dead = true;
					break;
				}
			}
		}

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
		// Should be called instead of move()

		this.pos = this.pos.add(this.vel);
		this.tail.unshift(this.pos);
	}

	// Start with length 3
	this.increaseLength();
	this.increaseLength();

	this.move = function() {
		this.pos = this.pos.add(this.vel);
	
		this.tail.unshift(this.pos);
		this.tail.pop();
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

