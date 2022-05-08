import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import CloseButton from 'react-bootstrap/CloseButton';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, } from "firebase/auth";
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';

const User = ({user: curUser}) => {

    const [userInfo, setUserInfo] = useState(null);
    const [allClasses, setAllClasses] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [myClassesNameList, setMyClassesNameList] = useState([]);
    const [classAdditionCandidate, setClassAdditionCandidate] = useState('');

    const navigate = useNavigate();

    const getClassesInfo = async () => {
        try{
            const response = await axios.get(`http://localhost:5001/common-trust/us-central1/default/classes`);
            console.log(response.data.data, "allclasses")
            setAllClasses(response.data.data);
        } catch(err){
            console.log(err);
        }
    }

    const getUserInfo = async (userId) => {
        try{
            const response = await axios.get(`http://localhost:5001/common-trust/us-central1/default/user/${userId}`);
            setUserInfo(response.data.data);
        } catch(err){
            console.log(err);
        }
    }

    const getMyClasses = async(userId) => {
        try{
            setMyClassesNameList([]);
            const userResponse = await axios.get(`http://localhost:5001/common-trust/us-central1/default/user/${userId}`);
            userResponse.data.data.classes.map(async (classId) => {
                try{
                    const nameResponse = await axios.get(`http://localhost:5001/common-trust/us-central1/default/class/${classId}`);
                    setMyClassesNameList((prevName)=> [...prevName, {id: classId, name : nameResponse.data.data.courseFullTitle}]);
                } catch(err){
                    console.log(err);
                }
            })  
        } catch(err){console.log(err);}    
    }

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        try{
            const putObject = {classes: myClassesNameList.map(({id, name})=>{return id})}
            if(firstName !== '') putObject['firstName'] = firstName;
            if(lastName !== '') putObject['lastName'] = lastName;
            const response = await axios.put(`http://localhost:5001/common-trust/us-central1/default/user/${userInfo.id}`, putObject);
            if(password !== '' &&password === confirmPassword){
                const credential = EmailAuthProvider.credential(
                    curUser.user.email, currentPassword
                )
                const result= await reauthenticateWithCredential(auth.currentUser, credential);
                console.log(result)
            }
            await updatePassword(auth.currentUser, password );
            window.location.reload(false);
        } catch(error){
            console.log(error);
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/wrong-password') {
                  alert('Current Password is incorrect');
                }
              }
        }
    }

    const handleInputChange = (event) => {
        if(event.target.id === 'formBasicFirstName'){
            setFirstName(event.target.value);
        }
        else if(event.target.id === 'formBasicLastName'){
            setLastName(event.target.value);
        }
        else if(event.target.id === 'formBasicCurrentPassword'){
            setCurrentPassword(event.target.value);
        }
        else if(event.target.id === 'formBasicPassword'){
            setPassword(event.target.value);
        }
        else if(event.target.id === 'formBasicPasswordConfirm'){
            setConfirmPassword(event.target.value);
        }
    }

    const handleClassAdd = (event) => {   
        event.preventDefault();
        if(classAdditionCandidate !== 'wrong' ){
            if(!myClassesNameList.some(elem=> elem.id === classAdditionCandidate.split(',')[0])){
                setMyClassesNameList((prevName)=> [...prevName, {id: classAdditionCandidate.split(',')[0], name : classAdditionCandidate.split(',')[1]}]);
            }
        }
        
    }

    const handleClassDelete = (event) => {   
        event.preventDefault();
        if(event.target.value !== 'wrong'){
            setMyClassesNameList([...myClassesNameList.filter(e => e.id !== event.target.value)]);
        }
        console.log(event)
    }


    useEffect(() => {
        getClassesInfo().catch(err => console.log(err));
        getMyClasses(curUser.user.uid).catch(err => console.log(err));
        if(curUser.user !== null){
            getUserInfo(curUser.user.uid).catch(err => console.log(err));
        }
    }, [])

    useEffect(() => {
            if(curUser.user !== null){
                getUserInfo(curUser.user.uid).catch(err => console.log(err));
            }
        }, [curUser.user])

    return (
        <>
            <Row>

            </Row>
            <Row className="mt-3">
                <Col sm={4} className="text-center mt-5">
                    <h1>{userInfo ? userInfo.firstName + ' ' + userInfo.lastName: ''}</h1>
                </Col>
                <Col sm={4}>
                    <h3>Edit information</h3>
                    <FloatingLabel controlId="formBasicFirstName" label="First name" className="mb-3">
                        <Form.Control value ={firstName} onChange={handleInputChange} type="text" placeholder="User" />
                    </FloatingLabel>
                    <FloatingLabel controlId="formBasicLastName" label="Last name" className="mb-3">
                        <Form.Control value={lastName} onChange={handleInputChange} type="text" placeholder="Name" />
                    </FloatingLabel>
                    <FloatingLabel controlId="formBasicCurrentPassword" label="Current Password" className="mb-3">
                        <Form.Control value={currentPassword} onChange={handleInputChange} type="password" placeholder="Password" />
                    </FloatingLabel>
                    <FloatingLabel controlId="formBasicPassword" label="Password" className="mb-3">
                        <Form.Control value={password} onChange={handleInputChange} type="password" placeholder="Password" />
                    </FloatingLabel>
                    <FloatingLabel controlId="formBasicPasswordConfirm" label="Confirm password" className="mb-3">
                        <Form.Control value={confirmPassword} onChange={handleInputChange} type="password" placeholder="Password" />
                    </FloatingLabel>

                    <InputGroup className="mb-3">
                        <Form.Select value ={classAdditionCandidate} onChange={(event)=>{console.log(event.target.value); setClassAdditionCandidate(event.target.value)}} aria-label="Add classes">
                            <option value={'wrong'}>Entire Class List</option>
                            {allClasses.map(classInfo => {
                                return <option key={classInfo.id} value={[classInfo.id, classInfo.courseFullTitle]}>{classInfo.courseFullTitle}</option>
                            })}
                        </Form.Select>
                        <Button onClick={handleClassAdd} variant="outline-secondary" id="button-addon2">
                            Add
                        </Button>
                    </InputGroup>
                    <div className="mb-3">
                            {myClassesNameList.map(classInfo => {
                                return (<Button key = {classInfo.id} onClick={handleClassDelete} variant="info" size="sm" value={classInfo.id}>{classInfo.name + "   x"}{' '}</Button>);
                            })}
                    </div>

                    <Button variant="secondary">Cancel</Button>{' '}
                    <Button variant="primary" type="submit" onClick={handleInfoSubmit}>Save</Button>
                </Col>
            </Row>
        </>
    );
}

export default User;