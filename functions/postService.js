import { db } from "./firebase.js";
import * as express from "express";
import * as firestore from "firebase/firestore";
import { addPostToUser, addPostToClass } from "./putUtils.js";
import { deletePostFromUser, deletePostFromClass, deleteAllCommentsFromPost } from "./deleteUtils.js";

const router = express.Router();

router.get("/:id", (req, res) => {
    const id = req.params.id;
    db.collection("posts").doc(id).get()
        .then((snapshot) => {
            if (!snapshot) {
                return res.status(404).json({
                    message: "Post not found",
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
        });
});

router.put("/:id", async (req, res) => {

    const id = req.params.id;
    const title = "title" in req.body ? req.body.title : null;
    const content = "content" in req.body ? req.body.content : null;
    const postDate = firestore.Timestamp.now().toDate();
    const likedUsers = "likedUsers" in req.body ? req.body.likedUsers : null;
    const likedCount = "likedCount" in req.body ? req.body.likedCount : null;
    const classId = "classId" in req.body ? req.body.classId : null;
    const authorId = "authorId" in req.body ? req.body.authorId : null;
    const commentsIdArr = "commentsIdArr" in req.body ? req.body.commentsIdArr : null;

    const postDocReference = db.collection("posts").doc(id);
    try {
        const postSnapshot = await postDocReference.get();
        if (!postSnapshot) {
            return res.status(404).json({
                message: "Post not found",
            });
        }
        else {
            const post = postSnapshot.data();
            [title, content, postDate, likedUsers, likedCount, classId, authorId, commentsIdArr].forEach((field) => {
                if (field) {
                    post[field] = field;
                }
            });

            const updateUser = await addPostToUser(id, post.authorId);
            const updateClass = await addPostToClass(id, post.classId);
            if (updateUser && updateClass) {
                await postDocReference.update(post);
                return res.status(200).json({
                    message: "Successfully updated post",
                    data: {
                        id: post.id,
                        ...post,
                    }
                });
            }
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const postDocReference = db.collection("posts").doc(id);
    try {
        const postSnapshot = await postDocReference.get();
        if (!postSnapshot) {
            return res.status(404).json({
                message: "Post not found",
            });
        }
        else {
            const post = postSnapshot.data();
            const updateUser = await deletePostFromUser(id, post.authorId);
            const updateClass = await deletePostFromClass(id, post.classId);
            const deleteComments = await deleteAllCommentsFromPost(post.commentsIdArr);
            if (updateUser && updateClass && deleteComments) {
                await postDocReference.delete();
                return res.status(200).json({
                    message: "Successfully deleted post",
                });
            }
            else {
                return res.status(404).json({
                    message: "User or class not found",
                });
            }
        }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

export default router;