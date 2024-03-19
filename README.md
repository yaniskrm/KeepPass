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



-Rapport Filtre de Bloom et Robustesse d'un mot de passe

Le filtre de Bloom est une structure de données probabiliste qui permet de tester l'appartenance d'un élément à un ensemble. Sa particularité réside dans le fait qu'il peut donner des faux positifs (indiquer qu'un élément fait partie de l'ensemble alors que ce n'est pas le cas) mais jamais de faux négatifs (dire qu'un élément n'appartient pas à l'ensemble alors qu'il en fait partie). Bien que le filtre de Bloom soit utilisé dans de nombreux domaines pour sa rapidité et son efficacité en termes d'espace mémoire, son rapport avec la robustesse d'un mot de passe n'est pas direct. Cependant, il peut être utilisé dans le contexte de la sécurité des mots de passe de manière indirecte, notamment dans deux cas principaux :

1. **Vérification contre des listes de mots de passe communs ou compromis** : Un filtre de Bloom peut stocker une vaste liste de mots de passe connus pour être faibles, couramment utilisés, ou précédemment exposés dans des violations de données. Lors de la création d'un nouveau mot de passe, le système peut vérifier rapidement et efficacement si le mot de passe proposé figure dans cette liste, sans avoir besoin de stocker la liste entière dans la mémoire ou de faire une recherche lente à travers elle. Si le filtre indique que le mot de passe pourrait être dans la liste (même avec le risque de faux positifs), l'utilisateur peut être invité à choisir un mot de passe différent. Cela aide à éviter l'utilisation de mots de passe faibles ou compromis.

2. **Optimisation des performances dans les systèmes de gestion de mots de passe** : Les filtres de Bloom peuvent être utilisés pour optimiser les vérifications et les recherches dans les grands ensembles de données, comme une base de données de mots de passe hachés, en réduisant le nombre de requêtes nécessaires. Cela peut accélérer les processus de vérification sans compromettre significativement la sécurité. Par exemple, avant de faire une recherche coûteuse dans une base de données pour vérifier si un mot de passe haché est unique, un filtre de Bloom peut être utilisé pour vérifier s'il est probablement nouveau.

Il est important de noter que l'utilisation de filtres de Bloom doit être soigneusement considérée dans le contexte de la sécurité des mots de passe, en tenant compte de leurs propriétés probabilistes et du risque de faux positifs. Leur utilisation principale en rapport avec les mots de passe est d'améliorer les performances et de réduire la charge sur les systèmes de stockage, tout en aidant indirectement à renforcer la robustesse des mots de passe en décourageant l'utilisation de mots de passe faibles ou déjà compromis.