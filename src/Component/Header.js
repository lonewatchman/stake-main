import { LinkContainer } from 'react-router-bootstrap';
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import logo from '../Assets/img/logo.svg';
import Connect from './Connect';

const Header = () => {
    const [sticky, setSticky] = useState("");

    useEffect(() => {
        window.addEventListener("scroll", isSticky);
        return () => {
            window.removeEventListener("scroll", isSticky);
        };
    }, []);

    const isSticky = () => {
        const scrollTop = window.scrollY;
        const stickyClass = scrollTop >= 150 ? "is-sticky" : "";
        setSticky(stickyClass);
    }
    const classes = `header-section ${sticky}`;
    
    return (
        <>
            <Navbar className={`${classes} main-header`} expand="lg">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <img src={logo} alt="Credit Logo" />
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="align-items-lg-center ms-auto">
                            <LinkContainer to="/">
                                <Nav.Link>BSC Stake</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/credit-stake">
                                <Nav.Link>Credit Stake</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/validator">
                                <Nav.Link>Validator</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/faq">
                                <Nav.Link>Faq's</Nav.Link>
                            </LinkContainer>
                            <Connect/>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Header