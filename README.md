4 pages : 
-Connexion/Inscription
	Page classique de connexion / inscription

-Generateur MDP
	definition des caractères présents dans le MDP à générer
	definition de la longueur du mdp
	majusscules et/ou minuscule

		-> boutons : 
			-regenérer
			-valider -> page d'enregistrement du mdp avec les champ : site, pseudo et mdp qui est prérempli
-> renvoie les 3 valeurs associé au compte en question (champ PID) dans la 

Admin et root bloqués pour les gestions administrateur


-Test MDP
	->tester un mdp externe (entrée textuelle pour tester le mdp choisit)
	->tester un mdp stocké en bdd pour l'utilisateur en question (choix du mdp dans un menu déroulant)

	Fonctions de test mdp (par defaut brutforce)

-Gestionnaire MDP
	- Afficher tous les mots de passe de l'utilisateur de notre site une fois qu'il a prouver son identité par ré-identification 
	- PROBLEME : comment manipuler les mdp de l'utilisateur de notre site en bdd sachant qu'il seront chiffrés ?


Création de BDD : 
	- 2 tables : 
	la première stocke le couple user/mdp du site
	la seconde stocke pour chaque utilisateur : l'id de l'utilisateur, site associé au mdp géré, le pseudo, le mdp en question 



	Script SQL BDD:

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
