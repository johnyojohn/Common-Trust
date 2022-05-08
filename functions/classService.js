import { db } from "./firebase.js";
import * as express from "express";
import { addInstructorToClass, addClassToUser } from "./putUtils.js";
import { deleteUserFromClass, deleteClassFromUser, deleteAllCommentsFromPost, deletePostFromUser } from "./deleteUtils.js";
import { getDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

const router = express.Router();

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const classDocReference = doc(db, "classes", id);
    await getDoc(classDocReference)
        .then((snapshot) => {
            if (!snapshot.exists()) {
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
            console.error(err);
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

    const classDocReference = doc(db, "classes", id);
    try {
        const classDoc = await getDoc(classDocReference);
        if (!classDoc.exists()) {
            return res.status(404).json({
                message: "Class not found",
            });
        }
        else {
            const classData = classDoc.data();
            const varToString = varObj => Object.keys(varObj)[0];
            const originalInstructors = classData.instructorsIdArr;
            const newInstructors = instructorsIdArr ? instructorsIdArr : originalInstructors;
            [[varToString({ departmentAbbr }), departmentAbbr],
            [varToString({ courseNumber }), courseNumber],
            [varToString({ courseFullTitle }), courseFullTitle],
            [varToString({ instructorsIdArr }), instructorsIdArr]]
                .forEach(([key, value]) => {
                    if (value !== null) {
                        classData[key] = value;
                    }
                });
            if (instructorsIdArr !== null) {
                const addedInstructors = newInstructors.filter(id => !originalInstructors.includes(id));
                const removedInstructors = originalInstructors.filter(id => !newInstructors.includes(id));
                await addedInstructors.map(async (instructorId) => {
                    await addInstructorToClass(instructorId, id);
                    await addClassToUser(id, instructorId);
                });
                await removedInstructors.map(async (instructorId) => {
                    await deleteUserFromClass(instructorId, id);
                    await deleteClassFromUser(id, instructorId);
                });
            }
            await updateDoc(classDocReference, classData);
            return res.status(200).json({
                message: "Successfully updated class",
            });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const classDocReference = doc(db, "classes", id);
    await getDoc(classDocReference)
        .then((snapshot) => {
            if (!snapshot.exists()) {
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
                    const postData = await getDoc(doc(db, "posts", postId));
                    const { authorId, commentsIdArr } = postData.data();
                    await deletePostFromUser(postId, authorId);
                    await deleteAllCommentsFromPost(commentsIdArr);
                }),
                await deleteDoc(classDocReference),
            ])
        })
        .catch((err) => {
            if (err.status === 404) {
                return res.status(404).json({
                    message: err.message,
                    error: err,
                });
            }
            else {
                console.error(err);
                return res.status(500).json({ error: err });
            }
        });
});

export default router;