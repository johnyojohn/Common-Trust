const deletePostFromUser = async (postId, userId) => {
    const userDocReference = db.collection("users").doc(userId);
    const userSnapshot = await userDocReference.get();
    if (!userSnapshot.exists) {
        return false;
    }
    await userDocReference.update({
        postsIdArr: admin.firestore.FieldValue.arrayRemove(postId),
        postsCount: admin.firestore.FieldValue.increment(-1),
    });
    return true;
}

const deletePostFromClass = async (postId, classId) => {
    const classDocReference = db.collection("classes").doc(classId);
    const classSnapshot = await classDocReference.get();
    if (!classSnapshot.exists) {
        return false;
    }
    await classDocReference.update({
        postsIdArr: admin.firestore.FieldValue.arrayRemove(postId),
    });
    return true;
}

const deleteCommentFromUser = async (commentId, userId) => {
    const userDocReference = db.collection("users").doc(userId);
    const userSnapshot = await userDocReference.get();
    if (!userSnapshot.exists) {
        return false;
    }
    await userDocReference.update({
        commentsIdArr: admin.firestore.FieldValue.arrayRemove(commentId),
    });
    return true;
}

const deleteCommentFromPost = async (commentId, postId) => {
    const postDocReference = db.collection("posts").doc(postId);
    const postSnapshot = await postDocReference.get();
    if (!postSnapshot.exists) {
        return false;
    }
    await postDocReference.update({
        commentsIdArr: admin.firestore.FieldValue.arrayRemove(commentId),
    })
    return true;
}

const deleteAllCommentsFromPost = async (commentsIdArr) => {
    for (const commentId of commentsIdArr) {
        const commentDocReference = db.collection("comments").doc(commentId);
        const commentSnapshot = await commentDocReference.get();
        if (!commentSnapshot.exists) {
            continue;
        }
        await deleteCommentFromUser(commentId, commentSnapshot.data().userId);
        await commentDocReference.delete();
    }
    return true;
}

const deleteUserFromClass = async (userId, classId) => {
    const userDocReference = db.collection("users").doc(userId);
    const userSnapshot = await userDocReference.get();
    if (!userSnapshot.exists) {
        return false;
    }
    await userDocReference.update({
        classes: admin.firestore.FieldValue.arrayRemove(classId),
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
    const userDocReference = db.collection("users").doc(userId);
    const userSnapshot = await userDocReference.get();
    if (!userSnapshot.exists) {
        return false;
    }
    await userDocReference.update({
        classes: admin.firestore.FieldValue.arrayRemove(classId),
    });
    return true;
}

export { deletePostFromUser, deletePostFromClass, deleteCommentFromUser, deleteCommentFromPost, deleteAllCommentsFromPost, deleteUserFromClasses, deleteUserFromClass, deleteClassFromUser };
