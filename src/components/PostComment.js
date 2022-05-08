import {useState} from 'react'
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form'
import { auth } from '../firebase';
import axios from 'axios'

const PostComment = ({postId:postId}) => {
    const [comment, setComment] = useState('');

    const onChangeText = (e) => {
        setComment(e.target.value);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(comment.length > 0){
            try {
                console.log(auth.currentUser.uid, postId, comment )
                const response = await axios.post(`https://us-central1-common-trust.cloudfunctions.net/default/comments`,{authorId:auth.currentUser.uid, postId: postId, content:comment });
                window.location.reload(false);
            } catch (err) {
                console.log(err);
            }
        }
    }
    return (
        <>
            <Card className="mt-3">
                <Card.Header>Leave comment</Card.Header>
                <Card.Body>
                    <FloatingLabel controlId="floatingTextarea" label="Leave a comment here">
                        <Form.Control
                            value = {comment}
                            onChange = {onChangeText}
                            as="textarea"
                            placeholder="Leave a comment here"
                            style={{ height: '100px' }}
                        />
                    </FloatingLabel>
                    <Button onClick={handleSubmit} variant="primary" className="mt-3">Submit</Button>
                </Card.Body>
            </Card>
        </>
    );
}

export default PostComment;