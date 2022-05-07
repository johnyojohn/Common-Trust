import { db } from "./firebase.js";
import * as express from "express";
import * as firestore from "firebase/firestore";
import { addCommentToUser, addCommentToPost } from "./putUtils.js";

const router = express.Router();

const commentPostReqCheck = (req) => {
    return (
        "authorId" in req.body &&
        "postId" in req.body &&
        "content" in req.body
    );
};

router.get("/", async (req) => {
    await db.collection("comments").get()
        .then((snapshot) => {
            const comments = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
            return res.status(200).json({
                message: "Successfully retrieved comments",
                data: comments,
            });
        })
        .catch((err) => {
            return res.status(500).json({ error: err });
        });
});

router.post("/", async (req, res) => {
    if (!commentPostReqCheck(req)) {
        return res.status(400).json({
            message: "Missing required parameters",
        });
    }
    const authorId = req.body.authorId;
    const postId = req.body.postId;
    const content = req.body.content;

    const commentId = db.collection("comments").doc().id;
    var newComment = {
        authorId: authorId,
        postId: postId,
        content: content,
        dateCreated: firestore.FieldValue.serverTimestamp(),
        likedCount: 0,
        likedUsers: [],
    }
    try {
        const updateUser = await addCommentToUser(authorId, commentId);
        const updatePost = await addCommentToPost(postId, commentId);
        if (updateUser && updatePost) {
            await db.collection("comments").doc(commentId).set(newComment);
            return res.status(201).json({
                message: "Successfully added comment",
                data: {
                    id: commentId,
                    ...newComment,
                }
            });
        } else {
            return res.status(404).json({
                message: "User or post not found",
            });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
});

export default router;