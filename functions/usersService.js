import { db } from "./firebase.js";
import * as express from "express";
import { addUserToClasses } from "./putUtils.js";
import { getDocs, collection } from "firebase/firestore";

const router = express.Router();

router.get("/", async (req, res) => {
  getDocs(collection(db, "users"))
    .then((snapshot) => {
      const users = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      return res.status(200).json({
        message: "Successfully retrieved users",
        data: users,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Failed to retrieve users",
        error: err
      });
    });
});

const userPostReqChek = (req) => {
  return ("email" in req.body &&
    "firstName" in req.body &&
    "lastName" in req.body);
};

router.post("/", async (req, res) => {
  if (!userPostReqChek(req)) {
    return res.status(400).json({
      message: "Missing required parameters",
    });
  } else {
    const userPost = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      classes: "classes" in req.body ? req.body.classes : [],
      postsIdArr: [],
      postsCount: 0,
      commentsIdArr: [],
      isInstructor: req.body.email.includes("_"),
    };
    try {
      const userId = db.collection("users").doc().id;
      await addUserToClasses(userId, userPost.classes);
      await db.collection("users").doc(userId).set(userPost);
      return res.status(201).json({
        message: "User created",
        data: {
          id: userId,
          ...userPost,
        },
      });
    } catch (err) {
      return res.status(500).json({
        message: "Failed to create user",
        error: err,
      });
    }
  }
});

export default router;
