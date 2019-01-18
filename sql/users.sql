drop table if exists users;

create table users (
    id serial primary key,
    first varchar(255) not null check (first_name <>''),
    last varchar(255) not null check (last_name <>''),
    email varchar(255) UNIQUE not null check (email <>''),
    password varchar(255) not null check (password <>'')
);

-- // find there row through email address select * from users where email = compare;
