import { Button, Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form'

const CreatePost = () => {
    return (
        <>
            <Row sm={2} className="justify-content-md-center">
                <Col>
                    <h1 className="mb-3 mt-4">Create post</h1>
                    <Card className="mt-3">
                        <Card.Body>
                            <FloatingLabel controlId="floatingTextarea" label="Write title here" className="mb-3">
                                <Form.Control as="textarea" placeholder="Write title here" />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingTextarea2" label="Write post here">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Write post here"
                                    style={{ height: '200px' }}
                                />
                            </FloatingLabel>
                            <Button variant="primary" className="mt-3">Submit</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default CreatePost;