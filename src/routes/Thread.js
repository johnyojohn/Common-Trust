import { useEffect, useState } from 'react'
import React from 'react'
import ThreadOverview from "../components/ThreadOverview";
import { Row, Col, Button, ToggleButton, Stack } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import PostComment from '../components/PostComment';
import { auth } from '../firebase';

const Thread = () => {
    const { classId } = useParams();
    const { postId } = useParams();
    const [classInfo, setClassInfo] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedPostsContent, setSelectedPostsContent] = useState({});
    const [selectedPostsComments, setSelectedPostsComments] = useState([]);

    const getClassInfo = async () => {
        try {
            const response = await axios.get(`https://us-central1-common-trust.cloudfunctions.net/default/class/${classId}`);
            setClassInfo(response.data.data);
            setPosts(response.data.data.postsIdArr)
        } catch (err) {
            console.log(err);
        }
    }

    const getPostInfo = async (postId) => {
        try {
            const response = await axios.get(`https://us-central1-common-trust.cloudfunctions.net/default/post/${postId}`);
            const authorName = await axios.get(`https://us-central1-common-trust.cloudfunctions.net/default/user/${response.data.data.authorId}`).then(snapshot => snapshot.data.data.firstName + " " + snapshot.data.data.lastName);
            response.data.data.postDate = new Date(response.data.data.postDate.seconds * 1000).toLocaleString();
            const date = new Date(response.data.data.postDate);
            setSelectedPostsContent({ ...response.data.data, authorName: authorName });
            return response.data.data.commentsIdArr;
        } catch (err) {
            console.log(err);
        }
    }

    const handleCommentLike = async (event, tempcomment) => {
        try {
            // console.log(event.currentTarget);
            // event.currentTarget.checked = !event.currentTarget.checked;
            // console.log(event.currentTarget.checked);
            const response = await axios.put(`https://us-central1-common-trust.cloudfunctions.net/default/comment/${tempcomment.id}`, { userId: auth.currentUser.uid });
            setSelectedPostsComments([...selectedPostsComments].map(comment => {
                return comment.id === tempcomment.id ?
                    { ...comment, likedCount: response.data.data.likedCount } :
                    comment;
            }))
        } catch (err) {
            console.log(err);
        }
    }

    const handlePostLike = async () => {
        try {
            const response = await axios.put(`https://us-central1-common-trust.cloudfunctions.net/default/post/${postId}`, { userId: auth.currentUser.uid });
            setSelectedPostsContent({ ...selectedPostsContent, likedCount: response.data.data.likedCount });
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        getClassInfo();
    }, [])

    useEffect(() => {
        if (postId !== null && postId !== undefined) {
            getPostInfo(postId).then(
                (commentIdArr) => {
                    setSelectedPostsComments([]);
                    commentIdArr.map(async (commentId) => {
                        try {
                            const commentResponse = await axios.get(`https://us-central1-common-trust.cloudfunctions.net/default/comment/${commentId}`);
                            const authorResponse = await axios.get(`https://us-central1-common-trust.cloudfunctions.net/default/user/${commentResponse.data.data.authorId}`);
                            commentResponse.data.data.authorId = authorResponse.data.data.firstName + ' ' + authorResponse.data.data.lastName;
                            commentResponse.data.data.dateCreated = new Date(commentResponse.data.data.dateCreated.seconds * 1000).toLocaleString();
                            setSelectedPostsComments((prevComments) => [...prevComments, commentResponse.data.data]);
                        } catch (err) {
                            console.log(err);
                        }
                    })
                }
            );
        }
    }, [postId])

    useEffect(() => {
    }, [selectedPostsComments])
    return (
        <>
            <Row className="pt-3">
                <Col style={{ paddingLeft: 25 }}>
                    <h3>Class feed</h3>
                    <div className="text-muted mb-3">
                        {classInfo.courseFullTitle}
                    </div>
                    <Button variant="outline-primary" className="mb-3" href={`/class/${classId}/post`}>
                        Create post
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col sm={4}>
                    <ThreadOverview postList={posts} classId={classId} />
                </Col>
                {postId !== null && postId !== undefined && (
                    <Col sm={7}>
                        <Card style={{ height: '18rem' }}>
                            <Card.Header as="h5">
                                {selectedPostsContent.title}
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {selectedPostsContent.content}
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer className="align-items-center">
                                <Row className="align-items-center">
                                    <Col sm={5} style={{ display: 'flex' }}>
                                        <p>
                                            {selectedPostsContent.authorName}
                                        </p>
                                    </Col>
                                    <Col sm={7}>
                                        <Stack style={{ float: 'right' }} direction="horizontal" gap={3}>
                                            <p>
                                                {'Posted on ' + selectedPostsContent.postDate}
                                            </p>
                                            <Button
                                                onClick={handlePostLike}
                                                variant={selectedPostsContent.likedUsers?.includes(auth.currentUser.uid) ? "primary" : "secondary"}
                                                style={{ float: 'right' }}>
                                                <FontAwesomeIcon icon={faThumbsUp} />{' '}
                                                {selectedPostsContent.likedCount}
                                            </Button>
                                        </Stack>
                                    </Col>
                                </Row>
                            </Card.Footer>
                        </Card>
                        {
                            selectedPostsComments.map((comment) => {
                                return comment === undefined ?
                                    (<></>) :
                                    (
                                        <Card key={comment.id} className="mt-3 pb-0">
                                            <Card.Body>
                                                <blockquote className="blockquote mb-0">
                                                    <p>
                                                        {comment.content}
                                                    </p>
                                                </blockquote>
                                            </Card.Body>
                                            <Card.Footer className="align-items-center">
                                                <Row className="align-items-center">
                                                    <Col sm={5}>
                                                        <p>
                                                            {comment.authorId}
                                                        </p>
                                                    </Col>
                                                    <Col sm={7}>
                                                        <Stack style={{ float: 'right' }} direction="horizontal" gap={3}>
                                                            <p>
                                                                {'Posted on ' + comment.dateCreated}
                                                            </p>
                                                            <Button
                                                                onClick={(e) => { handleCommentLike(e, comment) }}
                                                                variant={comment?.likedUsers?.includes(auth.currentUser.uid) ? "primary" : "secondary"}
                                                                style={{ float: 'right' }}>
                                                                <FontAwesomeIcon icon={faThumbsUp} />{' '}
                                                                {comment.likedCount}
                                                            </Button>
                                                        </Stack>
                                                    </Col>
                                                </Row>
                                            </Card.Footer>
                                        </Card>)
                            })
                        }
                        <PostComment postId={postId} />
                    </Col>)}
            </Row>
        </>
    );
}

export default Thread;