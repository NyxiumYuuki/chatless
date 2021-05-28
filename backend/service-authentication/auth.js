const sessionJwt = require ('./sessionJWT');
const queries = require('./mongodbQueries');

// ici, on récupère le contenu du cookie de session JWT.
// celui-ci contient le userId mais également des informations
// concernant sa date d'expiration.
function getSession (req) {
    return sessionJwt.decodeSessionCookie(req);
}
module.exports.getSession = getSession;

// cette fonction ajoute le cookie de session au headers du
// message qui sera renvoyé à Angular. Si le cookie actuel
// est "vieux", on en recrée ici un nouveau.
function setSessionCookie (req, res, session) {
    sessionJwt.createSessionCookie(req, res, session);
}
module.exports.setSessionCookie = setSessionCookie;

// fonction pour récupérer le userId provenant du cookie
// de session. Si ce dernier n'existe pas, on renvoie
// l'ID -1.
function getUserId(session) {
    if (typeof session.username === 'undefined') return -1;
    return session.username;
}
module.exports.getUserId = getUserId;

async function authenticate(req, res) {
    const login = req.body.login;
    const password = req.body.password;

    const user = await queries.checkLoginQuery(login, password);
    if (user === 1){
        setSessionCookie (req, res, { username: login});
        return user;
    } else {
        setSessionCookie (req, res, {username: -1});
        return -1;
    }

}
module.exports.authenticate = authenticate;
