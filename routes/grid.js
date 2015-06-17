function generateGrid(arr, size) {
    var grid = createGrid(size);
    for(var i = 0; i < arr.length; i++) {
        var word = arr[i];
        addWord(word, grid, size);
    }
    print(grid, size);
}

function print(grid, size) {
    var str = "";
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            str += grid[i][j] + " ";
        }
        str += "\n"
    }
    console.log(str);
}

function addWord(word, grid, size) {
    // chose vertically or horizontally.
    var direction = randomInt(0, 2);
    if(addWordWD(direction, word, grid, size))
        return true;
    // if word can not be added horizontally try vertically, or vice versa.
    else if(addWordWD(1 - direction, word, grid, size))
        return true;
    return false;
}

function addWordWD(direction, word, grid, size) {
    var locationArray = new Array(size);
    var success = false;

    // chose a random line or column.
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

function addWordWDL(location, direction, word, grid, size) {
    var continuos = findCountinuosEmptySpace(location, direction, grid, size);
    if(word.length <= continuos['length']) {
        // right to left or left to right, top to bottom or bottom to top.
        if(randomInt(0,2) === 0) {
            var start = continuos['start'];
            for (var i = 0; i < word.length; i++) {
                if(direction === 0) 
                    grid[location][start + i] = word[i];
                else if(direction === 1)
                    grid[i + start][location] = word[i];
            }
        } else {
            var end = continuos['end'];
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

function findCountinuosEmptySpace(location, direction, grid, size) {
    // horizontal
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
    // if continuos series ends in last element.
    if(count > max_count) {
        max_count = count;
        max_end = i - 1;
        min_start = start;
    }
    return {'length': max_count, 'start': min_start, 'end': max_end};
}

// create size x size grid and initalize it with 0's.
function createGrid(size) {
    var grid = new Array(size);
    for (var i = 0; i < size; i++) {
        grid[i] = new Array(size);
        for (var j = 0; j < size; j++)
            grid[i][j] = 0;
    }
    return grid;
}

// gives a random floating point number between low and high.
function random(low, high) {
    return Math.random() * (high - low) + low;
}

// returns a random integer between low and high.
function randomInt(low, high) {
    return Math.floor(random(low, high));
}
