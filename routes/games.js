var express = require('express');
var grid_creator = require('../utils/create-grid');
var request_validator = require('../utils/request-validator');
var db = require('../utils/db-util')

var router = express.Router();

/* get game details */
router.get('/:gameID', function(req, res, next) {
    var missingParams = request_validator.missingParams(req, ['gameID']);

    if(missingParams.length > 0){
        res.send(400, {errorMessage: "Missing request parameter " + missingParams});
        return;
    }

    var gameID = req.param('gameID');
    db.get(gameID, function(game) {
        res.send(200, game);
        return;
    }, function() {
        res.send(404, {errorMessage: "gameID not found."});
        return;
    });
});

/* create a new game */
router.post('/create', function(req, res, next) {
    var missingParams = request_validator.missingParams(req, ['playerID']);

    if(missingParams.length > 0){
        res.send(400, {errorMessage: "Missing request parameter " + missingParams});
        return;
    }
    var playerID = req.param('playerID');
    var words = ['some','sample','words','as','input'];
    var grid = grid_creator.generateGrid(words, 15);

    var game = getGameObject(playerID, grid, words);

    db.insert(game, function() {
        res.send(200, {gameID: game.gameID});
        return;
    }, function () {
        res.send(500, {errorMessage: "Some error occured while updating the DB."});
        return;        
    });
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
    var missingParams = request_validator.missingParams(req, ['playerID', 'gameID'])
    
    // request parameter missing.
    if(missingParams.length > 0) {
        res.send(400, {errorMessage: "Missing request parameter " + missingParams});
        return;
    }
    var playerID = req.param('playerID');
    var gameID = req.param('gameID');
    var onSuccess =  function(game) {
        if(playerID !== game.admin){
            res.send(400, {errorMessage: "You are not creator of this game."});
            return;
        }

        if(game.players.length < 2) {
            res.send(500, {errorMessage: "Not enough players to start the game."});
            return;
        }

        if(game.players.length > 5) {
            res.send(500, {errorMessage: "More than 5 players have joined the game."});
            return;
        }

        // change game state as 'STARTED'.
        game.state = 'STARTED';
        db.update(gameID, 'state', 'STARTED', function() {
            res.send(200, game);
            return;
        }, function() {
            res.send(500, {errorMessage: "Some error occured while updating DB."});
            return;
        });
    }

    var onFailure = function() {
        res.send(404, {errorMessage: "gameID not found."});
    }
    db.get(gameID, onSuccess, onFailure);
});

module.exports = router;
