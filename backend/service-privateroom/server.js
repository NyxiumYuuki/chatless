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

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cors = require('cors');
app.use(cors({origin: 'http://127.0.0.1:4200', credentials: true}));

const auth = require("./auth");

const Message = require("./models/Message");
const conversationRoute = require("./routes/conversations");
app.use("/conversations", conversationRoute);

const Conversation = require("./models/Conversation");
Conversation.updateOne(
    {roomName: 'Demonstration Room'},
    {$setOnInsert: {members: ['cloud','yuki','wilfried','khai'], owner: 'cloud', roomName: 'Demonstration Room'}},
    {upsert:true},function(err,result){
        if(result !== undefined){
            if(typeof result.upserted !== 'undefined'){
                Message.insertMany([
                    {
                        conversationId: result.upserted[0]._id,
                        sender: 'yuki',
                        text: 'Message à des fins de démonstration pour private room de Yûki',
                        date: new Date()
                    },
                    {
                        conversationId: result.upserted[0]._id,
                        sender: 'wilfried',
                        text: 'Message à des fins de démonstration pour private room de Wilfried',
                        date: new Date()
                    },
                    {
                        conversationId: result.upserted[0]._id,
                        sender: 'khai',
                        text: 'Message à des fins de démonstration pour private room de Khai',
                        date: new Date()
                    },
                    {
                        conversationId: result.upserted[0]._id,
                        sender: 'cloud',
                        text: 'Message à des fins de démonstration pour private room de Cloud',
                        date: new Date()
                    },
                    ]);
            }else{
                console.log('Room already exist');
            }
        }else{
            console.log(err);
        }
    });

io.on('connection',socket => {

    auth.getSession(socket.request, function(res){
        const getUsername = auth.getUsername(res);
        if (getUsername === -1) {
            socket.send('error','not authenticated');
        }
        else{

            socket.on('joinroom', function (data){
                console.log(`${new Date()}] ${getUsername} joined the chat.`);
                const conversationId = data.room;
                socket.broadcast.emit(conversationId,[{
                    username: 'Server',
                    date: new Date(),
                    channel: conversationId,
                    message: `${getUsername} joined the chat.`
                }]);

                Message.find({conversationId: {$eq: conversationId}}, {'_id':0, 'username': '$sender', 'date':'$date', 'channel':'$conversationId', 'message':'$text'},{sort: {'date':1}},(err, res) => {
                    if(err) throw err;
                    if(res.length > 0){
                        socket.emit(conversationId,res);
                    }
                    socket.emit(conversationId,[{
                        username: 'Server',
                        date: new Date(),
                        channel: conversationId,
                        message: `${getUsername} joined the chat.`
                    }]);
                });
            });

            socket.on('privateroom',function(data){
                console.log(`${getUsername} joined the chat.`);
                const sender = data.sender;
                const conversationId = data.room;
                const date = data.date;
                const message = data.message;

                Message.insertMany([{
                    conversationId: conversationId,
                    sender: sender,
                    text: message,
                    date: date
                }
                ]).then(function(){
                    console.log(data, "inserted");
                    const newData = {
                        username: data.sender,
                        date: data.date,
                        channel: conversationId,
                        message: data.message
                    }
                    socket.broadcast.emit(conversationId,[newData]);
                    socket.emit(conversationId,[newData]);
                }).catch(function(error){
                    console.log("error",error);
                });
            });

            socket.on("disconnect", function() {
                console.log(`${new Date()}] ${getUsername} left the chat.`);
            });
        }
    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}/`);
});