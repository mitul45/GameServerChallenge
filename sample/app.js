var express = require('express');
var app = express();

var db = require('mongoskin').db('mongodb://localhost:27017/names');



var hello = app.route('/hello');
hello.get(function(req, res) {
    db.collection('hello').find().toArray(function(err, result) {
        if(err)
            throw err;
        res.json(result);
    })
});

hello.post(function(req, res) {
    var name = req.param("name");
    db.collection('hello').insert( {name: name}, function(err) {
        if(err)
            throw err
        console.log(name + "added.");
    });
    res.send('Item added.');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server started listening: on https://%s:%s", host, port);
});
