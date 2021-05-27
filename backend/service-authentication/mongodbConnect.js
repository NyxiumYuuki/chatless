const config = require('./config');
const MongoClient = require( 'mongodb' ).MongoClient;
const uri = config.mongodbHost;
let db;

module.exports = {
    connectToServer: function( callback ) {
        MongoClient.connect( uri,  { useNewUrlParser: true,  useUnifiedTopology: true }, function( err, client ) {
            db  = client.db(config.mongodbDatabase);
            return callback( err );
        });
    },

    getDB: function() {
        return db;
    }
};

