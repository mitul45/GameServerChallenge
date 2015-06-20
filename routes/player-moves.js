var express = require('express');
var router = express.Router();
var db = require('../utils/db-util');
var dictionary = require('../utils/dictionary');

// get data from request object, which was being set by app.js: attachParams method.

/* play a move */
router.post('/play', function(req, res, next) {
    var gameID = req.gameID;
    var playerID = req.playerID;
    var body = JSON.parse(req.body);
    var word = body['word'];
    var starting_location = body['starting-location'];
    var direction = body['direction'];

    db.get(gameID, function (game) {
        if(game.state !== 'STARTED') {
            res.send(400, {errorMessage: "Game is in " + game.state + " state."});
            return;            
        }

        if(game.players[game.current_player] !== playerID) {
            res.send(400, {errorMessage: "It's not your turn, current player: " + game.players[game.current_player] + "."});
            return;            
        }

        // reset pass count.
        game.pass_count = 0;
        game.current_player = (game.current_player + 1) % game.players.length;
        if(game.words_identified[word]) {
            res.send(400, {errorMessage: "Word already identified.", 
                Word: game.words_identified[word],
                Message: "Next Player: " + game.players[game.current_player]});
            db.updateGameObject(game, function() {
                return;
            }, function() {
                return;
            });
            return;
        }

        // check if the word is dictionary word or not.
        if(!dictionary.isDictionaryWord(word)) {
            res.send(400, {errorMessage: "Not a dictionary word."});
            return;
        }

        var identified_word = {};
        identified_word['word'] = word;
        identified_word['starting-location'] = starting_location;
        identified_word['identified-by'] = playerID;
        identified_word['direction'] = direction;
        // set this word as word identified.
        game.words_identified[word] = identified_word;
        
        // remove this word from words_left array.
        var index = game.words_left.indexOf(word);
        if(index > -1) {
            game.words_left.splice(index, 1);
        }

        // if all words have been identified, game is over.
        if(game.words_left.length === 0) {
            game.state = 'FINISHED';
            db.updateGameObject(game, function() {
                res.send(200, {Message: "Game finished."});
                return;
            }, function() {
                res.send(500, {errorMessage: "Some error occured while updating DB."});
                return;
            });
            return;
        }

        // next player.
        db.updateGameObject(game, function() {
            res.send(200, {Word: game.words_identified[word], Message: "Next Player: " + game.players[game.current_player]});
            return;
        }, function() {
            res.send(500, {errorMessage: "Some error occured while updating DB."});
            return;
        });
    }, function() {
        res.send(404, {errorMessage: "gameID not found"});
        return;
    });

});

/* pass turn */
router.post('/pass', function(req, res, next) {
    var gameID = req.gameID;
    var playerID = req.playerID;
    db.get(gameID, function (game) {
        if(game.state !== 'STARTED') {
            res.send(400, {errorMessage: "Game is in " + game.state + " state."});
            return;            
        }

        if(game.players[game.current_player] !== playerID) {
            res.send(400, {errorMessage: "It's not your turn, current player: " + game.players[game.current_player] + "."});
            return;            
        }

        game.pass_count++;
        if(game.pass_count === game.players.length) {
            // game has ended.
            game.state = 'FINISHED';
            db.updateGameObject(game, function() {
                res.send(200, {Message: "Game finished."});
                return;
            }, function() {
                res.send(500, {errorMessage: "Some error occured while updating DB."});
                return;
            });
            return;
        }

        game.current_player = (game.current_player + 1) % game.players.length;
        db.updateGameObject(game, function() {
            res.send(200, {Message: "Next Player: " + game.players[game.current_player]});
            return;
        }, function() {
            res.send(500, {errorMessage: "Some error occured while updating DB."});
            return;
        });
    }, function() {
        res.send(404, {errorMessage: "gameID not found"});
        return;
    });
});

/* join a game */
router.post('/join', function(req, res, next) {
    var gameID = req.gameID;
    var playerID = req.playerID;
    db.get(gameID, function(game) {
        if(game.players.length >= 5) {
            res.send(500, {errorMessage: "This game has already 5 players."});
            return;
        }
        if(game.state !== 'CREATED') {
            res.send(500, {errorMessage: "Game has already started."});
            return;
        }
        game.players.push(playerID);
        db.updateGameObject(game, function() {
            res.send(200, {Players: game.players});
            return;
        }, function() {
            res.send(500, {errorMessage: "Some error occured while updating DB."});
            return;
        });
    }, function() {
        res.send(404, {errorMessage: "gameID not found."});
        return;
    });
});

module.exports = router;