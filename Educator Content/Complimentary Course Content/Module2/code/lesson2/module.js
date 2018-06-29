module.exports = function requestClass (options) {
  var limit = 100;
  if (options.type === 'binary') {
    limit = 200;
  }
  return {
    name: 'request',
    limit: limit,
    type: options.type,
    makeGetRequest: function(data) { return data; }
  };
};