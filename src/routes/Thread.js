import { useEffect, useState } from 'react'
import React from 'react'
import ThreadOverview from "../components/ThreadList";
import { Row, Col, Button, Stack } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import PostComment from '../components/PostComment';
import {auth} from '../firebase';

const Thread = () => {
    const { id } = useParams();
    const queryParams = useQuery().get('q');
    const [classInfo, setClassInfo] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedPostsContent, setSelectedPostsContent] = useState({});
    const [selectedPostsComments, setSelectedPostsComments] = useState([]);

    function useQuery() {
        const { search } = useLocation();
      
        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    const getClassInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/common-trust/us-central1/default/class/${id}`);
            setClassInfo(response.data.data);
            setPosts(response.data.data.postsIdArr)
        } catch (err) {
            console.log(err);
        }
    }

    const getPostInfo = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:5001/common-trust/us-central1/default/post/${postId}`);
            const authorName = await axios.get(`http://localhost:5001/common-trust/us-central1/default/user/${response.data.data.authorId}`).then(snapshot => snapshot.data.data.firstName + " " + snapshot.data.data.lastName);
            response.data.data.postDate = new Date(response.data.data.postDate.seconds * 1000).toLocaleString();
            const date = new Date(response.data.data.postDate);
            setSelectedPostsContent({ ...response.data.data, authorName: authorName });
            return response.data.data.commentsIdArr;
        } catch (err) {
            console.log(err);
        }
    }

    const handleCommentLike = async (comment) => {
        try {
            const response = await axios.put(`http://localhost:5001/common-trust/us-central1/default/comment/${comment.id}`,{userId: auth.currentUser.uid});
        } catch (err) {
            console.log(err);
        }
    }

    const handlePostLike = async () => {
        try {
            const response = await axios.put(`http://localhost:5001/common-trust/us-central1/default/post/${queryParams}`,{userId: auth.currentUser.uid});
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        getClassInfo();
    }, [])

    useEffect(() => {
        if (queryParams !== null) {
            getPostInfo(queryParams).then(
                (commentIdArr) => {
                    setSelectedPostsComments([]);
                    commentIdArr.map(async (commentId) => {
                        try {
                            const commentResponse = await axios.get(`http://localhost:5001/common-trust/us-central1/default/comment/${commentId}`);
                            const authorResponse = await axios.get(`http://localhost:5001/common-trust/us-central1/default/user/${commentResponse.data.data.authorId}`);
                            commentResponse.data.data.authorId = authorResponse.data.data.firstName + ' ' + authorResponse.data.data.lastName;
                            commentResponse.data.data.dateCreated = new Date(commentResponse.data.data.dateCreated.seconds * 1000).toLocaleString();
                            console.log(commentResponse.data.data, "comment");
                            console.log(authorResponse.data.data, "author")
                            setSelectedPostsComments((prevComments) => [...prevComments, commentResponse.data.data]);
                        } catch (err) {
                            console.log(err);
                        }
                    })
                }
            );
        }
    }, [queryParams])

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
                    <Button variant="outline-primary" className="mb-3" href={"./" + id + "/post"}>
                        Create post
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col sm={4}>
                    <ThreadOverview postList={posts} />
                </Col>
                {queryParams !== null && (
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
                                            <Button onClick={handlePostLike} variant="secondary" style={{ float: 'right' }}>
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
                                return (
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
                                                        <Button onClick={()=>{handleCommentLike(comment)}} variant="secondary" style={{ float: 'right' }}>
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
                        <PostComment postId={queryParams} />
                    </Col>)}
            </Row>
        </>
    );
}

export default Thread;