const router = require("express").Router();
const Conversation = require("../models/Conversation");
const {sendError, sendMessage} = require ("../message");

// new conv
router.post("/newConv", async (req, res) => {
    if (typeof req.body.sender === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ sender');
    if (typeof req.body.receiver === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ receiver');
    const newConversation = new Conversation({
        members: [req.body.sender, req.body.receiver], owner: null
    });

    try{
        const savedConversation = await newConversation.save();
        sendMessage(res,savedConversation._id);
    }catch (err){
        sendError(res,err);
    }
});

// get conv
router.post("/getConv", async (req, res) => {
    if (typeof req.body.sender === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ sender');
    if (typeof req.body.receiver === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ receiver');
    try {
        const conversation = await Conversation.findOne({$or: [{members: {$eq: [req.body.sender,req.body.receiver]}},{members: {$eq: [req.body.receiver,req.body.sender]}}]},{_id:1});
        sendMessage(res,conversation);
    }catch (err){
        sendMessage(res,err);
    }
})

// get conv
router.post("/getRooms", async (req, res) => {
    if (typeof req.body.member === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ sender');
    try {
        const conversation = await Conversation.find({members: {$in: [req.body.member]}, owner: {$exists: true}},{_id:1});
        sendMessage(res,conversation);
    }catch (err){
        sendMessage(res,err);
    }
})

// new Room
router.post("/newRoom", async (req, res) => {
    if (typeof req.body.owner === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ sender');
    const newConversation = new Conversation(
        {members: req.body.owner, owner: req.body.owner});

    try{
        const savedConversation = await newConversation.save();
        sendMessage(res,savedConversation._id);
    }catch (err){
        sendError(res,err);
    }
});

// add Room Member
router.post("/addRoomMember", async (req, res) => {
    if (typeof req.body.conversationid === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ conversationId');
    if (typeof req.body.owner === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ owner');
    if (typeof req.body.member === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ member');
    if(req.body.member === req.body.owner){
        return sendError(res, 'Impossible de vous ajouter vous même');
    }

    try{
        await Conversation.updateOne(
            {_id: req.body.conversationid, owner: req.body.owner},
            {$addToSet: {members: req.body.member}},
            {useFindAndModify: false},
            function(err, result){
                if(result !== undefined){
                    console.log(result);
                    if(result.nModified === 1){
                        sendMessage(res,req.body.member+' added');
                    }
                    else{
                        sendError(res,err);
                    }
                }
                else{
                    sendError(res,err);
                }
            });
    }catch (err){
        sendError(res,err);
    }
});


// remove Room Member
router.post("/removeRoomMember", async (req, res) => {
    if (typeof req.body.conversationid === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ conversationId');
    if (typeof req.body.owner === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ owner');
    if (typeof req.body.member === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ member');
    if(req.body.member === req.body.owner){
        return sendError(res, 'Impossible de vous enlever vous même');
    }

    try{
        await Conversation.updateOne(
            {_id: req.body.conversationid, owner: req.body.owner},
            {$pull: {members: req.body.member}},
            {useFindAndModify: false},
            function(err, result){
                if(result !== undefined){
                    console.log(result);
                    if(result.nModified === 1){
                        sendMessage(res,req.body.member+' removed');
                    }
                    else{
                        sendError(res,err);
                    }
                }
                else{
                    sendError(res,err);
                }
            });
    }catch (err){
        sendError(res,err);
    }
});

module.exports = router;

