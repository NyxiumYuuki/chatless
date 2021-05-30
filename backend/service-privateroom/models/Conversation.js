const config = require('../config');
const mongoose = require( 'mongoose' );
const url = config.mongodbHost+config.mongodbDatabase;

mongoose.connect(url,({useNewUrlParser: true, useUnifiedTopology: true})).then( function(){
    console.log('mongodb-privated-room connected '+mongoose.connection.readyState);
}).catch(function(err){
    console.log('error : '+err);
});

const ConversationSchema = new mongoose.Schema(
    {
        members: {
            type: Array
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);