**Projet Chat**

**Instruction de lancement du Chat**
- `docker compose up`
- Puis se connecter en local sur `http://localhost:4200`
- Le client ne se connecte pas pour l'instant. Mais le serveur démarre enfin, problème entre toutes les images docker, 
  seul l'image des bases de données MongoDB et l'image du service-authentication marche. Les deux autres services 
  ne marchent pas en image docker à cause du socket pour je ne sais quelle raison.

Pour lancer le projet sans image docker, il est obligatoire de lancer plusieurs terminals pour le frontend et pour chaque 
serveurs et avoir des images dockers mongodb.
A savoir:
- Terminal Frontend dans le dossier frontend : `ng serve`
- Terminal service-authentication dans le dossier service-authentication : `node server.js`
- Terminal service-message dans le dossier service-message : `node server.js`
- Terminal service-privateroom dans le dossier service-privateroom : `node server.js`
- Puis se connecter en local sur `http://localhost:4200`





**Instruction du professeur**
Le but du projet est de fournir un service de chat rudimentaire :
-  Une interface utilisateur en web
- Les utilisateurs peuvent s'enregistrer/se connecter/se déconnecter/changer leur mot de passe
- On proposera un chat général et des room privées
- Tout le monde peut créer un room, et seul le propriétaire peut inviter des gens dedans



__Premier palier :__
- Le chat est lu de manière passive (polling/attente active)

__Second palier :__
- Le chat fonctionne de manière active. Les utilisateurs sont connectés et reçoivent le message directement dès qu’il est posté.


**Rappel :**

Le but du projet est de fournir un service de forum rudimentaire :

- Une interface utilisateur en web
- Les utilisateurs peuvent s'enregistrer/se connecter/se déconnecter/changer leur mot de passe
- Les utilisateurs peuvent créer un sujet
- On pourra poster et répondre à un message sur n’importe lequel des sujets du forum.
- Donner les liste des utilisateurs inscrits/connectés
- Il n’est pas requis de gestion des droits utilisateur, cependant un utilisateur ne peut pas changer les réglages d’un autres


**Rendus et critères d'évaluations :**

En conséquence, vous pourrez me rendre un docker-compose avec tous vos microservices et le UI. Je dois être capable de build toutes vos dockers et de les lancer sur ma machine en faisant "docker-compose up". En revanche, les déploiements AWS vous donneront un bonus pour ne pas pénaliser ceux qui ont déjà passé du temps dessus.

Travail à rendre pour le **04 juin 2021**:
- Le code source de votre projet sur le gitlab de l'établissement (me fournir le lien)
- Un bref rapport (max 10 pages) décrivant vos choix techniques et le déroulement du projet (par email)
- Un README et des fixtures (données à ajouter en base) pour que je puisse faire fonctionner le projet
- Des Dockerfile et un docker-compose pour faire fonctionner le tout
- Optionnel (Bonus): Déployer le projet sur AWS