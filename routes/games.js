var express = require('express');
var db = require('mongoskin').db('mongodb://localhost:27017/GameServerChallenge');
var gameCreator = require('./create-game');
var router = express.Router();

var collection = db.collection('games');

/* create a new game */
router.post('/create', function(req, res, next) {
    var playerID = req.param('playerID');
    var grid = gameCreator.generateGrid(['some','sample','words','as','input'], 15);
    console.log(gameCreator.toString(grid));
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
