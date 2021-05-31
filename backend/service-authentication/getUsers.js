const {sendError, sendMessage} = require ("./message");
const queries = require('./mongodbQueries');

async function getUsers (req,res) {
    if (typeof req.body.username === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ username');

    const users = await queries.getUsersQuery(req.body.username);
    if (users){
        return sendMessage(res, users);
    }
    else{
        return sendError(res, 'no users');
    }
}
module.exports = getUsers;
