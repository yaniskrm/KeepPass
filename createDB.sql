-- script pour creer la base de données 
-- bash : source /chemin/vers/votre/script.sql;

-- Création de la base de données (optionnelle, selon votre environnement actuel)
CREATE DATABASE IF NOT EXISTS KeepPass;
USE KeepPass;

-- Création de la table UserKP
CREATE TABLE IF NOT EXISTS UserKP (
    idUserKP BIGINT(64) NOT NULL AUTO_INCREMENT,
    pseudoKP VARCHAR(64) NOT NULL,
    passwordKP VARCHAR(64) NOT NULL,
    PRIMARY KEY (idUserKP)
);

-- Création de la table UserStorage
CREATE TABLE IF NOT EXISTS UserStorage (
    idUsersKP BIGINT(64) NOT NULL,
    website VARCHAR(64) NOT NULL,
    pseudo VARCHAR(64) NOT NULL,
    password VARCHAR(64) NOT NULL,
    idAccount BIGINT(64) NOT NULL,
    PRIMARY KEY (idAccount),
    FOREIGN KEY (idUsersKP) REFERENCES UserKP(idUserKP)
);
