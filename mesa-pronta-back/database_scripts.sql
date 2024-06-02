-- Cria o banco de dados
CREATE DATABASE estacio;

-- Seleciona o banco de dados para uso
USE estacio;

-- Cria a tabela 'mesas'
CREATE TABLE mesas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    coordenadas VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NULL,
    status VARCHAR(255) NOT NULL
);

-- Cria a tabela 'users'
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Insere usuários administradores
INSERT INTO users (username, password) VALUES ('user1', '123');
INSERT INTO users (username, password) VALUES ('user2', '123');
INSERT INTO users (username, password) VALUES ('user3', '123');