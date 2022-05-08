import { db } from "./firebase.js";
import * as express from "express";
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
      console.error(err);
      return res.status(500).json({
        message: "Failed to retrieve users",
        error: err
      });
    });
});

export default router;
