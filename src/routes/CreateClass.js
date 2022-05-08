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

const CreateClass = () => {
    const [department, setDepartment] = useState('');
    const [courseNumber, setCourseNumber] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [instructors, setInstructors] = useState(['']);
    const [entireInstructors, setEntireInstructors] = useState([]);
    const [instructorCandidate, setInstructorCandidate] = useState('');

    const navigate = useNavigate();

    // get instructors
    const getInstructors = async () => {
        try {
            const response = await axios.get(`https://us-central1-common-trust.cloudfunctions.net/default/users?isInstructor=true`);
            console.log(response.data.data)
            setEntireInstructors(response.data.data);
            const userInfo = response.data.data.find(e=>{return e.id === auth.currentUser.uid})
            setInstructors([{id: auth.currentUser.uid, name: userInfo.firstName + " " + userInfo.lastName}]);
        } catch (err) {
            console.log(err);
        }
    }

    const handleInstructorCandidate = (e) => {
        setInstructorCandidate(e.target.value);
    }

    const handleInstructorAddition = (event) => {
        event.preventDefault();
        if (instructorCandidate !== 'wrong') {
            if (!instructors.some(elem => elem.id === instructorCandidate.split(',')[0])) {
                setInstructors((prevInstructor) => [...prevInstructor, { id: instructorCandidate.split(',')[0], name: instructorCandidate.split(',')[1] }]);
            }
        }
    }

    const handleInstructorDeletion = (event) => {
        event.preventDefault();
        if (event.target.value !== 'wrong') {
            setInstructors([...instructors.filter(e => e.id !== event.target.value)]);
        }
        console.log(event)
    }

    const onTextChange = (e) => {
        if (e.target.id === 'formBasicDepartmentAbbr') {
            setDepartment(e.target.value);
        } else if (e.target.id === 'formBasicCourseNumber') {
            setCourseNumber(e.target.value);
        } else if (e.target.id === 'formBasicCourseFullTitle') {
            setCourseTitle(e.target.value);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if(department !== '' && courseNumber !== '' && courseTitle !== '') {
            try{
                const filteredInstructors = instructors.map((elem)=> {return elem.id});
                const nameResponse = await axios.post(`https://us-central1-common-trust.cloudfunctions.net/default/classes`,
                {departmentAbbr:department, courseNumber: courseNumber, courseFullTitle: courseTitle, instructorsIdArr: filteredInstructors});
                console.log(nameResponse.data.data, "nameResponse")
                navigate(/class/ + nameResponse.data.data.id);
            } catch(err){
                console.log(err);
            }
        }
    }

    useEffect(() => {   
        getInstructors().catch(err => console.log(err));
        
    }, [])

    return (
        <>
            <Row sm={4} className="justify-content-md-center mt-4">
                <Col sm={4}>
                    <h1 className="mb-3">Create class</h1>
                    <FloatingLabel controlId="formBasicDepartmentAbbr" label="Department abbreviation" className="mb-3">
                        <Form.Control onChange={onTextChange} value={department} type="text" placeholder="Abbr" />
                    </FloatingLabel>
                    <FloatingLabel controlId="formBasicCourseNumber" label="Course number" className="mb-3">
                        <Form.Control onChange={onTextChange} value={courseNumber} type="number" placeholder="Number" />
                    </FloatingLabel>
                    <FloatingLabel controlId="formBasicCourseFullTitle" label="Course full title" className="mb-3">
                        <Form.Control onChange={onTextChange} value={courseTitle} type="text" placeholder="Title" />
                    </FloatingLabel>

                    <InputGroup className="mb-3">
                        <Form.Select value={instructorCandidate} onChange={handleInstructorCandidate} aria-label="Add instructors for the class">
                            <option value={'wrong'}>Select instructors for this class</option>
                            {entireInstructors.map(instructor => {
                                return <option key={instructor.id} value={[instructor.id, instructor.firstName+ ' ' + instructor.lastName]}>{instructor.firstName} {instructor.lastName}</option>
                            })}
                        </Form.Select>
                        <Button onClick={handleInstructorAddition} variant="outline-secondary" id="button-addon2">
                            Add
                        </Button>
                    </InputGroup>
                    <div className="mb-3">
                        {instructors.map(instructor => {
                            return (<Button key={instructor.id} variant="info" >
                            {instructor.name}{' '}
                            <CloseButton key={instructor.id} value={instructor.id} onClick={handleInstructorDeletion}>
                            </CloseButton>
                        </Button>)
                        })}
                    </div>

                    <Button variant="secondary">Cancel</Button>{' '}
                    <Button onClick={onSubmit} variant="primary" type="submit">Save</Button>
                </Col>
            </Row>
        </>
    );
}

export default CreateClass;