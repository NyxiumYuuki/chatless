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

const Conversation = require("../service-privateroom/models/Conversation");
const Message = require("../service-privateroom/models/Message");
const conversationRoute = require("./routes/conversations");
app.use("/conversations", conversationRoute);

io.on('connection',socket => {

    auth.getSession(socket.request, function(res){
        const getUsername = auth.getUsername(res);
        if (getUsername === -1) {
            socket.send('error','not authenticated');
        }
        else{
            //TODO apply conversations and messages
            socket.on('privateroom',function(data){
                console.log(`${getUsername} joined the chat.`);
                const sender = data.sender;
                const receiver = data.receiver;
                const date = data.date;
                const message = data.message;

                // get conversationId
                let conversation = async () => {
                    try {
                        const result = await Conversation.find({
                            members: {$eq: [sender, receiver]},
                        });
                        return result[0]["_id"];
                    }catch (err){
                    }
                }

                console.log('1azd',conversation);

                if (conversation === null){
                    const newConversation = new Conversation({
                        members: [sender, receiver]
                    });
                    let result = async () => {
                        try{
                            const savedConversation = await newConversation.save();
                            return savedConversation;
                        }catch (err){
                        }
                    }
                    conversation = result;
                }
                console.log('2 ac',conversation);
                const conversationId = conversation["_id"];


                Message.insertMany([{
                    conversationId: conversationId,
                    sender: sender,
                    text: message,
                    date: date
                }
                ]).then(function(){
                    console.log(data, "inserted");
                    socket.broadcast.emit(conversationId,[data]);
                    socket.emit(conversationId,[data]);
                }).catch(function(error){
                    console.log("error",error);
                });
            });

            socket.on("disconnect", function() {
                console.log(`${getUsername} left the chat.`);
            });
        }
    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}/`);
});