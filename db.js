
const spicedPg = require('spiced-pg');
// const {dbUser, dbPass} = require('./secrets');
// const db = spicedPg(
// `postgres:${dbUser}:${dbPass}@localhost:5432/petition`
// );
// add user signature and user_id
let db;
// if "if"block runs, that means our website should talk to heroku's postgres database.
if(process.env.DATABASE_URL){
    db =spicedPg(process.env.DATABASE_URL);
}else {
    // only do this if you have a secrets.json file
    var secrets = require('./secrets.json');
    const {dbUser, dbPass} = require('./secrets');
    db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/petition`);
}
module.exports.addUser = function(sign, user_id) {
    return db.query(
        `INSERT INTO signatures (sign, user_id) VALUES ($1, $2) returning *`,
        [sign, user_id]
    );
};
//Get Signers
module.exports.getSigners = () => {
    return db.query(
        `SELECT
        users.first AS first, users.last AS last, user_profiles.age AS age, user_profiles.city as city, user_profiles.url AS url FROM signatures
        LEFT JOIN users
        ON signatures.user_id = users.id
        LEFT JOIN user_profiles
        ON signatures.user_id = user_profiles.user_id`
    );
};
//get user signature(get signer)
module.exports.getSignature = function(user_id) {
    return db.query(`
        SELECT sign FROM signatures WHERE user_id = $1`,
    [user_id]
    );
};
// GET USER
module.exports.getUserByEmail = email => {
    return db.query(` SELECT * FROM users WHERE email = $1`, [email]);
};
// USER ALREADY SIGNED
module.exports.alreadySigned = (id) => {
    return db.query(`
        SELECT id FROM signatures WHERE user_id = $1
    `,[id]);
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

// ADD USER PROFILE
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
        SELECT first, last, age, url
        FROM users
        LEFT JOIN user_profiles
        ON users.id=user_profiles.user_id
        JOIN signatures
        ON users.id = signatures.user_id
        WHERE user_profiles.city = $1;`,
    [city]
    );
};
// for deleting signature
module.exports.deleteSigner = (user_id) => {
    return db.query(`
        DELETE FROM signatures
        WHERE user_id = $1`,
    [user_id]
    );
};

// GET ALL SIGNERS
module.exports.getUserAndCheckSigner = (email) => {
    return db.query(`
        SELECT users.first, users.last, users.id, users.password, signatures.id AS sign_id
        FROM users
        LEFT JOIN signatures
        ON users.id = signatures.user_id
        WHERE email= $1`,
    [email]
    );
};
// GET USER TO EDIT PROFILE
module.exports.getSignersProfilesToEdit = (id) => {
    return db.query(`
        SELECT first, email, last, age, city, url
        FROM users
        LEFT JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE users.id = $1`, [id]
    );
};
// UPDATE USER
module.exports.updateUser = (id, firstName, lastName, email) => {
    return db.query(`
        UPDATE users
        SET first = $2,
            last = $3,
            email = $4
        WHERE id = $1`,
    [id, firstName, lastName, email]
    );
};
// UPDATE USER AND PASSWORD
module.exports.updateUserAndPassword = (id, firstName, lastName, email, password) => {
    return db.query(`
        UPDATE users
        SET first = $2,
            last = $3,
            email = $4,
            password = $5
        WHERE id = $1`,
    [id, firstName, lastName, email, password]
    );
};
// UPSERT USER PROFILE
module.exports.upsertUserProfile = (age, city, url, userID) => {
    return db.query(`
        INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE
        SET age = $1,
            city = $2,
            url = $3`,
    [age, city, url, userID]
    );
};
