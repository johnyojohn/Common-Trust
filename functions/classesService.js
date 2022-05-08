import {db} from "./firebaseInit.js";
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
        console.error(err);
        return res.status(500).json({error: err});
      });
});

const classPostReqCheck = (req) => {
  return ("departmentAbbr" in req.body &&
        "courseNumber" in req.body &&
        "courseFullTitle" in req.body &&
        "instructorsIdArr" in req.body);
};

router.post("/", async (req, res) => {
  if (!classPostReqCheck(req)) {
    return res.status(400).json({
      message: "Missing required parameters",
    });
  } else {
    const classPost = {
      departmentAbbr: req.body.departmentAbbr,
      courseNumber: typeof (req.body.courseNumber) === "string" ?
                parseInt(req.body.courseNumber) : req.body.courseNumber,
      courseFullTitle: req.body.courseFullTitle,
      instructorsIdArr: req.body.instructorsIdArr,
      postsIdArr: [],
      studentsIdArr: [],
    };
    try {
      const classRef = doc(collection(db, "classes"));
      const classId = classRef.id;
      for (const instructorId of classPost.instructorsIdArr) {
        await addClassToUser(classId, instructorId);
      }
      await setDoc(classRef, classPost);
      return res.status(201).json({
        message: "Class created",
        data: {
          id: classId,
          ...classPost,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({error: err});
    }
  }
});

export default router;
