-- CREATE DATABASE

create database markisak;
\l
\c markisak

-- CREATE TABLE

create table users(
    id varchar(36) not null primary key,
    name varchar(40) not null,
    email varchar(128) not null unique,
    phone_number varchar(16) not null,
    password varchar(128) not null,
    photo varchar default('photo.jpg')
);

create table recipes(
    id varchar(36) not null primary key,
    id_user varchar(36) references users on delete cascade,
    foreign key (id_user) references users(id),
    title varchar(64) not null,
    photo varchar not null,
    description text,
    ingredients text not null,
    created_at varchar not null,
    updated_at varchar not null
);

create table comments(
    id varchar(36) not null primary key,
    id_user varchar(36) references users on delete cascade,
    foreign key (id_user) references users(id),
    id_recipe varchar(36) references recipes on delete cascade,
    foreign key (id_recipe) references recipes(id),
    message text not null,
    created_at varchar not null,
    updated_at varchar not null
);

create table videos(
    id varchar(36) not null primary key,
    id_recipe varchar(36) references recipes on delete cascade,
    foreign key (id_recipe) references recipes(id),
    step int not null,
    url_video varchar not null
);

create table liked_recipes(
    id varchar(36) not null primary key,
    id_user varchar(36) references users on delete cascade,
    foreign key (id_user) references users(id),
    id_recipe varchar(36) references recipes on delete cascade,
    foreign key (id_recipe) references recipes(id),
    created_at varchar not null
);

create table saved_recipes(
    id varchar(36) not null primary key,
    id_user varchar(36) references users on delete cascade,
    foreign key (id_user) references users(id),
    id_recipe varchar(36) references recipes on delete cascade,
    foreign key (id_recipe) references recipes(id),
    created_at varchar not null
);

create table admin(
    id varchar(36) not null primary key,
    email varchar(128) not null unique,
    password varchar(128) not null
);

create table chats(
    id varchar(36) not null primary key,
    id_user varchar(36) references users on delete cascade,
    foreign key (id_user) references users(id),
    id_admin varchar(36) references admin on delete cascade,
    foreign key (id_admin) references admin(id),
    message_admin text,
    message_user text,
    created_at varchar not null
);