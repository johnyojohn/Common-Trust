

const addCommentToUser = async (commentId, userId) => {
    const userDocReference = db.collection("users").doc(userId);
    const userSnapshot = await userDocReference.get();
    if (!userSnapshot.exists) {
        return false;
    }
    const user = userSnapshot.data();
    const commentsIdArr = user.commentsIdArr;
    if (!commentsIdArr) {
        commentsIdArr = [];
    }
    commentsIdArr.push(commentId);
    await userDocReference.update({ commentsIdArr });
    return true;
}

const addCommentToPost = async (commentId, postId) => {
    const postDocReference = db.collection("posts").doc(postId);
    const postSnapshot = await postDocReference.get();
    if (!postSnapshot.exists) {
        return false;
    }
    const post = postSnapshot.data();
    const commentsIdArr = post.commentsIdArr;
    if (!commentsIdArr) {
        commentsIdArr = [];
    }
    commentsIdArr.push(commentId);
    await postDocReference.update({ commentsIdArr });
    return true;
}

const addPostToClass = async (postId, classId) => {
    const classDocReference = db.collection("classes").doc(classId);
    const classSnapshot = await classDocReference.get();
    if (!classSnapshot.exists) {
        return false;
    }
    const classData = classSnapshot.data();
    const postsIdArr = classData.postsIdArr;
    if (!postsIdArr) {
        postsIdArr = [];
    }
    postsIdArr.push(postId);
    await classDocReference.update({ postsIdArr });
    return true;
}

const addPostToUser = async (postId, userId) => {
    const userDocReference = db.collection("users").doc(userId);
    const userSnapshot = await userDocReference.get();
    if (!userSnapshot.exists) {
        return false;
    }
    const user = userSnapshot.data();
    const postsIdArr = user.postsIdArr;
    if (!postsIdArr) {
        postsIdArr = [];
    }
    postsIdArr.push(postId);
    await userDocReference.update({ postsIdArr });
    return true;
}

const addUserToClass = async (userId, classId) => {
    const classDocReference = db.collection("classes").doc(classId);
    const classSnapshot = await classDocReference.get();
    if (!classSnapshot.exists) {
        return false;
    }
    await classDocReference.update({
        usersIdArr: admin.firestore.FieldValue.arrayUnion(userId),
    })
    return true;
}


const addUserToClasses = async (userId, classesIdArr) => {
    for (const classId of classesIdArr) {
        await addUserToClass(userId, classId);
    }
    return true;
}

const addClassToUser = async (classId, userId) => {
    const userDocReference = db.collection("users").doc(userId);
    const userSnapshot = await userDocReference.get();
    if (!userSnapshot.exists) {
        return false;
    }
    await userSnapshot.update({
        classes: admin.firestore.FieldValue.arrayUnion(classId),
    })
    return true;
}

export { addCommentToUser, addCommentToPost, addPostToClass, addPostToUser, addUserToClasses, addClassToUser, addUserToClass };