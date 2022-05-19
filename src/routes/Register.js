import {useState} from 'react'
import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import {auth} from '../firebase'
import axios from 'axios'

const Register = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async(event) => {
        event.preventDefault();
        try{
            const registerResponse = await createUserWithEmailAndPassword(
                auth,
                email,
                password);
            const verificationResponse = await sendEmailVerification(registerResponse.user);
            const registerDbResponse = await axios.post('https://us-central1-common-trust.cloudfunctions.net/default/user/'+registerResponse.user.uid,{
                email: email,
                firstName: firstName,
                lastName: lastName,
            })
        } catch (error){
            console.log(error);
        }
    }

    const handleInputChange = (event) => {
        if(event.target.id === 'formBasicFirstName'){
            setFirstName(event.target.value);
        }
        else if(event.target.id === 'formBasicLastName'){
            setLastName(event.target.value);
        }
        else if(event.target.id === 'formBasicEmail'){
            setEmail(event.target.value);
        }
        else if(event.target.id === 'formBasicPassword'){
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
                    <h1>Register</h1>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>First name</Form.Label>
                            <Form.Control onChange={handleInputChange} value={firstName} type="text" placeholder="Enter first name" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicLastName">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control onChange={handleInputChange} value={lastName} type="text" placeholder="Enter last name" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control onChange={handleInputChange} value={email} type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control onChange={handleInputChange} value={password} type="password" placeholder="Password" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control onChange={handleInputChange} value={confirmPassword} type="password" placeholder="Password" />
                        </Form.Group>

                        <Button onClick={handleRegister} variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>

            </Row>
        </>
    );
}

export default Register;