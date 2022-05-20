import { Navigate } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { sendEmailVerification } from 'firebase/auth';

const ProtectedRoute=({children:children, user:user})=>{
    const handleVerify = async(event) => {
        event.preventDefault();
        try{
            const verificationResponse = await sendEmailVerification(user.user);
            alert("Check your Email")
        } catch (error){
            console.log(error);
        }
    }

    return user.isChecking ? <div></div> :
        user.user !== null
            ? user.user.emailVerified?
            children
            :(
                <>
                <Row sm={4} className="justify-content-md-center">
                    <Col>
                        <br/>
                        <h2>Email Verification Required</h2>
                        <br/>
                        <Button onClick={handleVerify}>Verify</Button>
                    </Col>
                </Row>
            </>
            )
            : <Navigate to="/" replace={true} />
}

export default ProtectedRoute;