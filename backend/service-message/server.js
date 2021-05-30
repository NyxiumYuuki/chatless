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
    origin: "http://127.0.0.1:4200",
    methods: ["GET", "POST"],
    credentials: true
    }
});
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors({origin: 'http://127.0.0.1:4200', credentials: true}));
app.use(cookieParser());

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

io.on('connection',socket => {

    let users = {};

    auth.getSession(socket.request, function(res){
        const getUsername = auth.getUsername(res);
        if (getUsername === -1) {
            socket.send('error','not authenticated');
        }
        else{
            console.log(`${getUsername} joined the chat.`);
            socket.broadcast.emit('general',[{
                username: 'Server',
                date: new Date(),
                channel: 'general',
                message: `${getUsername} joined the chat.`
            }]);
            users[socket.id] = getUsername;
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
                const date = Date.now();
                const channel = 'general';
                const message = data.message;

                messages.insertMany([{
                    username: username,
                    date: date,
                    channel: channel,
                    message: message
                }
                ]).then(function(){
                    console.log(data, "inserted");
                    socket.broadcast.emit('general',[data]);
                    socket.emit('general',[data]);
                }).catch(function(error){
                    console.log("error",error);
                });

            });

            socket.on("disconnect", function() {
                console.log(`${getUsername} left the chat.`);
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

server.listen(port, () => {
    console.log(`listening on *:${port}/`);
});