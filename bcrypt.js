
// db.find user by name then compare;
let { genSalt, hash, compare} = require('bcryptjs');
const {promisify}= require('util');
genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);
module.exports.hash = password=>{
    return genSalt().then(salt=>{
        return hash(password, salt);
    });
};
module.exports.compare= compare;
// genSalt().then(salt =>{
//     console.log(salt);
//     return hash('foxdude99', salt);
// }).then(hash=>{
//     console.log(hash);
//     return compare('foxdude99', hash);
// }).then(bool=>{
//     console.log(bool);
// });
// var bcrypt = require('bcryptjs');

// function hashPassword(plainTextPassword) {
//     return new Promise(function(resolve, reject) {
//         bcrypt.genSalt(function(err, salt) {
//             if (err) {
//                 return reject(err);
//             }
//             bcrypt.hash(plainTextPassword, salt, function(err, hash) {
//                 if (err) {
//                     return reject(err);
//                 }
//                 resolve(hash);
//             });
//         });
//     });
// }
