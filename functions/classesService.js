import { db } from "./firebase.js";
import * as express from "express";
import {addClassToUser} from "./putUtils.js";
import {getDocs, collection, doc, setDoc} from "firebase/firestore";

const router = express.Router();

router.get("/", async (req, res) => {
    getDocs(collection(db, "classes"))
        .then((snapshot) => {
            const classes = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
            return res.status(200).json({
                message: "Successfully retrieved classes",
                data: classes,
            });
        })
        .catch((err) => {
            return res.status(500).json({ error: err });
        });
});

const classPostReqCheck = (req) => {
    return ("departmentAbbr" in req.body &&
    "courseNumber" in req.body &&
    "courseFullTitle" in req.body &&
    "instructorsIdArr" in req.body);
}

router.post("/", async (req, res) => {
    if (!classPostReqCheck(req)) {
        return res.status(400).json({
            message: "Missing required parameters",
        });
    } else {
        const classPost = {
            departmentAbbr: req.body.departmentAbbr,
            courseNumber: req.body.courseNumber,
            courseFullTitle: req.body.courseFullTitle,
            instructorsIdArr: req.body.instructorsIdArr,
            postsIdArr: [],
            studentsIdArr: [],
        };
        try {
            const classRef = doc(collection(db, "classes"));
            const classId = classRef.id;
            await setDoc(classRef, classPost);
            for (instructorId of classPost.instructorsIdArr) {
                await addClassToUser(classId, instructorId);
            }
            return res.status(201).json({
                message: "Class created",
                data: {
                    id: classId,
                    ...classPost,
                },
            });
        } catch (err) {
            return res.status(500).json({ error: err });
        }
    }
});

export default router;