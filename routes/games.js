var express = require('express');
var db = require('mongoskin').db('mongodb://localhost:27017/GameServerChallenge');
var gameCreator = require('./create-game');
var router = express.Router();

var gameDB = db.collection('games');

/* create a new game */
router.post('/create', function(req, res, next) {
    var playerID = req.param('playerID');
    if(playerID && playerID !== "")
    {
        var words = ['some','sample','words','as','input'];
        var grid = gameCreator.generateGrid(words, 15);
        var gameID = Date.now();

        var gameObject = {};
        gameObject.grid = grid;
        gameObject.admin = playerID;
        gameObject.gameID = gameID;

        gameDB.insert(gameObject, function(err) {
            if(err){
                res.status(500);
                res.send("Internal server error");
            }
        });
        console.log(gameCreator.toString(grid));
        res.json(gameObject);
    } else {
        res.status(400);
        res.send("Request parameter missing.");
    }
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
    if(gameID && gameID !== "")
    {
        console.log('gameID' + gameID);
        gameDB.find({gameID: parseInt(gameID)}).toArray(function(err, result) {
            console.log(result);
            if (err)
                throw err;
            if (!result || result == "" || result.length === 0) {
                res.status(404);
                res.send("gameID not found");
            } else {
                res.json(result);
            }
        })
    } else {
        res.status(400);
        res.send("Request parameter missing.");
    }
});

module.exports = router;
