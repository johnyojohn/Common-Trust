import ThreadOverview from "../components/ThreadList";
import { Row, Col } from 'react-bootstrap';

const Thread = () => {
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
            </Row>
        </>
    );
}

export default Thread;