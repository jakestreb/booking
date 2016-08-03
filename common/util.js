// Returns an array of length maxLength starting at begin
exports.range = function(begin, maxLength) {
  var arr = [];
  var entry = begin;
  for (let i = 0; i < maxLength; i++) {
    arr[i] = entry++;
  }
  return arr;
};