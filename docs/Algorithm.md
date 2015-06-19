## Algorithm for each API call

### Create a new game
1. Generate 'gameID'
2. Get 10 words from dictionary and assign them to `words_used` array.
3. Arrange those 10 words to 15 x 15 grid horizontally or vertically.
4. Fill in remaining places with random characters.
5. Assign `playerID` as admin for this game.
6. Set game state as `CREATED`.

### Start a game
1. Check if `playerID` is admin or not.
2. Check number of users, it should be `>2 and <5`.
3. Randomize players' list for random game play order.
4. Initialize `words_left` array with initial 10 words, and `pass_count` to 0.
5. Change game state to `STARTED`.
6. Notify all players.

### Join a game
1. Check existing number of players for the game.
2. If it is < 5, add user to `players` array.
3. Notify other players.

### Play turn
1. Check if word is already identified.
2. If not, check the word against dictionary.
  - If word is valid, add that to `words_identified` array.
  - Remove the same word from 'words_left' array, if exists.
    - if `words_left` array is empty - i.e. all words have been identified, then game ends here. Set game state as `FINISHED`.
3. Return appropriate message to user.
4. Reset `pass_count` to 0.
5. Notify next user for his turn.

### Pass turn
1. Check if `pass_count == number of players`?
  - If yes, game ends here, set game state as `FINISHED`.
2. `pass_count++`
3. Notify next user for his turn.

###Create grid

##### Using Backtracking
- Select a word from the list.
  - Chose a random direction between `HORIZONTAL` and `VERTICAL`
    - Choose a random number for row/column which has not been tried.
      - Find number of countinuous empty spaces in chosen row/column.
        - If number of empty spaces > length of word
          - Chose direction i.e. L2R, or R2L.
            - Add word to grid, go to first step.
        - Else chose a new random row/column.
    - If all rows/columns are exhausted, chose remaining option between `HORIZONTAL` and `VERTICAL`.
- Stop once all words have been added to grid.

##### Using Random

1. Choose a word from 10 dictionary words.
2. Generate random `i` and `j` as start position.
3. Chose random direction.
4. Check if word can fit at chosen position in selected direction.
  - If successful, go to `step 1` and select new word.
  - If not, go to `step 2` and chose some other location.
