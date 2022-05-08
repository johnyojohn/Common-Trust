import { Button, Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form'
import {useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import {auth} from '../firebase'
import axios from 'axios'

const CreatePost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    const onTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const onContentChange = (e) => {
        setContent(e.target.value);
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        if(title !== '' && content !== ''){
            try {
                console.log(title, content, id, auth.currentUser.uid);
                const postResponse = await axios.post(`https://us-central1-common-trust.cloudfunctions.net/default/posts`,{title: title, content: content, classId: id, authorId:auth.currentUser.uid });
                navigate('/class/' + id);
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <>
            <Row sm={2} className="justify-content-md-center">
                <Col>
                    <h1 className="mb-3 mt-4">Create post</h1>
                    <Card className="mt-3">
                        <Card.Body>
                            <FloatingLabel  controlId="floatingTextarea" label="Write title here" className="mb-3">
                                <Form.Control onChange={onTitleChange} value={title} as="textarea" placeholder="Write title here" />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingTextarea2" label="Write post here">
                                <Form.Control
                                    onChange={onContentChange} 
                                    value={content}
                                    as="textarea"
                                    placeholder="Write post here"
                                    style={{ height: '200px' }}
                                />
                            </FloatingLabel>
                            <Button onClick={onSubmit} variant="primary" className="mt-3">Submit</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default CreatePost;