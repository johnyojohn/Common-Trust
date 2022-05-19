import {useState} from 'react'
import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {auth} from '../firebase'

const Reset = () => {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleInputChange = (event) => {
        if(event.target.id === 'formBasicPassword'){
            setPassword(event.target.value);
        }
        else if(event.target.id === 'formBasicPasswordConfirm'){
            setConfirmPassword(event.target.value);
        }
    }

    return (
        <>
            <Row sm={4} className="justify-content-md-center">
                <Col>
                    <h1>Reset Password</h1>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control onChange={handleInputChange} value={password} type="password" placeholder="Password" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control onChange={handleInputChange} value={confirmPassword} type="password" placeholder="Password" />
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