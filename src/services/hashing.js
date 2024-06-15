const bcrypt = require('bcrypt');   // bcrypt fo hashing


/////////////////////////
//   hashing methods   //
/////////////////////////

// get hash
const getHashed = (plainText) => bcrypt.hashSync(plainText, 10);

// check is hash matching
const isHashMatching = (plainText, hash) => bcrypt.compareSync(plainText, hash);



module.exports = { getHashed, isHashMatching }