import { Nav, NavDropdown, Container } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar'

const MainHeader = () => {
    return (
        <>
            <Navbar bg="dark" variant="dark" sticky="top" expand="lg">
                <Container>
                <Navbar.Brand href="/">
                    Common Trust
                </Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <NavDropdown title="Classes">
                                <NavDropdown.Item>Class 1</NavDropdown.Item>
                                <NavDropdown.Item>Class 2</NavDropdown.Item>
                                <NavDropdown.Item>Class 3</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav>
                            <Nav.Link href="/user">User Details</Nav.Link>
                            <Nav.Link href="/login">Log Out</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default MainHeader;