import express from "express";
import * as functions from "firebase-functions";
// import compression from "compression";
import bodyParser from "body-parser";
import cors from "cors";
import postsService from "./postsService.js";
import postService from "./postService.js";
import usersService from "./usersService.js";
import userService from "./userService.js";
import commentsService from "./commentsService.js";
import commentService from "./commentService.js";
import classesService from "./classesService.js";
import classService from "./classService.js";

const app = express();
app.use(
    cors({
      origin: true,
      credentials: true,
    })
);
// app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/posts", postsService);
app.use("/post", postService);
app.use("/users", usersService);
app.use("/user", userService);
app.use("/comments", commentsService);
app.use("/comment", commentService);
app.use("/classes", classesService);
app.use("/class", classService);

export default functions.https.onRequest(app);
