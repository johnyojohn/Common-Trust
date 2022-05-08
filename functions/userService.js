import {db} from "./firebaseInit.js";
import * as express from "express";
import {addInstructorToClasses, addUserToClasses} from "./putUtils.js";
import {
  deleteUserFromClasses, deletePostFromClass,
  deleteAllCommentsFromPost,
} from "./deleteUtils.js";
import {getDoc, doc, updateDoc, deleteDoc, setDoc} from "firebase/firestore";

const router = express.Router();

router.get("/:id", (req, res) => {
  const id = req.params.id;
  getDoc(doc(db, "users", id))
      .then((snapshot) => {
        if (!snapshot.exists()) {
          return res.status(404).json({
            message: "User not found",
          });
        } else {
          return res.status(200).json({
            message: "Successfully retrieved user",
            data: {
              id: snapshot.id,
              ...snapshot.data(),
            },
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({error: err});
      });
});

const userPostReqChek = (req) => {
  return ("email" in req.body &&
    "firstName" in req.body &&
    "lastName" in req.body);
};

router.post("/:id", async (req, res) => {
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
      const userId = req.params.id;
      if (userPost.isInstructor) {
        await addInstructorToClasses(userId, userPost.classes);
      } else {
        await addUserToClasses(userId, userPost.classes);
      }
      const userDocReference = doc(db, "users", userId);
      await setDoc(userDocReference, userPost);
      return res.status(201).json({
        message: "User created",
        data: {
          id: userId,
          ...userPost,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Failed to create user",
        error: err,
      });
    }
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const email = "email" in req.body ? req.body.email : null;
  const firstName = "firstName" in req.body ? req.body.firstName : null;
  const lastName = "lastName" in req.body ? req.body.lastName : null;
  const classes = "classes" in req.body ? req.body.classes : null;
  const postsIdArr = "postsIdArr" in req.body ? req.body.postsIdArr : null;
  const postsCount = "postsCount" in req.body ? req.body.postsCount : null;
  const commentsIdArr = "commentsIdArr" in req.body ?
    req.body.commentsIdArr : null;

  const userDocReference = doc(db, "users", id);
  try {
    const userDoc = await getDoc(userDocReference);
    if (!userDoc.exists()) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      const userData = userDoc.data();
      const originalClasses = userData.classes;
      const newClasses = classes ? classes : originalClasses;
      const varToString = (varObj) => Object.keys(varObj)[0];
      [[varToString({email}), email],
        [varToString({firstName}), firstName],
        [varToString({lastName}), lastName],
        [varToString({classes}), classes],
        [varToString({postsIdArr}), postsIdArr],
        [varToString({postsCount}), postsCount],
        [varToString({commentsIdArr}), commentsIdArr]]
          .forEach(([key, value]) => {
            if (value !== null) {
              userData[key] = value;
            }
          });
      const addedClasses = newClasses
          .filter((className) => !originalClasses.includes(className));
      const removedClasses = originalClasses
          .filter((className) => !newClasses.includes(className));
      await deleteUserFromClasses(id, removedClasses);
      await addUserToClasses(id, addedClasses);
      await updateDoc(userDocReference, userData);
      return res.status(200).json({
        message: "Successfully updated user",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({error: err});
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const userDocReference = doc(db, "users", id);
  try {
    const userDoc = await getDoc(userDocReference);
    if (!userDoc.exists()) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      const userData = userDoc.data();
      const classes = userData.classes;
      await deleteUserFromClasses(id, classes);
      for (const postId of userData.postsIdArr) {
        const classId = await getDoc(doc(db, "posts", postId))
            .then((snapshot) => snapshot.data().classId);
        await deletePostFromClass(postId, classId);
        await deleteAllCommentsFromPost(postId);
      }
      await deleteDoc(userDocReference);
      return res.status(200).json({
        message: "Successfully deleted user",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({error: err});
  }
});

export default router;
