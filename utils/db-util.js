var db = require('mongoskin').db('mongodb://localhost:27017/GameServerChallenge');
var games = db.collection('games');

var insert = function(game, onSuccess, onFailure) {
	games.insert(game, function(err) {
		if (err) {
			onFailure();
			return;
		}
		onSuccess();
	})
}

var get = function (gameID, onSuccess, onFailure) {
    games.findOne({gameID: parseInt(gameID)}, function(err, result) {
	    if(err) {
	    	onFailure(); 
	    	return;
		} else if(result && result !== '') {
	        onSuccess(result); 
	        return;
	    } else {
	        onFailure();
	        return;
	    }
    })
}

var updateGameObject = function(game, onSuccess, onFailure) {
	delete game['_id'];
	games.update({'gameID': parseInt(game.gameID)}, game, function(err, result) {
		if(err){
			onFailure();
			return;
		}
		onSuccess();
	})
}

module.exports = {
	get: get,
	insert: insert,
	updateGameObject: updateGameObject
}