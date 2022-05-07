import {db} from "./firebase.js";
import { deleteDoc, doc, arrayRemove, increment, getDoc } from "firebase/firestore";

const deletePostFromUser = async (postId, userId) => {
    const userDocReference = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocReference);
    if (!userSnapshot.exists) {
        return false;
    }
    await updateDoc(userDocReference, {
        postsIdArr: arrayRemove(postId),
        postsCount: increment(-1),
    });

    return true;
}

const deletePostFromClass = async (postId, classId) => {
    const classDocReference = doc(db, "classes", classId);
    const classSnapshot = await getDoc(classDocReference);
    if (!classSnapshot.exists) {
        return false;
    }
    await updateDoc(classDocReference, {
        postsIdArr: arrayRemove(postId),
    });
    return true;
}

const deleteCommentFromUser = async (commentId, userId) => {
    const userDocReference = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocReference);
    if (!userSnapshot.exists) {
        return false;
    }
    await updateDoc(userDocReference, {
        commentsIdArr: arrayRemove(commentId),
    });
    return true;
}

const deleteCommentFromPost = async (commentId, postId) => {
    const postDocReference = doc(db, "posts", postId);
    const postSnapshot = await getDoc(postDocReference);
    if (!postSnapshot.exists) {
        return false;
    }
    await updateDoc(postDocReference, {
        commentsIdArr: arrayRemove(commentId),
    });
    return true;
}

const deleteAllCommentsFromPost = async (commentsIdArr) => {
    for (const commentId of commentsIdArr) {
        const commentDocReference = doc(db, "comments", commentId);
        const commentSnapshot = await getDoc(commentDocReference);
        if (!commentSnapshot.exists) {
            continue;
        }
        await deleteCommentFromUser(commentId, commentSnapshot.data().userId);
        await deleteDoc(commentDocReference);
    }
    return true;
}

const deleteUserFromClass = async (userId, classId) => {
    const userDocReference = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocReference);
    if (!userSnapshot.exists) {
        return false;
    }
    await updateDoc(userDocReference, {
        classesIdArr: arrayRemove(classId),
    });
    return true;
}

const deleteUserFromClasses = async (userId, classesIdArr) => {
    for (const classId of classesIdArr) {
        await deleteUserFromClass(userId, classId);
    }
    return true;
}

const deleteClassFromUser = async (classId, userId) => {
    const userDocReference = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocReference);
    if (!userSnapshot.exists) {
        return false;
    }
    await updateDoc(userDocReference, {
        classesIdArr: arrayRemove(classId),
    });
    return true;
}

export { deletePostFromUser, deletePostFromClass, deleteCommentFromUser, deleteCommentFromPost, deleteAllCommentsFromPost, deleteUserFromClasses, deleteUserFromClass, deleteClassFromUser };
