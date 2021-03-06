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
        mongoDB.collection(config.mongodbUtilisateurs).updateOne(
            {'login': login},
            {$setOnInsert: { 'login': login, 'password': password}},
            {upsert:true},function(err,res){
                //console.log(res);
                if(res !== undefined){
                    if(typeof res.upsertedId !== 'undefined'){
                        resolve(res.upsertedId);
                    }else{
                        resolve(false);
                    }
                }
            });
    });
}
module.exports.register = register;

function getUsersQuery(username){
    return new Promise((resolve, reject) => {
        mongoDB.collection(config.mongodbUtilisateurs).find(
            { $and: [{'login': {$ne: 'Server'}}, {'login': {$ne: username}}]},
            {projection: {_id: 0, password: 0}}
        ).toArray(function (err, result){
            if(err) throw err;
            resolve(result);
        });
    });
}
module.exports.getUsersQuery = getUsersQuery

function changePasswordQuery(login, password, newPassword){
    return new Promise((resolve, reject) => {
        mongoDB.collection(config.mongodbUtilisateurs).findOneAndUpdate(
            {'login': login, 'password': password},
            {$set: { 'login': login, 'password': newPassword}}
            ,function(err,res){
                if(res !== undefined){
                    console.log(res);
                    resolve(res.lastErrorObject.n === 1);
                }
            });
    });
}
module.exports.changePasswordQuery = changePasswordQuery;
