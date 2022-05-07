import { db } from "./firebase.js";
import * as express from "express";
import { addUserToClasses } from "./putUtils.js";
import { deleteUserFromClasses, deletePostFromClass, deleteAllCommentsFromPost } from "./deleteUtils.js";
import { getDoc, collection, doc } from "firebase/firestore";

const router = express.Router();

router.get("/:id", (req, res) => {
    const id = req.params.id;
    getDoc(doc(db, "users", id))
        .then((snapshot) => {
            if (!snapshot) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            else {
                return res.status(200).json({
                    message: "Successfully retrieved user",
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
    const email = "email" in req.body ? req.body.email : null;
    const firstName = "firstName" in req.body ? req.body.firstName : null;
    const lastName = "lastName" in req.body ? req.body.lastName : null;
    const classes = "classes" in req.body ? req.body.classes : null;
    const postsIdArr = "postsIdArr" in req.body ? req.body.postsIdArr : null;
    const postsCount = "postsCount" in req.body ? req.body.postsCount : null;
    const commentsIdArr = "commentsIdArr" in req.body ? req.body.commentsIdArr : null;

    const userDocReference = db.collection("users").doc(id);
    try {
        const userDoc = getDocs(collection("users"))
        if (!userDoc.exists) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        else {
            const userData = userDoc.data();
            const originalClasses = userData.classes;
            const newClasses = classes ? classes : originalClasses;
            const varToString = varObj => Object.keys(varObj)[0];
            [[varToString({ email }), email],
            [varToString({ firstName }), firstName],
            [varToString({ lastName }), lastName],
            [varToString({ classes }), classes],
            [varToString({ postsIdArr }), postsIdArr],
            [varToString({ postsCount }), postsCount],
            [varToString({ commentsIdArr }), commentsIdArr]]
            .forEach((key, value) => {
                if (value) {
                    userData[key] = value;
                }
            });
            const addedClasses = newClasses.filter(className => !originalClasses.includes(className));
            const removedClasses = originalClasses.filter(className => !newClasses.includes(className));
            await deleteUserFromClasses(id, removedClasses);
            await addUserToClasses(id, addedClasses);
            await userDocReference.update(userData);
            return res.status(200).json({
                message: "Successfully updated user",
            });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const userDocReference = db.collection("users").doc(id);
    try {
        const userDoc = await userDocReference.get();
        if (!userDoc.exists) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        else {
            const userData = userDoc.data();
            const classes = userData.classes;
            await deleteUserFromClasses(id, classes);
            for (const postId of userData.postsIdArr) {
                const classId = db.collection("posts").doc(postId).get().then(snapshot => snapshot.data().classId);
                await deletePostFromClass(postId, classId);
                await deleteAllCommentsFromPost(postId);
            }
            await userDocReference.delete();
            return res.status(200).json({
                message: "Successfully deleted user",
            });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
});

export default router;