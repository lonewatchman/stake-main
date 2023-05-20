import { Container, Row, Col } from "react-bootstrap";

function Footer(){
    return(
        <>
            <footer>
                <Container>
                    <Row>
                        <Col sm={12} className="text-center">
                            <div className="inner">
                                <div className="copyright">Copyright © 2022. All rights reserved by Credit.</div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </>
    )
}
export default Footer