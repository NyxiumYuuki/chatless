const config = require('./config');
const mongoDB = require ('./mongodbConnect').getDB();

function checkLoginQuery(login, password){
    // SELECT idUtilisateurs
    // FROM utilisateurs
    // WHERE login = ? AND password = ?;
    return new Promise((resolve, reject) => {
        resolve(mongoDB.collection(config.mongodbUtilisateurs).find(
            {login: login, password: password},
            {projection: {_id: 1}}).count());
    });
}
module.exports.checkLoginQuery = checkLoginQuery;

function register(login, password){
    // INSERT INTO users(login, password)
    return new Promise((resolve, reject) => {
        mongoDB.collection(config.mongodbUtilisateurs).insertOne(
            {
                login: login,
                password: password
            },{},function(err,res){
                console.log(res);
                if(res !== undefined){
                    resolve(res.insertedCount === 1);
                }
            });
    });
}
module.exports.register = register;

