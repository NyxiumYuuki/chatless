const router = require("express").Router();
const Conversation = require("../models/Conversation");
const {sendError, sendMessage} = require ("../message");

// new conv
router.post("/newConv", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.sender, req.body.receiver]
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
    try {
        const conversation = await Conversation.findOne({$or: [{members: {$eq: [req.body.sender,req.body.receiver]}},{members: {$eq: [req.body.receiver,req.body.sender]}}]},{_id:1});
        sendMessage(res,conversation);
    }catch (err){
        sendMessage(res,err);
    }
})
module.exports = router;