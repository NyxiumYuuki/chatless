const sessionJWT = require ('jsonwebtoken');
const fs = require ('fs');

// renvoie un nouveau token JWT
function createSessionJWT (userId) {
    // ci-dessous, on met en place le cookie de session JWT :
    // 1/ on recupere notre clef privee
    const RSA_PRIVATE_KEY = fs.readFileSync('./keys/jwtRS256.key');

    // 2/ on signe un token JWT. Le payload est l'identifiant de
    // l'utilisateur ainsi qu'une date d'expiration à mi-parcours :
    // on récupérra ultérieurement ces informations, qui permettront
    // de savoir si le token est valide ou non et de connaître l'ID
    // de l'utilisateur. Dans le token, le champ exp indique la date
    // de validité du token (pas besoin de se relogguer tant que la
    // date actuelle est inférieure à exp) et le champ midExp indique
    // à partir de quel moment on doit recréer un nouveau cookie de
    // session.
    const jwtToken = sessionJWT.sign(
        {
            userId: userId,
            midExp: Math.floor(Date.now() / 1000) + 1800 // validité: 30mn
        },
        RSA_PRIVATE_KEY,
        {
            algorithm: 'RS256',
            expiresIn: '1h' // champ exp: validité 1h
    });

    return jwtToken;
}


// crée un cookie de session JWT (Si le JWT de la requête est encore valide,
// on l'utilise, sinon on en recrée un nouveau)
function createSessionCookie(req, res, payload) {
    // on regarde si le payload contient les champs userId et midExp. Si c'est le
    // cas, c'est qu'on a reçu dans la request un cookie. On va donc vérifier si
    // ce cookie est encore valide ou non : si la date actuelle est inférieure à
    // midExp, alors le cookie est encore valide et on peut le renvoyer. Sinon,
    // on doit recalculer un nouveau cookie.
    let jwtToken = '';
    if ((typeof payload.userId !== 'undefined') && 
        (typeof payload.midExp !== 'undefined') &&
        (Math.floor(Date.now() / 1000) <= payload.midExp)) {
        jwtToken = req.cookies.SESSIONID;
    }
    else {
        // on crée un nouveau cookie
        jwtToken = createSessionJWT(payload.userId);
    }

    // on renvoie le cookie au client
    // on met le secure à false afin de pouvoir utiliser http plutôt que https
    res.cookie('SESSIONID', jwtToken, {httpOnly:true, secure:false});
}
module.exports.createSessionCookie = createSessionCookie;


// décode un cookie de session et renvoie les informations contenues dans ce
// cookie, notamment le userId. Si le cookie n'existe pas, la fonction renvoie
// juste un objet avec un userId égal à -1.
function decodeSessionCookie(req) {
    // si l'on n'a pas de cookie de session, on renvoie une session avec vide,
    // avec juste un userId à -1
    console.log(req.cookies);
    if (typeof req.cookies.SESSIONID === 'undefined') {
        return { userId: -1 };
    }
    const sessionid = req.cookies.SESSIONID;

    // on lit la clef publique
    const RSA_PUBLIC_KEY = fs.readFileSync('./keys/jwtRS256.key.pub');

    // on récupère les données du cookie
    try {
        const token = sessionJWT.verify(
            sessionid,
            RSA_PUBLIC_KEY,
            {algorithms: ['RS256']});
        return token;
    }
    catch (err) {
        return {userId: -1};
    }
}
module.exports.decodeSessionCookie = decodeSessionCookie;

