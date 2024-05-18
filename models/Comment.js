const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});
module.exports = mongoose.model("Comment",commentSchema);
