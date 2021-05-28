const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require ('cors');
const cookieParser = require('cookie-parser');
const auth = require ('./auth');
const bodyParser = require ('body-parser');
const {sendError, sendMessage} = require ('./message');
const messages = require('./mongodb-message');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({origin: 'http://127.0.0.1:4200', credentials: true}));
app.use(cookieParser());
io.use(function(socket, next){
    const session = auth.getSession(socket.request);
    const getUsername = auth.getUsername(session);
    if (getUsername === -1) {
        //sendError(res, 'not authenticated');
    }
    auth.setSessionCookie(socket.request, socket.request.res || {}, next);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection',socket => {
    let users = {}

    const session = auth.getSession(socket.request);
    const getUsername = auth.getUsername(session);

    console.log(`${getUsername} joined the chat.`);
    socket.broadcast.emit('general',`${getUsername} joined the chat.`);
    users[socket.id] = getUsername;
    messages.find({},(err, res) => {
        if(err) throw err;
        if(res.length > 0){
            const savedChat = res;
            socket.emit('general',savedChat);
        }
    });

    socket.on('general',function(data){
        socket.broadcast.emit('general',data);

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
        }).catch(function(error){
            console.log("error",error);
        });

    });

    socket.on('typing',(user)=>{
        socket.broadcast.emit('notifyTyping',user)
    })

    socket.on("disconnect", function() {
        console.log(`${socket.id} left the chat.`);
    });

});

server.listen(port, () => {
    console.log('listening on *:3000');
});