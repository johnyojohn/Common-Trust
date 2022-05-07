import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import CloseButton from 'react-bootstrap/CloseButton';



const User = () => {
    return (
        <>
            <Row>

            </Row>
            <Row className="mt-3">
                <Col sm={4} className="text-center mt-5">
                    <h1>User name</h1>
                </Col>
                <Col sm={4}>
                    <h3>Edit information</h3>
                    <FloatingLabel controlId="floatingInput" label="First name" className="mb-3">
                        <Form.Control type="text" placeholder="User" />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingInput" label="Last name" className="mb-3">
                        <Form.Control type="text" placeholder="Name" />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                        <Form.Control type="password" placeholder="Password" />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingPassword" label="Confirm password" className="mb-3">
                        <Form.Control type="password" placeholder="Password" />
                    </FloatingLabel>

                    <InputGroup className="mb-3">
                        <Form.Select aria-label="Add classes">
                            <option>Add classes</option>
                            <option value="1">Class 1</option>
                            <option value="2">Class 2</option>
                            <option value="3">Class 3</option>
                        </Form.Select>
                        <Button variant="outline-secondary" id="button-addon2">
                            Add
                        </Button>
                    </InputGroup>

                    <div className="mb-3">
                        <Button variant="info" size="sm">Class 1</Button>{' '}
                        <Button variant="info" size="sm">Class 2</Button>{' '}
                    </div>

                    <Button variant="secondary">Cancel</Button>{' '}
                    <Button variant="primary" type="submit">Save</Button>
                </Col>
            </Row>
        </>
    );
}

export default User;