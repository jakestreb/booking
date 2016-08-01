
var request = require('request');
var crypto = require('crypto');

function Visa() {

}

Visa.prototype.authorize = function() {
  var apiKey = 'TYHYMBA3KSYTAR4BKSRZ21IztKmS2s-d_cakEYEy_bBXK8gaI';
  var sharedSecret = '#p-Ccvz7MHJVE8cd9-Vd/P+mGhIbf{h3m$-K@3Ie';
  var baseUri = 'cybersource/';
  var resourcePath = 'payments/v1/authorizations';
  var queryParams = 'apikey=' + apiKey;

  var postBody = JSON.stringify({
      "amount": "0",
      "currency": "USD",
      "payment": {
        "cardNumber": "4111111111111111",
        "cardExpirationMonth": "10",
        "cardExpirationYear": "2016"
      }
  });

  var timestamp = Math.floor(Date.now() / 1000);
  var preHashString = timestamp + resourcePath + queryParams + postBody;
  var hashString = crypto.createHmac('SHA256', sharedSecret).update(preHashString).digest('hex');
  var xPayToken = 'xv2:' + timestamp + ':' + hashString;

  var req = request.defaults();
  req.post({
      uri : 'https://sandbox.api.visa.com/' + baseUri + resourcePath + '?' + queryParams,
      headers: {
        'content-type' : 'application/json',
        'x-pay-token' : xPayToken
      },
      body: postBody
    }, function(error, response, body) {
      if (!error) {
        console.log("Response Code: " + response.statusCode);
        console.log("Headers:");
        for(var item in response.headers) {
          console.log(item + ": " + response.headers[item]);
        }
        console.log("Body: "+ body);
      } else {
        console.log("Got error: " + error.message);
      }
    }
  );
};

module.exports = Visa;
