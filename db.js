
const spicedPg = require('spiced-pg');
const {dbUser, dbPass} = require('./secrets');
const db = spicedPg(
    `postgres:${dbUser}:${dbPass}@localhost:5432/petition`
);

module.exports.addUser = function(first, last, sign) {
    return db.query(
        `INSERT INTO signatures (first, last, sign) VALUES ($1, $2, $3) returning *`,
        [first, last, sign]
    );
};
module.exports.getSigners = function() {
    return db.query(`SELECT first, last, sign FROM signatures`);
};
module.exports.getsignature = function(id) {
    return db.query(`
        SELECT * FROM signatures WHERE id = ${id};
        `);

};
module.exports.getRowCount = () => {
    return db.query(`
        SELECT COUNT (*) FROM signatures
    `);
};
