drop table if exists signatures;

create table signatures (
    id serial primary key,
    first varchar(200)not null check (first <> ''),
    last varchar(200)not null (last <> ''),
    sign text not null,
     user_id integer references users(id) not null,
    created_at timestamp default current_timestamp
);
