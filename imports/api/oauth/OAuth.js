import { Meteor } from 'meteor/meteor'

const settings = Meteor.settings.oauth.clients
const clients = new Map()

settings.forEach(entry => {
  clients.set(entry.clientId, entry.key)
})

export const OAuth = {}

OAuth.getClientKey = clientId => clients.get(clientId)


async function cb_request( method, path, headers = {}, body = ''){

  var apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
    apiSecret = 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
    apiPass = 'xxxxxxxxxxxxxxxxxxxxxxxxxxx';

  //get unix time in seconds
  var timestamp = Math.floor(Date.now() / 1000);

  // set the request message
  var message = timestamp + method + path + body;

  //create a hexedecimal encoded SHA256 signature of the message
  var key = Buffer.from(apiSecret, 'base64');
  var signature = crypto.createHmac('sha256', key).update(message).digest('base64');

  //create the request options object
  var baseUrl = 'https://api-public.sandbox.pro.coinbase.com';

  headers = Object.assign({},headers,{
    'CB-ACCESS-SIGN': signature,
    'CB-ACCESS-TIMESTAMP': timestamp,
    'CB-ACCESS-KEY': apiKey,
    'CB-ACCESS-PASSPHRASE': apiPass,
    'USER-AGENT': 'request'
  });

  // Logging the headers here to ensure they're sent properly
  console.log(headers);

  var options = {
    baseUrl: baseUrl,
    url: path,
    method: method,
    headers: headers
  };

  return new Promise((resolve,reject)=>{
    request( options, function(err, response, body){
      if (err) reject(err);
      resolve(JSON.parse(response.body));
    });
  });

}

async function main() {

  // This queries a product by id (successfully)
  try {
    console.log( await cb_request('GET','/products/BTC-USD') );
  }
  catch(e) {
    console.log(e);
  }

  // Trying to place a buy order here (using the same id as above) returns { message: 'Product not found' }
  var buyParams = {
    'type': 'market',
    'side': 'buy',
    'funds': '100',
    'product_id': 'BTC-USD'
  };

  try {
    var buy = await cb_request('POST','/orders',buyParams);
    console.log(buy);
  }
  catch(e) {
    console.log(e);
  }

}

main();