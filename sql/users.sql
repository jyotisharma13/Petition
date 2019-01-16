drop table if exists users;

create table users (
    id serial primary key,
    first varchar(255) not null check (first <>''),
    last varchar(255) not null check (last <>''),
    email varchar(255) unique not null check (email <>''),
    password varchar(255) not null check (password <>'')
);

-- // find there row through email address select * from users where email = compare;
