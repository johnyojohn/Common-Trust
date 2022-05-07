import { db } from "./firebase.js";
import * as express from "express";
import { addCommentToPost, addCommentToUser } from "./putUtils.js";
import { deleteCommentFromPost, deleteCommentFromUser } from "./deleteUtils.js";

const router = express.Router();

router.get("/:id", (req, res) => {
    const id = req.params.id;
    db.collection("comments").doc(id).get()
        .then((snapshot) => {
            if (!snapshot) {
                return res.status(404).json({
                    message: "Comment not found",
                });
            }
            else {
                return res.status(200).json({
                    message: "Successfully retrieved comment",
                    data: {
                        id: snapshot.id,
                        ...snapshot.data(),
                    }
                });
            }
        })
        .catch((err) => {
            return res.status(500).json({ error: err });
        }
        );
});

router.put("/:id", async (req, res) => {

    const id = req.params.id;
    const content = "content" in req.body ? req.body.content : null;
    const likedUsers = "likedUsers" in req.body ? req.body.likedUsers : null;
    const likedCount = "likedCount" in req.body ? req.body.likedCount : null;
    const postId = "postId" in req.body ? req.body.postId : null;
    const authorId = "authorId" in req.body ? req.body.authorId : null;

    const commentDocReference = db.collection("comments").doc(id);
    try {
        const commentSnapshot = await commentDocReference.get()
        if (!commentSnapshotexists) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }
        else {
            const comment = commentSnapshot.data();
            const varToString = varObj => Object.keys(varObj)[0];
            [[varToString({ content }), content], 
            [varToString({ likedUsers }), likedUsers], 
            [varToString({ likedCount }), likedCount], 
            [varToString({ postId }), postId], 
            [varToString({ authorId }), authorId]]
            .forEach((key, value) => {
                if (value) {
                    comment[key] = value;
                }
            });
            const updateUser = await addCommentToUser(id, comment.authorId);
            const updatePost = await addCommentToPost(id, comment.postId);
            if (updateUser && updatePost) {
                await commentDocReference.update(comment);
                return res.status(200).json({
                    message: "Successfully updated comment",
                    data: {
                        id: comment.id,
                        ...comment,
                    }
                });
            }
            else {
                return res.status(404).json({
                    message: "User or post not found",
                });
            }
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const commentDocReference = db.collection("comments").doc(id);
    try {
        const commentSnapshot = await commentDocReference.get();
        if (!commentSnapshot) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }
        else {
            const comment = commentSnapshot.data();
            const updateUser = await deleteCommentFromUser(id, comment.authorId);
            const updatePost = await deleteCommentFromPost(id, comment.postId);
            if (updateUser && updatePost) {
                await commentDocReference.delete();
                return res.status(200).json({
                    message: "Successfully deleted comment",
                });
            }
            else {
                return res.status(404).json({
                    message: "User or post not found",
                });
            }
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
});

export default router;


