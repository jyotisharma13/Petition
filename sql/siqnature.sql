drop table if exists signatures;

create table signatures (
    id serial primary key,
    sign text NOT NULL CHECK (sign <> ''),
     user_id integer UNIQUE NOT NULL references users(id),
    created_at timestamp default current_timestamp
);
-- first varchar(200)not null check (first <> ''),
-- last varchar(200)not null (last <> ''),
