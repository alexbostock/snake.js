const interval = 500;

function Game(interval) {
	var game = this

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (this.readyState === 4) {
			if (this.status === 200) {
				game.id = this.responseText;
				setInterval(game.refresh, 500);
			} else {
				console.log("Error", this.status, "could not register");
			}
		}
	}

	xhr.open("POST", "register", true);
	xhr.send();

	this.control = function(key) {
		this.xhr2.open("POST", "control/" + this.id + "/" + key, true);
		this.xhr2.send();
	}

	this.draw = function() {
		var canvas = document.getElementById("canvas");

		var w = canvas.width;
		var h = canvas.height;

		// console.log("draw");
	}

	this.refresh = function() {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					game.state = JSON.parse(this.responseText);
					console.log(this.responseText);
					game.draw();
				} else {
					console.log("Error", this.status, "could not refresh");
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

	console.log(canvas.width, canvas.height);

	game.draw();
}

var game = new Game();

resizeCanvas();

 window.addEventListener("resize", resizeCanvas, false);

