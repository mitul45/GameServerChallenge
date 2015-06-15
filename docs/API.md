##API Specification

1. `POST /games/create`
  - *Description* : Create a new game on server.
  - *Parameters* : `playerID`
  - *Returns* : `gameID`

2. `POST /games/{gameID}/start`
  - *Description*: Start a game already created
  - *Parameters* : `playerID` - only admin can start the game
  - *Returns* : 
	- `200`: OK `game` object returned
	- `404`: `gameID` not found.

3. `POST /games/{gameID}/players/{playerID}/join`
  - *Description*: Join a game created by some other user.
  - *Path Parameters* : `playerID`, `gameID`
  - *Returns* : 
	- `200`: `game` object on success.
	- `404`: `gameID` not found.

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
	- `200`: Success message.
	- `404`: `gameID` not found.

5. `POST /games/{gameID}/players/{playerID}/pass`
  - *Description*: Pass user's turn
  - *Path Parameters* : `playerID`, `gameID`
  - *Returns* : 
	- `200`: OK.
	- `404`: `gameID` not found.

6. `GET /games/{gameID}`
  - *Description*: GET games' current state.
  - *Path Parameters* : `gameID`
  - *Returns* : 
	- `200`: `game` object.
	- `404`: `gameID` not found.
