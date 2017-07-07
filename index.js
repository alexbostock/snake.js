const game = require("./controller/logic.js");

var server = require("diet");
var app = server();
app.listen("http://localhost:8000");

app.get("/", function($) {
	$.sendFile("view/index.html");
});

app.get("/play", function($) {
	$.sendFile("view/play.html");
});

app.post("/admin/:command/:key", game.admin);
app.post("/control/:key/:dir", game.control);
app.post("/register", game.register);
app.get("/state", game.state);

var static = require("diet-static")({path : app.path + "/view"});

app.footer(static);

