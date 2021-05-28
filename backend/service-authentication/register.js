const {sendError, sendMessage} = require ("./message");
const queries = require('./mongodbQueries');

async function register(req,res) {
    if (typeof req.body.login === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ login');
    if (typeof req.body.password === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ password');


    const register = await queries.register(req.body.login, req.body.password);
    if (register){
        console.log('Register : '+req.body.login);
        return sendMessage(res, null);
    }
    else{
        return sendError(res, 'Error registering');
    }
}
module.exports = register;
