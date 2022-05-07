import { db } from "./firebase.js";
import * as express from "express";
import { addUserToClass } from "./putUtils.js";
import { deleteUserFromClass, deleteClassFromUser, deleteAllCommentsFromPost, deletePostFromUser } from "./deleteUtils.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    await db.collection("classes").doc(id).get()
        .then((snapshot) => {
            if (!snapshot.exists) {
                return res.status(404).json({
                    message: "Class not found",
                });
            }
            else {
                return res.status(200).json({
                    message: "Successfully retrieved class",
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

    // cannot update students or posts from class
    const departmentAbbr = "departmentAbbr" in req.body ? req.body.departmentAbbr : null;
    const courseNumber = "courseNumber" in req.body ? req.body.courseNumber : null;
    const courseFullTitle = "courseFullTitle" in req.body ? req.body.courseFullTitle : null;
    const instructorsIdArr = "instructorsIdArr" in req.body ? req.body.instructorsIdArr : null;

    const classDocReference = db.collection("classes").doc(id);
    try {
        const classDoc = await classDocReference.get();
        if (!classDoc.exists) {
            return res.status(404).json({
                message: "Class not found",
            });
        }
        else {
            const classData = classDoc.data();
            const varToString = varObj => Object.keys(varObj)[0];
            const originalInstructors = classData.instructors;
            const newInstructors = instructorsIdArr ? instructorsIdArr : originalInstructors;
            [[varToString({ departmentAbbr }), departmentAbbr],
            [varToString({ courseNumber }), courseNumber],
            [varToString({ courseFullTitle }), courseFullTitle],
            [varToString({ instructorsIdArr }), instructorsIdArr],
            [varToString({ postsIdArr }), postsIdArr],
            [varToString({ studentsIdArr }), studentsIdArr]]
            .forEach((key, value) => {
                if (value) {
                    classData[key] = value;
                }
            });
            const addedInstructors = newInstructors.filter(id => !originalInstructors.includes(id));
            const removedInstructors = originalInstructors.filter(id => !newInstructors.includes(id));
            await addedInstructors.map(async (instructorId) => {
                await addUserToClass(instructorId, id);
            });
            await removedInstructors.map(async (instructorId) => {
                await deleteUserFromClass(instructorId, id);
            });
            await classDocReference.update(classData);
            return res.status(200).json({
                message: "Successfully updated class",
            });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const classDocReference = db.collection("classes").doc(id);
    await classDocReference.get()
        .then((snapshot) => {
            if (!snapshot.exists) {
                const error = new Error("Class not found");
                error.status = 404;
                throw error;
            }
            return snapshot;
        })
        .then(async (snapshot) => {
            const classData = snapshot.data();
            const { studentsIdArr, instructorsIdArr, postsIdArr } = classData;
            return Promise.allSettled([
                studentsIdArr.map(async (studentId) => {
                    await deleteClassFromUser(id, studentId);
                }),
                instructorsIdArr.map(async (instructorId) => {
                    await deleteClassFromUser(id, instructorId);
                }),
                postsIdArr.map(async (postId) => {
                    const postData = await db.collection("posts").doc(postId).get();
                    const {authorId, commentsIdArr} = postData.data();
                    await deletePostFromUser(postId, authorId);
                    await deleteAllCommentsFromPost(commentsIdArr);
                }),
                classDocReference.delete()
            ])
        })
        .catch((err) => {
            if (err.status === 404) {
                return res.status(404).json({
                    message: err.message,
                });
            }
            else {
                return res.status(500).json({ error: err });
            }
        });
});

export default router;