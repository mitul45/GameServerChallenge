var express = require('express');
var router = express.Router();
var db = require('../utils/db-util');

// get data from request object, which was being set by app.js: attachParams method.

/* play a move */
router.post('/play', function(req, res, next) {
    var gameID = req.gameID;
    var playerID = req.playerID;
    var body = JSON.parse(req.body);
    res.send("Play turn. User: "+ playerID + ", Game: " + gameID + ", Body: " + body);
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