var express = require('express');
var router = express.Router();

// get data from request object, which was being set by app.js: attachParams method.

/* play a move */
router.post('/play', function(req, res, next) {
    var gameID = req.gameID;
    var playerID = req.playerID;
    var body = req.body;
    res.send("Play turn. User: "+ playerID + ", Game: " + gameID + ", Body: " + body);
});

/* pass turn */
router.post('/pass', function(req, res, next) {
    var gameID = req.gameID;
    var playerID = req.playerID;
    res.send("Pass turn. User: " + playerID + ", Game: " + gameID);
});

/* join a game */
router.post('/join', function(req, res, next) {
    var gameID = req.gameID;
    var playerID = req.playerID;
    res.send("Join game. User: " + playerID + ", Game: " + gameID);
});

module.exports = router;