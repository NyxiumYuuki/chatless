const {sendError, sendMessage} = require ("./message");
const auth = require ('./auth');

async function checkLogin (req,res) {
    if (typeof req.body.login === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ login');
    if (typeof req.body.password === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ password');
    
    const result = await auth.authenticate(req, res);
    if (result === 1){
        return sendMessage(res, true);
    }
    else{
        return sendError(res, 'Invalid username or password');
    }
}
module.exports = checkLogin;
