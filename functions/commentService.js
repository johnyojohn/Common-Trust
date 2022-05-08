import { db } from "./firebase.js";
import * as express from "express";
import { addCommentToPost, addCommentToUser } from "./putUtils.js";
import { deleteCommentFromPost, deleteCommentFromUser } from "./deleteUtils.js";
import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const router = express.Router();

router.get("/:id", (req, res) => {
    const id = req.params.id;
    const commentDocReference = doc(db, "comments", id);
    getDoc(commentDocReference)
        .then((snapshot) => {
            if (!snapshot.exists()) {
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
            console.error(err);
            return res.status(500).json({ error: err });
        });
});

router.put("/:id", async (req, res) => {

    const id = req.params.id;
    const content = "content" in req.body ? req.body.content : null;
    const userId = "userId" in req.body ? req.body.userId : null;
    const postId = "postId" in req.body ? req.body.postId : null;
    const authorId = "authorId" in req.body ? req.body.authorId : null;

    const commentDocReference = doc(db, "comments", id);
    try {
        const commentSnapshot = await getDoc(commentDocReference);
        if (!commentSnapshot.exists()) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }
        else {
            const comment = commentSnapshot.data();
            const varToString = varObj => Object.keys(varObj)[0];
            [[varToString({ content }), content], 
            [varToString({ postId }), postId], 
            [varToString({ authorId }), authorId]]
            .forEach(([key, value]) => {
                if (value !== null) {
                    comment[key] = value;
                }
            });

            if (comment.likedUsers !== null && userId !== null) {
                if (comment.likedUsers.includes(userId)) {
                    comment.likedUsers = comment.likedUsers.filter(user => user !== userId);
                    comment.likedCount = comment.likedUsers.length;
                }
                else {
                    comment.likedUsers.push(userId);
                    comment.likedCount = comment.likedUsers.length;
                }
            }

            const updateUser = await addCommentToUser(id, comment.authorId);
            const updatePost = await addCommentToPost(id, comment.postId);
            if (updateUser && updatePost) {
                await updateDoc(commentDocReference, comment);
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
        console.error(err);
        return res.status(500).json({ error: err });
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const commentDocReference = doc(db, "comments", id);
    try {
        const commentSnapshot = await getDoc(commentDocReference);
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
                await deleteDoc(commentDocReference);
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
        console.error(err);
        return res.status(500).json({ error: err });
    }
});

export default router;


