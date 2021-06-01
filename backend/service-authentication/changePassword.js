const {sendError, sendMessage} = require ("./message");
const queries = require('./mongodbQueries');

async function changePassword (req,res) {
    if (typeof req.body.username === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ username');

    if (typeof req.body.password === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ password');

    if (typeof req.body.newpassword === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ newpassword');

    const change = await queries.changePasswordQuery(req.body.username, req.body.password, req.body.newpassword);
    if (change){
        return sendMessage(res, 'Le mot de passe a été changé.');
    }
    else{
        return sendError(res, 'Mot de passe actuel incorrect ou erreur interne');
    }
}
module.exports = changePassword;
