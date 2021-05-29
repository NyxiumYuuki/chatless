const sessionJwt = require ('./sessionJWT');
const queries = require('./mongodbQueries');

function getSession (sessionid,res) {
    return sessionJwt.decodeSessionCookie(sessionid,res);
}
module.exports.getSession = getSession;

function setSessionCookie (req, res, session) {
    sessionJwt.createSessionCookie(req, res, session);
}
module.exports.setSessionCookie = setSessionCookie;

function getUsername(session) {
    if (typeof session.username === 'undefined') return -1;
    return session.username;
}
module.exports.getUserId = getUsername;

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
