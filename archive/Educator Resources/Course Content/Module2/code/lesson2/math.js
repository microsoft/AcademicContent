exports.addValue = function() {
  var sum = 0,
    i = 0,
    args = arguments,
    l = args.length;
  while (i < l) { // Iterate over all arguments
    sum += args[i++];
  }
  return sum; // Return sum of all arguments
};
