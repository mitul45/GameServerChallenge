var express = require('express');
var app = express();

var hello = app.route('/hello/:name');
hello.get(function(req, res) {
    res.send("Hello " + req.param('name'));
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server started listening: on https://%s:%s", host, port);
})
