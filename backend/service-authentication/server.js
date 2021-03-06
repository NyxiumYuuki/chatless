const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors({origin: 'http://localhost:4200', credentials: true}));

const mongoConnect = require('./mongodbConnect');

mongoConnect.connectToServer(function( err, client ) {
    if (err) console.log(err);
    const checkLogin = require('./checkLogin');
    const register = require('./register');
    const changePassword = require('./changePassword');
    const getUsers = require('./getUsers');
    const queries = require('./mongodbQueries');
    const auth =  require('./auth');

    queries.register('Server','admin');
    queries.register('khai','test');
    queries.register('wilfried','test');
    queries.register('yuki','test');
    queries.register('cloud','computing');

    app.post('/verify:token', (req, res) => {
        if(typeof req.body !== 'undefined'){
            auth.getSession(req.body.sessionid,res);
        }
        return null;
    });

    app.post('/checkLogin', (req, res) => {
        checkLogin(req,res);
    });

    app.post('/register', (req, res) => {
        register(req,res);
    });

    app.post('/getUsers', (req, res) => {
        getUsers(req,res);
    });

    app.post('/changePassword', (req, res) => {
        changePassword(req,res);
    });

    app.listen(port, '0.0.0.0',() => {
        console.log (`listening on port ${port}`);
    });
});


