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

        var game = getGameObject(playerID, grid, words);
        console.log("game object: " + game);

        gameDB.insert(game, function(err) {
            if(err){
                res.status(500);
                res.send("Internal server error");
            }
        });
        console.log(gameCreator.toString(grid));
        res.status(200);
        res.json(game);
    } else {
        res.status(400);
        res.send("Request parameter missing.");
    }
});

function getGameObject(admin, grid, words) {
    var obj = {};
    obj.gameID = Date.now();
    obj.admin = admin;
    obj.state = 'CREATED';
    obj.players = [admin];
    obj.grid = grid;
    obj.words_left = words;
    obj.words_identified = [];

    return obj;
}

/* start a new game */
router.post('/:gameID/start', function(req, res, next) {
    var playerID = req.param('playerID');
    var gameID = req.param('gameID');
    if(gameID && gameID !== "" && playerID && playerID !== "")
    {
        getGameObjectFromDB(gameID, function(game) {
            if(game === null) {
                res.status(404);
                res.send("gameID not found");
            } else {
                if(playerID !== game.admin){
                    res.status(400);
                    res.send("You are not the admin for this game.");
                }
                // TODO: check number of players and update game state as STARTED.
            }
        });
    } else {
        res.status(400);
        res.send("Request parameter missing.");
    }
    res.send("Start game. User: " + playerID + ", Game: " + gameID);
});

/* get game details */
router.get('/:gameID', function(req, res, next) {
    var gameID = req.param('gameID');
    if(gameID && gameID !== "")
    {
        console.log(gameID);
        getGameObjectFromDB(gameID, function(game) {
            if(game === null) {
                res.status(404);
                res.send("gameID not found");
            } else {
                res.status(200);
                res.json(game);
            }
        });
    } else {
        res.status(400);
        res.send("Request parameter missing.");
    }
});

function getGameObjectFromDB(gameID, onSuccess) {
    gameDB.findOne({gameID: parseInt(gameID)}, function(err, result) {
        if(result && result !== '')
            onSuccess(result);
        else
            onSuccess(null);
    });
}

module.exports = router;
