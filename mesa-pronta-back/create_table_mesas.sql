CREATE TABLE mesas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    coordenadas VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NULL,
    status VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (username, password) VALUES ('user1', '123.');
INSERT INTO users (username, password) VALUES ('user2', '123');
INSERT INTO users (username, password) VALUES ('user3', '123');