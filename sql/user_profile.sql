drop table if exists user_profile;

create table user_profile(
    id serial primary key,
    age int,
    city varchar(100),
    url varchar(400),
    user_id int perferences users(id) not null
);
