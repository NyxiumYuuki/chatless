const config = require('./config');
const mongoose = require( 'mongoose' );
const url = config.mongodbHost+config.mongodbDatabase;

mongoose.connect(url,({useNewUrlParser: true, useUnifiedTopology: true})).then( function(){
    console.log('mongodb-message connected '+mongoose.connection.readyState);
}).catch(function(err){
    console.log('error : '+err);
});

const schemaMessage = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    channel:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    }
},{ versionKey: false });

const messages = mongoose.model(config.mongodbMessages, schemaMessage);

// messages.find({},(err, messages) => {
//     if(err) throw  err;
//     console.log(messages);
// });

module.exports = messages;
