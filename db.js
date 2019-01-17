
const spicedPg = require('spiced-pg');
const {dbUser, dbPass} = require('./secrets');
const db = spicedPg(
    `postgres:${dbUser}:${dbPass}@localhost:5432/petition`
);
// add user signature and user_id
module.exports.addUser = function(sign, user_id) {
    return db.query(
        `INSERT INTO signatures (sign, user_id) VALUES ($1, $2) returning *`,
        [sign, user_id]
    );
};

module.exports.getSigners = function() {
    return db.query(`SELECT first, last, sign FROM signatures`);
};
//get user signature(get signer)
module.exports.getSignature = function(user_id) {
    return db.query(`
        SELECT sign FROM signatures WHERE user_id = $1`,
    [user_id]
    );
};
// USER ALREADY SIGNED
module.exports.alreadySigned = (id) => {
    return db.query(`
        SELECT id FROM signatures WHERE user_id = ${id}
    `);
};
// // GET ALL SIGNERS
// module.exports.getAllSigners = () => {
//     return db.query(`
//         SELECT first_name, last_name FROM users
//         INNER JOIN signatures
//         ON users.id = signatures.user_id
//     `);
// };
///get all signers using get user and check signer
module.exports.getUserAndCheckSigner = (email) => {
    return db.query(`
        SELECT users.first_name, users.last_name, users.id, users.password, signatures.id AS sign_id
        FROM users
        LEFT JOIN signatures
        ON users.id = signatures.user_id
        WHERE email= $1`,
    [email]
    );
};

// get signature count
module.exports.getRowCount = function() {
    return db.query(`
        SELECT COUNT (*) FROM signatures
    `);
};
//adduser=register user
module.exports.registerUser = function(first, last, email, password) {
    return db.query(`INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) returning id, first, last`,
        [first, last, email, password]
    );
};
//get login user
module.exports.getLoginUser = function(email, password){
    return db.query(`INSERT INTO users (email, password) VALUES ($1, $2) returning *`,
        [email, password]
    );
};
// ADD USER PROFIL

module.exports.addProfile = (age, city, url, userID) => {
    return db.query(`
        INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4) RETURNING *`,
    [age, city, url, userID]
    );
};
// GET ALL SIGNERS AND PROFILES
module.exports.getSignersProfiles = () => {
    return db.query(`
        SELECT first_name, last_name, age, city, url
        FROM users
        LEFT JOIN user_profiles
        ON users.id = user_profiles.user_id
        JOIN signatures
        ON users.id = signatures.user_id
    `);
};


// GET ALL SIGNERS FROM CITY
module.exports.getSignersFromCity = (city) => {
    return db.query(`
        SELECT first_name, last_name, age, url
        FROM users
        LEFT JOIN user_profiles
        ON users.id=user_profiles.user_id
        JOIN signatures
        ON users.id = signatures.user_id
        WHERE user_profiles.city = $1;`,
    [city]
    );
};
