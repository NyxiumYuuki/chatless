const {sendError, sendMessage} = require ("./message");
const queries = require('./mongodbQueries');

async function register(req,res) {
    if (typeof req.body.username === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ login');
    if (typeof req.body.password === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ password');


    const register = await queries.register(req.body.username, req.body.password);
    if (register){
        console.log('Register : '+req.body.username);
        return sendMessage(res, 'Succesful registration');
    }
    else{
        return sendError(res, 'Username already taken');
    }
}
module.exports = register;
