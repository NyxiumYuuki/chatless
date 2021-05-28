const config = require('./config');
const mongoDB = require ('./mongodbConnect').getDB();

function checkLoginQuery(login, password){
    // SELECT idUtilisateurs
    // FROM utilisateurs
    // WHERE login = ? AND password = ?;
    return new Promise((resolve, reject) => {
        resolve(mongoDB.collection(config.mongodbUtilisateurs).find(
            {login: login, password: password},
            {projection: {idUtilisateur: 1, _id: 0}}).toArray());
    });
}
module.exports.checkLoginQuery = checkLoginQuery;


