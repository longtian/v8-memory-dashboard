const crypto = require('crypto');

exports.salt = (string)=> {
  return crypto.createHash('md5').update(`${process.env.WILDDOG_SECRET}-${string}`).digest('hex');
}