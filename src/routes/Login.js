import {useState} from 'react'
import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {signInWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../firebase'
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try{
            const response = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            navigate('/user');
        } catch (error){
            console.log(error);
        }
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }
    return (
        <>
            <Row sm={4} className="justify-content-md-center">
                <Col>
                    <h1>Login</h1>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control onChange ={handleEmailChange} value= {email} type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control onChange={handlePasswordChange} value ={password} type="password" placeholder="Password" />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Text className="text-muted">
                                Do not have an account? <a href="/register">Click here</a>
                                <br></br>
                                Forgot password? <a href="/reset">Click here</a>
                            </Form.Text>
                        </Form.Group>

                        <Button onClick={handleLogin} variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>

            </Row>
        </>
    );
}

export default Login;