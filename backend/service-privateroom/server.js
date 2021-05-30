const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:4200",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors({origin: 'http://127.0.0.1:4200', credentials: true}));

const mongoose = require("mongoose");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const router = express.Router();
const path = require("path");
const config = require("./config");

const Conversations = require("../service-privateroom/models/Conversation");
const url = config.mongodbHost+config.mongodbDatabase;

mongoose.connect(url,({useNewUrlParser: true, useUnifiedTopology: true})).then( function(){
    console.log('mongodb-privated-room connected '+mongoose.connection.readyState);
}).catch(function(err){
    console.log('error : '+err);
});


app.use("/conversations", conversationRoute);
app.use("/messages", messageRoute);

io.on('connection',socket => {

    let users = {};

    auth.getSession(socket.request, function(res){
        const getUsername = auth.getUsername(res);
        if (getUsername === -1) {
            socket.send('error','not authenticated');
        }
        else{
            console.log(`${getUsername} joined the chat.`);

            //TODO apply conversations and messages

            socket.on("disconnect", function() {
                console.log(`${getUsername} left the chat.`);
            });
        }
    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}/`);
});