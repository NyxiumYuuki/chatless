const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String
        },
        sender: {
            type: String
        },
        text: {
            type: String
        },
        date:{
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PrivatedMessage", MessageSchema);