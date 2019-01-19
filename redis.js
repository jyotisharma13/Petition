const redis = require('redis');
const client = redis.createClient({
    host:'localhost',
    port:6379
});
const {promisify}=require('util');
client.on('error', function(err){
    console.log(err);
});
module.exports.setex= promisify;
module.exports.setex= promisify;
module.exports.setex= promisify;



// if you but object in string the you get error so for that you use the json stringify an dthen pass the parse
