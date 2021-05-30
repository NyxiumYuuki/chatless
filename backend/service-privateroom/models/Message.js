const mongoose = require("mongoose")
const config = require("../config");

const url = config.mongodbHost+config.mongodbDatabase;

mongoose.connect(url,({useNewUrlParser: true, useUnifiedTopology: true})).then( function(){
    console.log('mongodb-privated-room connected '+mongoose.connection.readyState);
}).catch(function(err){
    console.log('error : '+err);
});

const MessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String
        },
        sender: {
            type: String
        },
        text: {
            type: String
        },
        date:{
            type: Date,
        },
    },
    { timestamps: true },
    { versionKey: false }
);

module.exports = mongoose.model(config.mongodbPrivatedMessages, MessageSchema);