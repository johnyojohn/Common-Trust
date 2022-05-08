import {useEffect, useState} from 'react'
import ThreadOverview from "../components/ThreadList";
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';

const Thread = () => {
    const { id } = useParams();
    console.log(useParams());
    const [classInfo, setClassInfo] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState('');
    const [selectedPostsContent, setSelectedPostsContent] = useState({});
    const [selectedPostsComments, setSelectedPostsComments] = useState([]);
    const getClassInfo = async () => {
        try{
            const response = await axios.get(`http://localhost:5001/common-trust/us-central1/default/class/${id}`);
            setClassInfo(response.data.data);
            setPosts(response.data.data.postsIdArr)
        } catch(err){
            console.log(err);
        }
    }

    const getPostInfo = async (postId) => {
        try{
            const response = await axios.get(`http://localhost:5001/common-trust/us-central1/default/post/${postId}`);
            setSelectedPostsContent(response.data.data);
            return response.data.data.commentsIdArr;
        } catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getClassInfo();
    }, [])

    useEffect(()=>{
        if(selectedPosts!== ''){
            getPostInfo(selectedPosts).then(
                (commentIdArr)=>{
                    setSelectedPostsComments([]);
                    commentIdArr.map(async (commentId) => {
                        try{
                            const commentResponse = await axios.get(`http://localhost:5001/common-trust/us-central1/default/comment/${commentId}`);
                            const authorResponse = await axios.get(`http://localhost:5001/common-trust/us-central1/default/user/${commentResponse.data.data.authorId}`);
                            commentResponse.data.data.authorId = authorResponse.data.data.firstName + ' ' + authorResponse.data.data.lastName;
                            console.log(commentResponse.data.data, "comment");
                            console.log(authorResponse.data.data, "author")
                            setSelectedPostsComments((prevComments)=> [...prevComments, commentResponse.data.data]);
                        } catch(err){
                            console.log(err);
                        }
                    })
                }
            );
        }
    }, [selectedPosts])

    useEffect(()=>{
        console.log(selectedPostsComments, "entire comments");
    }, [selectedPostsComments])
    return (
        <>
            <Row className="pt-3">
                <Col style={{ paddingLeft: 25 }}>
                    <h3>Class feed</h3>
                    <div className="text-muted">
                        {classInfo.courseFullTitle}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col sm={4}>
                    <ThreadOverview postList = {posts} setSelectedPosts= {setSelectedPosts}/>
                </Col>
                {selectedPosts !== '' && (
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
                    </Card>
                    {
                        selectedPostsComments.map((comment) => {
                        return(
                        <Card key={comment.id} className="mt-3 pb-0">
                            <Card.Body>
                                <blockquote className="blockquote mb-0">
                                    <p>
                                        {comment.content}
                                    </p>
                                    <footer className="blockquote-footer">
                                        {comment.authorId}
                                    </footer>
                                </blockquote>
                            </Card.Body>
                        </Card>)
                            
                        })
                    }
                    {/* <Card className="mt-3 pb-0">
                        <Card.Body>
                            <blockquote className="blockquote mb-0">
                                <p>
                                    Sample comment
                                </p>
                                <footer className="blockquote-footer">
                                    Commenter name
                                </footer>
                            </blockquote>
                        </Card.Body>
                    </Card> */}
                </Col>)}
                
            </Row>
        </>
    );
}

export default Thread;