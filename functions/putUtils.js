import { db } from "./firebase.js";
import {getDoc, doc, updateDoc, arrayUnion, increment} from "firebase/firestore";

const addCommentToUser = async (commentId, userId) => {
    const userDocReference = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocReference);
    if (!userSnapshot.exists) {
        return false;
    }
    await updateDoc(userDocReference, {
        commentsIdArr: arrayUnion(commentId),
    });
    return true;
}

const addCommentToPost = async (commentId, postId) => {
    const postDocReference = doc(db, "posts", postId);
    const postSnapshot = await getDoc(postDocReference);
    if (!postSnapshot.exists) {
        return false;
    }
    await updateDoc(postDocReference, {
        commentsIdArr: arrayUnion(commentId),
    })
    return true;
}

const addPostToClass = async (postId, classId) => {
    const classDocReference = doc(db, "classes", classId);
    const classSnapshot = await getDoc(classDocReference);
    if (!classSnapshot.exists) {
        return false;
    }
    await updateDoc(classDocReference, {
        postsIdArr: arrayUnion(postId)
    });
    return true;
}

const addPostToUser = async (postId, userId) => {
    const userDocReference = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocReference);
    if (!userSnapshot.exists) {
        return false;
    }
    await updateDoc(userDocReference, {
        postsIdArr: arrayUnion(postId),
        postsCount: increment(1),
    });
    return true;
}

const addUserToClass = async (userId, classId) => {
    const classDocReference = doc(db, "classes", classId);
    const classSnapshot = await getDoc(classDocReference);
    if (!classSnapshot.exists) {
        return false;
    }
    await updateDoc(classDocReference, {
        studentsIdArr: arrayUnion(userId),
    });
    return true;
}

const addInstructorToClass = async (instructorId, classId) => {
    const classDocReference = doc(db, "classes", classId);
    const classSnapshot = await getDoc(classDocReference);
    if (!classSnapshot.exists) {
        return false;
    }
    await updateDoc(classDocReference, {
        instructorsIdArr: arrayUnion(instructorId),
    });
    return true;
}

const addUserToClasses = async (userId, classesIdArr) => {
    for (const classId of classesIdArr) {
        await addUserToClass(userId, classId);
    }
    return true;
}

const addInstructorToClasses = async (instructorId, classesIdArr) => {
    for (const classId of classesIdArr) {
        await addInstructorToClass(instructorId, classId);
    }
    return true;
}

const addClassToUser = async (classId, userId) => {
    const userDocReference = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocReference);
    if (!userSnapshot.exists) {
        return false;
    }
    await updateDoc(userDocReference, {
        classes: arrayUnion(classId),
    });
    return true;
}

export { addCommentToUser, addCommentToPost, addPostToClass, addPostToUser, addUserToClasses, 
    addInstructorToClass, addInstructorToClasses, addClassToUser, addUserToClass };