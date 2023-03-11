
-- CREATE DATABASE IF NOT EXISTS logistic;

CREATE TABLE IF NOT EXISTS status ( id int NOT NULL AUTO_INCREMENT, status_name varchar(255) NOT NULL, PRIMARY KEY (id) );
INSERT IGNORE INTO `status` (`id`, `status_name`) VALUES
('1', 'Đã nhập kho Trung Quốc'),
('2', 'Đang về kho Việt Nam'),
('3', 'Đã nhập kho Việt nam'),
('4', 'Đã trả khách');

CREATE TABLE IF NOT EXISTS orders (
    id int NOT NULL AUTO_INCREMENT,
    order_code varchar(30) NOT NULL UNIQUE,
    order_name varchar(30),
    status int NOT NULL,
    created_date DATETIME,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (status) REFERENCES status(id)

);




CREATE TABLE IF NOT EXISTS role (
id int NOT NULL AUTO_INCREMENT,
name varchar(20) NOT NULL,
PRIMARY KEY(id)    
);

INSERT INTO `role` (`name`) VALUES ('ADMIN'),('USER');

CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    created_date DATETIME,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    verify_code VARCHAR(60),
    role INT NOT NULL,
    gender boolean ,
    birthday date,
    phone varchar(10),
    avatar varchar(255),
    PRIMARY KEY(id),
    FOREIGN KEY (role) REFERENCES role(id)
);




CREATE TABLE IF NOT EXISTS menu (
id int NOT NULL auto_increment,
name VARCHAR(255) not null,
link VARCHAR(255) not null,
description text,
parent_id int, 
primary key(id)
);

INSERT IGNORE INTO menu(id, name, link, description) 
VALUES
(1,'MORE_INFORMATION', '/','{"email":"le-phuong@gmail.com","phone":"0339551901","timework":"08:20-17:20","link_logo":"https://lau-xanh.us/wp-content/uploads/2022/08/anh-sex-0522-22031039-001.jpg"}' ),
(2,'Trang chủ','/',null ),
(3,'Giới thiệu','/about',null );


CREATE TABLE IF NOT EXISTS articles (
id int NOT NULL auto_increment,
title VARCHAR(255) not null,
link VARCHAR(255) not null,
menu_id int,
content text,
description text,
isEnabled boolean not null,
image_url varchar(255),
tag VARCHAR(255),
create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
primary key(id),
FOREIGN KEY (menu_id) REFERENCES menu(id)
);