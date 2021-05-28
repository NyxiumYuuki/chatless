const config = require('./config');
const mongoose = require( 'mongoose' );
const url = config.mongodbHost;

mongoose.connect(url,({useNewUrlParser: true, useUnifiedTopology: true}));
console.log(mongoose.connection.readyState);

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
});

const messages = mongoose.model(config.mongodbMessages, schemaMessage);

// messages.find({},(err, messages) => {
//     if(err) throw  err;
//     console.log(messages);
// });

module.exports = messages;
