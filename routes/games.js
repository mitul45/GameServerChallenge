var express = require('express');
var grid_creator = require('../utils/create-grid');
var request_validator = require('../utils/request-validator');
var db = require('../utils/db-util')

var router = express.Router();

/* get game details */
router.get('/:gameID', function(req, res, next) {

    var missingParams = request_validator.missingParams(req, ['gameID']);

    // check if the request parameter is missing or not.
    if(missingParams.length > 0){
        res.send(400, {errorMessage: "Missing request parameter " + missingParams});
        return;
    }
    var gameID = req.param('gameID');

    // get game object from db.
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
    var size = 15;
    var missingParams = request_validator.missingParams(req, ['playerID']);

    // check request parameter.
    if(missingParams.length > 0){
        res.send(400, {errorMessage: "Missing request parameter " + missingParams});
        return;
    }
    var playerID = req.param('playerID');
    
    // the word should not contain 's or numbers and it's length should be < size of grid.
    var acceptCriteria = function(word) {
        var char_code;
        if(word.length > 15)
            return false;
        for(var i = 0; i < word.length; i++) {
            char_code = word.charCodeAt(i);
            if(char_code < 97 || char_code > 122)
                return false;
        }
        return true;
    }

    // get random list of words from dictionary
    grid_creator.getDictionaryWords(size + 10, acceptCriteria, function (words) {
        
        // try to fit longest words first, as they might fail if added later.
        words = grid_creator.sortWords(words);

        // generate grid by chosing 10 words from given list.
        var response = grid_creator.generateGrid(words, size, 10);
        var grid = response['grid'];
        words = response['words'];
        var game = getGameObject(playerID, grid, words);

        // save game object to db.
        db.insert(game, function() {
            res.send(200, {gameID: game.gameID});
            return;
        }, function () {
            res.send(500, {errorMessage: "Some error occured while updating the DB."});
            return;        
        });
    });
});

/* start a new game */
router.post('/:gameID/start', function(req, res, next) {
    var missingParams = request_validator.missingParams(req, ['playerID', 'gameID'])
    
    // check if request parameter is missing.
    if(missingParams.length > 0) {
        res.send(400, {errorMessage: "Missing request parameter " + missingParams});
        return;
    }
    var playerID = req.param('playerID');
    var gameID = req.param('gameID');

    // start game.
    var onSuccess =  function(game) {

        // only admin can start the game.
        if(playerID !== game.admin){
            res.send(400, {errorMessage: "You are not creator of this game."});
            return;
        }

        // number of players should be > 2 and < 5
        if(game.players.length < 2) {
            res.send(500, {errorMessage: "Not enough players to start the game."});
            return;
        }

        if(game.players.length > 5) {
            res.send(500, {errorMessage: "More than 5 players have joined the game."});
            return;
        }

        // game should not have been started already.
        if(game.state !== 'CREATED') {
            res.send(500, {errorMessage: "Game already started."});
            return;
        }

        // change game state as 'STARTED'.
        game.state = 'STARTED';

        // update db.
        db.updateGameObject(game, function() {
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

// create game object.
function getGameObject(admin, grid, words) {
    var obj = {};
    obj.gameID = Date.now();
    obj.admin = admin;
    obj.state = 'CREATED';
    obj.players = [admin];
    obj.grid = grid;
    obj.words_left = words;
    obj.words_identified = {};
    obj.pass_count = 0;
    obj.current_player = 0;

    return obj;
}

module.exports = router;