const sessionJWT = require ('jsonwebtoken');
const fs = require ('fs');
const {sendError, sendMessage} = require ("./message");

function createSessionJWT (username) {
    const RSA_PRIVATE_KEY = fs.readFileSync('./keys/jwtRS256.key');
    return sessionJWT.sign(
        {
            username: username,
            midExp: Math.floor(Date.now() / 1000) + 1800
        },
        RSA_PRIVATE_KEY,
        {
            algorithm: 'RS256',
            expiresIn: '1h'
        }
        );
}

function createSessionCookie(req, res, payload) {
    let jwtToken;
    if ((typeof payload.username !== 'undefined') &&
        (typeof payload.midExp !== 'undefined') &&
        (Math.floor(Date.now() / 1000) <= payload.midExp)) {
        jwtToken = req.headers.cookie;
    }
    else {
        jwtToken = createSessionJWT(payload.username);
    }
    res.cookie('SESSIONID', jwtToken, {httpOnly:true, secure:false});
}
module.exports.createSessionCookie = createSessionCookie;

function decodeSessionCookie(sessionid, res) {
    if (typeof sessionid === 'undefined') {
        return { username: -1 };
    }
    const RSA_PUBLIC_KEY = fs.readFileSync('./keys/jwtRS256.key.pub');
    try {
        const token = sessionJWT.verify(
            sessionid,
            RSA_PUBLIC_KEY,
            {algorithms: ['RS256']});
        return sendMessage(res,{token: token});
    }
    catch (err) {
        return sendError(res,{username: -1});
    }
}
module.exports.decodeSessionCookie = decodeSessionCookie;

