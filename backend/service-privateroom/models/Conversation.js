const mongoose = require("mongoose");
const config = require("../config");

const url = config.mongodbHost+config.mongodbDatabase;

mongoose.connect(url,({useNewUrlParser: true, useUnifiedTopology: true})).then( function(){
    console.log('mongodb-conversation connected '+mongoose.connection.readyState);
}).catch(function(err){
    console.log('error : '+err);
});

const ConversationSchema = new mongoose.Schema(
    {
        members: {
            type: Array
        },
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model(config.mongodbConversations, ConversationSchema);