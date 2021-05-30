const request = require('request');

function getSession (req, callback) {
    if(typeof req.headers.cookie !== 'undefined'){
        request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url: 'http://127.0.0.1:3000/verify:token',
            body: 'sessionid='+req.headers.cookie.replace('SESSIONID=','')
        },function (error, response, body) {
            const bodyJson = JSON.parse(body);
            if (bodyJson && bodyJson.status && bodyJson.data) {
                if (bodyJson.status === 'ok') {
                    return callback(bodyJson.data.token);
                } else {
                    return callback(bodyJson.data.reason);
                }
            }
        });
    }
    return callback(undefined);
}
module.exports.getSession = getSession;

function getUsername(session) {
    if (typeof session === 'undefined' || typeof session.username === 'undefined') return -1;
    return session.username;
}
module.exports.getUsername = getUsername;
