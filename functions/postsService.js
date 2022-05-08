import { db } from "./firebase.js";
import * as admin from "firebase-admin";
import * as express from "express";
import { addPostToClass, addPostToUser } from "./putUtils.js";
import {getDocs, collection, doc, setDoc, getDoc, serverTimestamp} from "firebase/firestore";

const router = express.Router();

router.get("/", async (req, res) => {
    const postsDocReference = collection(db, "posts");
    await getDocs(postsDocReference)
        .then((snapshot) => {
            const posts = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
            return res.status(200).json({
                message: "Successfully retrieved posts",
                data: posts,
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err });
        });
});

const postPostReqCheck = (req) => {
    return (
        req.body.classId &&
        req.body.title &&
        req.body.content &&
        req.body.authorId);
};

router.post("/", async (req, res) => {
    if (!postPostReqCheck(req)) {
        return res.status(400).json({
            message: "Missing required parameters",
        });
    } else {
        const userDocReference = doc(collection(db, "users"), req.body.authorId);
        const userDoc = await getDoc(userDocReference);
        if (!userDoc.exists()) {
            return res.status(404).json({
                "message": "User not found",
            });
        }
        const newPost = {
            title: req.body.title,
            content: req.body.content,
            postDate: serverTimestamp(),
            likedUsers: [],
            likedCount: 0,
            classId: req.body.classId,
            authorId: req.body.authorId,
            commentsIdArr: []
        };
        try {
            const postRef = doc(collection(db, "posts"));
            const postId = postRef.id;
            const updateClass = await addPostToClass(postId, newPost.classId);
            const updateUser = await addPostToUser(postId, newPost.authorId);
            if (updateClass && updateUser) {
                await setDoc(postRef, newPost);
                return res.status(201).json({
                    message: "Successfully created post",
                    data: {
                        id: postId,
                        ...newPost,
                    },
                });
            }
            else {
                return res.status(404).json({
                    message: "Class or user not found",
                });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to create post",
                error: err,
            });
        }
    }
});

export default router;