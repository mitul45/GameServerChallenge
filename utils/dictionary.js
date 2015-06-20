var fs = require('fs');
// var dictionary_path = '/usr/share/dict/words';
var dictionary_path = 'dict-words';
var words, size;

var stream = fs.createReadStream(dictionary_path, {
    flags: 'r',
    encoding: 'utf-8',
    fd: null,
    mode: 0666
});
var fileData = '';
stream.on('data', function(data){
    fileData += data;
});

stream.on('error', function(){
    console.log("Error while opening dictionary.");
});

stream.on('end', function(){
    words = fileData.split('\n');
    size = words.length;
});

var getARandomWord = function() {
    return words[randomInt(0, size)];
}

var isDictionaryWord = function(word) {
    return words.indexOf(word) > -1;
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
    isDictionaryWord: isDictionaryWord,
    getARandomWord: getARandomWord
}