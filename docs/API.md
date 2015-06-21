##API Specification

1. `POST /games/create`
  - *Description* : Create a new game on server.
  - *Parameters* : `playerID`
  - *Returns* : 
	- `200`: `gameID`
  - *cURL*: `curl -X POST https://calm-ravine-1782.herokuapp.com/games/create?playerID=player1`

2. `POST /games/{gameID}/start`
  - *Description*: Start a game already created
  - *Parameters* : `playerID` - only admin can start the game
  - *Returns* : 
	- `200`: OK `game` object returned
	- `400`: Request param missing | `playerID` is not admin for this game.
	- `404`: `gameID` not found.
	- `500`: Not enough number of players | game already started | DB error
  - *cURL*: `curl -X POST https://calm-ravine-1782.herokuapp.com/games/1434876834694/start?playerID=player1` 

3. `POST /games/{gameID}/players/{playerID}/join`
  - *Description*: Join a game created by some other user.
  - *Path Parameters* : `playerID`, `gameID`
  - *Returns* : 
	- `200`: `players` array on success.
	- `404`: `gameID` not found.
	- `500`: Game already `STARTED` or `FINISHED` | Already has 5 players joined the game | DB error
  - *cURL*: `:curl -X POST https://calm-ravine-1782.herokuapp.com/games/1434876834694/players/player2/join`

4. `POST /games/{gameID}/players/{playerID}/play`
  - *Description*: Play user's turn
  - *Path Parameters* : `playerID`, `gameID`
  - *Body* : `
{
	"word": string,
	"starting location": [i, j],
	"direction" : UP | DOWN | LEFT | RIGHT
}
`
  - *Returns* : 
	- `200`: `word` obejct and next player detail.
	- `400`: Game not started yet | Not your turn | Word already identified | Not a dictionary word
	- `404`: `gameID` not found.
	- `500`: DB error.
  - *cURL*: `curl -d '{"word":"hello","starting-location":[1, 2],"direction":"UP"}' https://calm-ravine-1782.herokuapp.com/games/1434876834694/players/player1/play` - somehow this cURL request is not working, you can test this API with postman or some rest client.

5. `POST /games/{gameID}/players/{playerID}/pass`
  - *Description*: Pass user's turn
  - *Path Parameters* : `playerID`, `gameID`
  - *Returns* : 
	- `200`: Next player detail.
	- `400`: Game not started yet | Not your turn 
	- `404`: `gameID` not found.
	- `500`: DB error.
  - *cURL*: `curl -X POST https://calm-ravine-1782.herokuapp.com/games/1434876834694/players/player1/pass`

6. `GET /games/{gameID}`
  - *Description*: GET games' current state.
  - *Path Parameters* : `gameID`
  - *Returns* : 
	- `200`: `game` object.
	- `404`: `gameID` not found.
  - *cURL*: `curl https://calm-ravine-1782.herokuapp.com/games/1434876834694/`
