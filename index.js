const game = require("./controller/logic.js");

var server = require("diet");
var app = server();
app.listen(8000);

app.get("/", function($) {
	$.sendFile("view/index.html");
});

app.get("/register", game.register);

var static = require("diet-static")({path : app.path + "/view"});

app.footer(static);

