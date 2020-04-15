// increment.js
var addValue = require('./math').addValue; // Expression to return sum all the arguments
exports.increment = function(value) {
    return addValue(value, 1); // Sum of value and 1
};
