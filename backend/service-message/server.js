const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require ('cors');
const cookieParser = require('cookie-parser');
const auth = require ('./auth');
const bodyParser = require ('body-parser');
const messages = require('./mongodb-message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true
    }
});
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:4200', credentials: true}));
app.use(cookieParser());


messages.insertMany([
    {
        username: 'yuki',
        date: new Date(),
        channel: 'general',
        message: 'Ceci est un message de test de la part de Yûki'
    },
    {
        username: 'wilfried',
        date: new Date(),
        channel: 'general',
        message: 'Ceci est un message de test de la part de Wilfried'
    },
    {
        username: 'khai',
        date: new Date(),
        channel: 'general',
        message: 'Ceci est un message de test de la part de Khai'
    },
    {
        username: 'cloud',
        date: new Date(),
        channel: 'general',
        message: 'Ceci est un message à des fins de démonstration'
    },
]);

io.on('connection',socket => {

    auth.getSession(socket.request, function(res){
        const getUsername = auth.getUsername(res);
        if (getUsername === -1) {
            socket.send('error','not authenticated');
        }
        else{
            console.log(`${new Date()}] ${getUsername} joined the chat.`);
            socket.broadcast.emit('general',[{
                username: 'Server',
                date: new Date(),
                channel: 'general',
                message: `${getUsername} joined the chat.`
            }]);
            messages.find({}, {'_id':0},{sort: {'date':1}},(err, res) => {
                if(err) throw err;
                if(res.length > 0){
                    //console.log(res, res.length);
                    socket.emit('general',res);
                }
                socket.emit('general',[{
                    username: 'Server',
                    date: new Date(),
                    channel: 'general',
                    message: `${getUsername} joined the chat.`
                }]);
            });

            socket.on('general',function(data){
                const username = data.username;
                const date = data.date;
                const channel = 'general';
                const message = data.message;

                messages.insertMany([{
                    username: username,
                    date: date,
                    channel: channel,
                    message: message
                }
                ]).then(function(){
                    //console.log(data, "inserted");
                    socket.broadcast.emit('general',[data]);
                    socket.emit('general',[data]);
                }).catch(function(error){
                    console.log("error",error);
                });

            });

            socket.on("disconnect", function() {
                console.log(`${new Date()}] ${getUsername} left the chat.`);
                socket.broadcast.emit('general',[{
                    username: 'Server',
                    date: new Date(),
                    channel: 'general',
                    message: `${getUsername} left the chat.`
                }]);
            });
        }
    });
});

server.listen(port,'0.0.0.0', () => {
    console.log (`listening on port ${port}`);
});