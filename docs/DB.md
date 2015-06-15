## MongoDB schema for Game Server Challenge.

### game object
```json
{
  "gameID": "game53",
  "admin": "player1",
  "state": " CREATED | STARTED | FINISHED ",
  "pass-count": 1,
  "players": ["player1", "player2", "player3"],
  "grid": [["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
           ["p", "q", "r", "..."],
           "...13 more rows..."],
  "words-left": ["initial", "ten", "words"],
  "words-identified": [
    {
      "word": "initial",
      "starting-pos": ["i", "j"],
      "direction": ["UP | DOWN | LEFT | RIGHT"],
      "identified-by": "playerID"
    }
  ],
}
```
