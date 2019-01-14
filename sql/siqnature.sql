drop table if exists siqnatures;

create table signatures (
    id serial primary key,
    first varchar(200)not null check (first <> ''),
    last varchar(200)not null,
    sign text not null,
    created_at timestamp default current_timestamp
);
