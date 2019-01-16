
const spicedPg = require('spiced-pg');
const {dbUser, dbPass} = require('./secrets');
const db = spicedPg(
    `postgres:${dbUser}:${dbPass}@localhost:5432/petition`
);

module.exports.addUser = function(first, last, sign, user_id) {
    return db.query(
        `INSERT INTO signatures (first, last, sign, user_id) VALUES ($1, $2, $3, $4) returning *`,
        [first, last, sign, user_id]
    );
};
module.exports.getSigners = function() {
    return db.query(`SELECT first, last, sign FROM signatures`);
};
module.exports.getSignature = function(user_id) {
    return db.query(`
        SELECT sign FROM signatures WHERE user_id = $1`,
    [user_id]
    );
};
module.exports.getRowCount = function() {
    return db.query(`
        SELECT COUNT (*) FROM signatures
    `);
};
module.exports.registerUser = function(first, last, email, password) {
    return db.query(`INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) returning id, first, last`,
        [first, last, email, password]
    );
};
module.exports.loginUser = function(email, password){
    return db.query(`INSERT INTO users (email, password) VALUES ($1, $2) returning *`,
        [email, password]
    );
};
