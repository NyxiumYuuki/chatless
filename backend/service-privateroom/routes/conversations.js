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
    if (typeof req.body.sender === 'undefined' && typeof req.body.member === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ sender ou member');
    if (typeof req.body.receiver === 'undefined' && typeof req.body.roomName === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ receiver ou roomName');

    if (typeof req.body.sender === 'undefined'){
        try {
            const conversation = await Conversation.find({members: {$in: [req.body.member]}, roomName: req.body.roomName},{_id:1});
            if(conversation === []){
                sendError(res, 'Not found');
            }
            else{
                sendMessage(res,conversation[0]);
            }
        }catch (err){
            sendError(res,err);
        }
    }
    else{
        try {
            const conversation = await Conversation.findOne({$or: [{members: {$eq: [req.body.sender,req.body.receiver]}},{members: {$eq: [req.body.receiver,req.body.sender]}}]},{_id:1});
            console.log(conversation);
            sendMessage(res,conversation);
        }catch (err){
            sendError(res,err);
        }
    }
});


// getRooms
router.post("/getRooms", async (req, res) => {
    if (typeof req.body.member === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ member');
    try {
        const conversation = await Conversation.find({members: {$in: [req.body.member]}, roomName: {$exists: true}},{});
        console.log(conversation);
        sendMessage(res,conversation);
    }catch (err){
        sendError(res,err);
    }
});

// getMembers
router.post("/getMembers", async (req, res) => {
    if (typeof req.body.conversationid === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ conversationid');
    try {
        const conversation = await Conversation.find({_id: req.body.conversationid},{members: 1});
        sendMessage(res,conversation);
    }catch (err){
        sendError(res,err);
    }
});

// new Room
router.post("/newRoom", async (req, res) => {
    if (typeof req.body.owner === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ owner');
    if (typeof req.body.roomName === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé le champ roomName');
    await Conversation.updateOne(
        {roomName: req.body.roomName},
        {$setOnInsert: {members: req.body.owner, owner: req.body.owner, roomName: req.body.roomName}},
        {upsert:true},function(err,result){
            if(result !== undefined){
                if(typeof result.upserted !== 'undefined'){
                    sendMessage(res,result.upserted[0]._id);
                }else{
                    sendError(res,'Room already exist');
                }
            }else{
                sendError(res,err);
            }
        });
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

