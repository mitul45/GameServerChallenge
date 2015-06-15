var express = require('express');
var router = express.Router();

/* create a new game */
router.post('/create', function(req, res, next) {
    var playerID = req.param('playerID');
    res.send("Create game. User: " + playerID);
});

/* start a new game */
router.post('/:gameID/start', function(req, res, next) {
    var playerID = req.param('playerID');
    var gameID = req.param('gameID');
    res.send("Start game. User: " + playerID + ", Game: " + gameID);
});

/* get game details */
router.get('/:gameID', function(req, res, next) {
    var gameID = req.param('gameID');
    res.send("Game details. Game: " + gameID);
});

module.exports = router;
