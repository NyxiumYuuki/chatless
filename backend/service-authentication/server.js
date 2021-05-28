const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors({origin: 'http://127.0.0.1:4200', credentials: true}));

const mongoConnect = require('./mongodbConnect');

mongoConnect.connectToServer(function( err, client ) {
    if (err) console.log(err);

    const checkLogin = require('./checkLogin');

    app.post('/checkLogin', (req, res) => {
        checkLogin(req,res);
    });

    const register = require('./register');
    app.post('/register', (req, res) => {
        register(req,res);
    });

    app.listen(port, () => {
        console.log (`listening on port ${port}`);
    });
});


