const Comment = require("../models/Comment");
const Post = require("../models/Post")

// Comment-Features 
exports.createComment = async (req, res) => {
    try {
        const {postId, content} = req.body;
        const userId = req.body?.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "You are not authorized" });
        }
        // console.log("post id id",postId)
        const comment = new Comment({
            content,
            author: userId,
            post: postId
        });

        await comment.save();

        await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

        return res.status(201).json({ success: true, comment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
exports.editComment = async (req, res) => {
    try {
        const { commentId, content } = req.body;
        const userId = req.body?.user?.id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        if (comment.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to edit this comment" });
        }

        comment.content = content;
        await comment.save();

        return res.status(200).json({ success: true, comment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
exports.deleteComment = async (req, res) => {
    try {
        const { commentId, postId } = req.body;
        const userId = req.body?.user?.id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        if (comment.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this comment" });
        }

        await Comment.deleteMany({ parentComment: commentId });
        await Comment.findByIdAndDelete(commentId);
        await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });

        return res.status(200).json({ success: true, message: "Comment deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};



// Reply to Comment Features 

exports.replyToComment = async (req, res) => {
    try {
        const { commentId, content } = req.body;
        const userId = req.body?.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "You are not authorized" });
        }

        const parentComment = await Comment.findById(commentId);

        if (!parentComment) {
            return res.status(404).json({ success: false, message: "Parent comment not found" });
        }

        const reply = new Comment({
            content,
            author: userId,
            post: parentComment.post,
            parentComment: commentId
        });

        await reply.save();

        parentComment.replies.push(reply._id);
        await parentComment.save();

        return res.status(201).json({ success: true, reply });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

exports.editReply = async (req, res) => {
    try {
        const { replyId, content } = req.body;
        const userId = req.body?.user?.id;

        const reply = await Comment.findById(replyId);

        if (!reply) {
            return res.status(404).json({ success: false, message: "Reply not found" });
        }

        if (reply.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to edit this reply" });
        }

        reply.content = content;
        await reply.save();

        return res.status(200).json({ success: true, reply });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
exports.deleteReply = async (req, res) => {
    try {
        const { replyId, parentCommentId } = req.body;
        const userId = req.body?.user?.id;

        const reply = await Comment.findById(replyId);

        if (!reply) {
            return res.status(404).json({ success: false, message: "Reply not found" });
        }

        if (reply.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this reply" });
        }

        await Comment.findByIdAndDelete(replyId);
        await Comment.findByIdAndUpdate(parentCommentId, { $pull: { replies: replyId } });

        return res.status(200).json({ success: true, message: "Reply deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};


