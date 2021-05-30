const config = {
    mongodbDatabase: 'chat',
    mongodbHost:     'mongodb://127.0.0.1:27021/',
    // mongodbHost:     'mongodb://127.0.0.1:27018/', //when commit
    charset:       'utf8',
    mongodbLogin:  '',
    mongodbPassword: '',

    mongodbPrivatedMessages: 'privatedMessages',
    mongodbConversations: 'conversations'
};
module.exports = config;



