import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form'

const PostComment = () => {
    return (
        <>
            <Card className="mt-3">
                <Card.Header>Leave comment</Card.Header>
                <Card.Body>
                    <FloatingLabel controlId="floatingTextarea" label="Leave a comment here">
                        <Form.Control
                            as="textarea"
                            placeholder="Leave a comment here"
                            style={{ height: '100px' }}
                        />
                    </FloatingLabel>
                    <Button variant="primary" className="mt-3">Submit</Button>
                </Card.Body>
            </Card>
        </>
    );
}

export default PostComment;