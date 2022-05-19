import {useState} from 'react'
import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {auth} from '../firebase'

const Reset = () => {

    const [email, setEmail] = useState('');

    const handleInputChange = (event) => {
        setEmail(event.target.value);
    }

    return (
        <>
            <Row sm={4} className="justify-content-md-center">
                <Col>
                    <h1>Enter email address</h1>
                    <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control onChange={handleInputChange} value={email} type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

export default Reset;