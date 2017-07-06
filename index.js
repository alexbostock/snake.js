const model = require("./model/snake.js");

var game = new model.Game();

var server = require("diet");
var app = server();
app.listen(8000);

var static = require("diet-static")({path : app.path + "/static"});

app.footer(static);

