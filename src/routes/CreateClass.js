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

    return (
        <>
            <Row sm={4} className="justify-content-md-center mt-4">
                <Col sm={4}>
                    <h1 className="mb-3">Create class</h1>
                    <FloatingLabel controlId="formBasicDepartmentAbbr" label="Department abbreviation" className="mb-3">
                        <Form.Control type="text" placeholder="Abbr" />
                    </FloatingLabel>
                    <FloatingLabel controlId="formBasicCourseNumber" label="Course number" className="mb-3">
                        <Form.Control type="number" placeholder="Number" />
                    </FloatingLabel>
                    <FloatingLabel controlId="formBasicCourseFullTitle" label="Course full title" className="mb-3">
                        <Form.Control type="text" placeholder="Title" />
                    </FloatingLabel>

                    <InputGroup className="mb-3">
                        <Form.Select aria-label="Add instructors for the class">
                            <option>Select instructors for this class</option>
                            <option value="1">Instructor 1</option>
                            <option value="2">Instructor 2</option>
                            <option value="3">Instructor 3</option>
                        </Form.Select>
                        <Button variant="outline-secondary" id="button-addon2">
                            Add
                        </Button>
                    </InputGroup>
                    <div className="mb-3">
                        <Button variant="info" >
                            Instructor 1{' '}
                            <CloseButton>
                            </CloseButton>
                        </Button>{' '}
                        <Button variant="info" >
                            Instructor 2{' '}
                            <CloseButton>
                            </CloseButton>
                        </Button>
                    </div>

                    <Button variant="secondary">Cancel</Button>{' '}
                    <Button variant="primary" type="submit">Save</Button>
                </Col>
            </Row>
        </>
    );
}

export default CreateClass;