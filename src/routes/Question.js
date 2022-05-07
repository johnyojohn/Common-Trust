import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ThreadOverview from "../components/ThreadList";
import { Col, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

const Question = ({ data }) => {
    const { id } = useParams();
    // useEffect(() => {
    //     fetch(('BACKEND_URL' + id.toString()))
    //     .then(response => response.json())
    // }, []);

    return (
        <>
            <Row className="pt-3">
                <Col style={{ paddingLeft: 25 }}>
                    <h3>Class feed</h3>
                    <div className="text-muted">
                        Class name
                    </div>
                </Col>
            </Row>
            <Row>
                <Col sm={4}>
                    <ThreadOverview />
                </Col>
                <Col sm={7}>
                    <Card style={{ height: '18rem' }}>
                        <Card.Header as="h5">
                            Question {id}
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>
                                Question {id} Title
                            </Card.Title>
                            <Card.Text>
                                Question {id} Body
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className="mt-3 pb-0">
                        <Card.Body>
                            <blockquote className="blockquote mb-0">
                                <p>
                                    Sample comment
                                </p>
                                <footer className="blockquote-footer">
                                    Commenter name
                                </footer>
                            </blockquote>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Question;