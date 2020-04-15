var requestClass = require('./module.js');
var request = requestClass({ // Instantiate!
  type: 'binary'
});
console.log(request.limit) // 200
console.log(request.makeGetRequest({
  url: 'http://webapplog.com'
}));