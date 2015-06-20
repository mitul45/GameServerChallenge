var fs = require('fs');
var dictionary = require('./dictionary');

var generateGrid = function(words, size, number_of_words) {
    var grid = createGrid(size);
    var words_added = 0;
    var words_used = [];
    var word;
    for(var i = 0; i < words.length; i++) {
        word = words[i];
        if(addWord(word, grid, size)) {
            words_added++;
            words_used.push(word);
            if(words_added === number_of_words)
                break;
        }
    }
    return {grid: fillRemainingPlaces(grid), words: words_used};
}

var addWord = function(word, grid, size) {
    // chose vertically or horizontally.
    var direction = randomInt(0, 2);
    if(addWordWD(direction, word, grid, size))
        return true;
    // if word can not be added horizontally, try vertically.
    else if(addWordWD(1 - direction, word, grid, size))
        return true;
    return false;
}

var addWordWD = function(direction, word, grid, size) {
    var locationArray = new Array(size);
    var success = false;

    // chose a random row or column.
    var location = randomInt(0, size);
    locationArray[location] = 1;
    while(true) {

        if(addWordWDL(location, direction, word, grid, size)) {
            success = true;
            break;
        }

        // if last addition was not successful, try another row/column.
        var remainingLocation = [];
        for(var i = 0; i < locationArray.length; i++) {
            if(locationArray[i] != 1)
                remainingLocation.push(i);
        }

        if(remainingLocation.length === 0) {
            success = false;
            break;
        }

        // new random location which has not been tried.
        location = remainingLocation[randomInt(0, remainingLocation.length)];
        // mark it as tried.
        locationArray[location] = 1;
    }
    return success;
}

var addWordWDL = function(location, direction, word, grid, size) {
    var continuous = findCountinuousEmptySpace(location, direction, grid, size);
    if(word.length <= continuous['length']) {
        // right to left or left to right, top to bottom or bottom to top.
        if(randomInt(0, 2) === 0) {
            var start = continuous['start'];
            for (var i = 0; i < word.length; i++) {
                if(direction === 0) 
                    grid[location][start + i] = word[i];
                else if(direction === 1)
                    grid[i + start][location] = word[i];
            }
        } else {
            var end = continuous['end'];
            for (var i = 0; i <word.length; i++) {
                if(direction === 0) 
                    grid[location][end - i] = word[i];
                else if(direction === 1)
                    grid[end - i][location] = word[i];
            }
        }
        return true;
    }
}

var findCountinuousEmptySpace = function(location, direction, grid, size) {
    var min_start = 0, max_end = size, max_count = 0;
    var count = 0, start = 0;
    for(var i = 0; i < size; i++) {
        if((direction === 0 && grid[location][i] === 0) 
            || (direction === 1 && grid[i][location] === 0)) {
                count++;
            } else {
                if(count > max_count) {
                    max_count = count;
                    max_end = i - 1;
                    min_start = start;
                }
                count = 0;
                start = i + 1;
            }
    }
    // if continuous series ends in last element.
    if(count > max_count) {
        max_count = count;
        max_end = i - 1;
        min_start = start;
    }
    return {'length': max_count, 'start': min_start, 'end': max_end};
}

// create size x size grid and initalize it with 0's.
var createGrid = function(size) {
    var grid = new Array(size);
    for (var i = 0; i < size; i++) {
        grid[i] = new Array(size);
        for (var j = 0; j < size; j++)
            grid[i][j] = 0;
    }
    return grid;
}

var fillRemainingPlaces = function(grid) {
    var size = grid.length;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if(grid[i][j] === 0)
                // fill remaining place with random lower case characters.
                grid[i][j] = String.fromCharCode(97 + randomInt(0, 26));
        }
    }
    return grid;
}

var sortWords = function(words) {
    var wordsObj = {};
    var wordsLen = [];
    for (var i = 0; i <  words.length; i++) {
        if(wordsObj[words[i].length])
            wordsObj[words[i].length].push(words[i]);
        else
            wordsObj[words[i].length] = [words[i]];
        wordsLen.push(words[i].length);
    }
    wordsLen = wordsLen.sort(function(a, b) {return b-a;});
    for (var i = 0; i <  words.length; i++) {
        words[i] = wordsObj[wordsLen[i]].pop();
    }
    return words;
}

var toString = function(grid) {
    var size = grid.length;
    var str = "";
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            str += " " + grid[i][j] + " ";
        }
        str += "\n";
    }
    return str;
}

var getDictionaryWords = function(n, canAcceptWord, callback) {
    var words = [], word;
    while(words.length < n) {
        word = dictionary.getARandomWord();
        if(canAcceptWord(word) && words.indexOf(word) === -1)
            words.push(word);
    }
    callback(words);
}

// gives a random floating point number between low and high.
var random = function(low, high) {
    return Math.random() * (high - low) + low;
}

// returns a random integer between low and high.
var randomInt = function(low, high) {
    return Math.floor(random(low, high));
}

module.exports = {
    generateGrid: generateGrid,
    toString: toString,
    sortWords: sortWords,
    getDictionaryWords: getDictionaryWords
}
