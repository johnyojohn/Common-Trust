import { Tab, Row, Col } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';

const ThreadOverview = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <Tab.Container id="left-tabs-example">
                        <Row>
                            <ListGroup>
                                <ListGroup.Item action href="/questions/1">
                                    Question 1
                                </ListGroup.Item>
                                <ListGroup.Item action href="/questions/2">
                                    Question 2
                                </ListGroup.Item>
                                <ListGroup.Item action href="/questions/3">
                                    Question 3
                                </ListGroup.Item>
                            </ListGroup>
                            {/* <Col sm={9}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">
                                        <h3>Class 1</h3>
                                        <p>
                                            Class 1 is a class that is about the basics of programming.
                                        </p>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                        <h3>Class 2</h3>
                                        <p>
                                            Class 2 is a class that is about the basics of programming.
                                        </p>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="third">
                                        <h3>Class 3</h3>
                                        <p>
                                            Class 3 is a class that is about the basics of programming.
                                        </p>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col> */}
                        </Row>
                    </Tab.Container>
                </div>
            </div>
        </div>
    )
}

export default ThreadOverview;