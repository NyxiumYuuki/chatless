const router = require("express").Router();
const Messages = require("../models/Message");

// add
router.post("/", async (req, res) => {
    let newMessage = new Messages(req.body);
    const date = Date.now();
    newMessage["date"] = date;
    // res.status(200).json(newMessage);
    try{
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    }catch (err){
        res.status(500).json(err)
    }
})

// get
router.get("/:conversationId", async (req, res) => {
    try{
        const messages = await Messages.find({
            conversationId: req.params.conversationId
        })
        res.status(200).json(messages);
    }catch (err){
        res.status(500).json(err)
    }
})
module.exports = router;