drop table if exists user_profiles;

CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR(200),
    url VARCHAR(600),
    user_id INTEGER REFERENCES users(id) UNIQUE NOT NULL

);
