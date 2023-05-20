import { Accordion, Col, Container, Row } from "react-bootstrap";


function Faqs() {
    return (
        <>
            <section className="faq-section">
                <div className="bg-circles"><img src={require('../Assets/img/circles.png')} alt="" /></div>
                <Container>
                    <Row>
                        <Col lg={12}>
                            <Accordion defaultActiveKey={0}>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Can i unstake my tokens before the lock period ends?</Accordion.Header>
                                    <Accordion.Body>
                                        No, you can't unstake your tokens. You can unstake/retrieve yours tokens once the lock period ends.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header> Can i harvest staking rewards anytime i want? </Accordion.Header>
                                    <Accordion.Body>
                                    Yes, you can harvest your rewards anytime. Go to bottom of the page, find your staking history and you will see a button saying "harvest". Click that and you will receive your rewards to your wallet.        
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}

export default Faqs