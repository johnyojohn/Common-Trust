import {db} from "./firebaseInit.js";
import * as express from "express";
import {
  deletePostFromUser, deletePostFromClass,
  deleteAllCommentsFromPost,
} from "./deleteUtils.js";
import {
  getDoc, doc, updateDoc,
  deleteDoc, serverTimestamp,
} from "firebase/firestore";

const router = express.Router();

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const postDocReference = doc(db, "posts", id);
  getDoc(postDocReference)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          return res.status(404).json({
            message: "Post not found",
          });
        } else {
          return res.status(200).json({
            message: "Successfully retrieved post",
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

router.put("/:id", async (req, res) => {
  // cannot modify post's author or class
  const id = req.params.id;
  const title = "title" in req.body ? req.body.title : null;
  const content = "content" in req.body ? req.body.content : null;
  const postDate = serverTimestamp();
  const commentsIdArr = "commentsIdArr" in req.body ?
        req.body.commentsIdArr : null;
  const userId = "userId" in req.body ? req.body.userId : null;

  const postDocReference = doc(db, "posts", id);
  try {
    const postSnapshot = await getDoc(postDocReference);
    if (!postSnapshot) {
      return res.status(404).json({
        message: "Post not found",
      });
    } else {
      const post = postSnapshot.data();
      const varToString = (varObj) => Object.keys(varObj)[0];
      [[varToString({title}), title],
        [varToString({content}), content],
        [varToString({postDate}), postDate],
        [varToString({commentsIdArr}), commentsIdArr]]
          .forEach(([key, value]) => {
            if (value !== null) {
              post[key] = value;
            }
          });

      if (post.likedUsers !== null && userId !== null) {
        if (post.likedUsers.includes(userId)) {
          post.likedUsers = post.likedUsers
              .filter((user) => user !== userId);
          post.likedCount = post.likedUsers.length;
        } else {
          post.likedUsers.push(userId);
          post.likedCount = post.likedUsers.length;
        }
      }

      await updateDoc(postDocReference, post);
      return res.status(200).json({
        message: "Successfully updated post",
        data: {
          id: post.id,
          ...post,
        },
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({error: err});
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const postDocReference = doc(db, "posts", id);
  try {
    const postSnapshot = await getDoc(postDocReference);
    if (!postSnapshot) {
      return res.status(404).json({
        message: "Post not found",
      });
    } else {
      const post = postSnapshot.data();
      const updateUser = await deletePostFromUser(id, post.authorId);
      const updateClass = await deletePostFromClass(id, post.classId);
      const deleteComments =
                await deleteAllCommentsFromPost(
                    post.commentsIdArr);
      if (updateUser && updateClass && deleteComments) {
        await deleteDoc(postDocReference);
        return res.status(200).json({
          message: "Successfully deleted post",
        });
      } else {
        return res.status(404).json({
          message: "User or class not found",
        });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({error: err});
  }
});

export default router;
