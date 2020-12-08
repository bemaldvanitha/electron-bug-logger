import React,{useState} from 'react';
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Button from "react-bootstrap/Button";

const AddLog = (props) => {
    const [text,setText] = useState('');
    const [user,setUser] = useState('');
    const [priority,setPriority] = useState('');
    const submitHandler = (e) => {
        e.preventDefault();
        props.onAdd({text,user,priority});

        setText('');
        setUser('');
        setPriority('');
    };
    return(
        <Card>
            <Card.Body>
                <Form onSubmit={submitHandler}>
                    <Row className='my-3'>
                        <Col>
                            <Form.Control placeholder="Log" value={text}
                            onChange={(e) => setText(e.target.value)}/>
                        </Col>
                    </Row>

                    <Row className='my-3'>
                        <Col>
                            <Form.Control placeholder="user" value={user}
                                          onChange={(e) => setUser(e.target.value)}/>
                        </Col>
                        <Col>
                            <Form.Control as='select' value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value='0'>select priority</option>
                                <option value='low'>low</option>
                                <option value='moderate'>moderate</option>
                                <option value='high'>high</option>
                            </Form.Control>
                        </Col>
                    </Row>
                    <Row className='my-3'>
                        <Col>
                            <Button type='submit' variant='secondary' block onClick={props.onAlert}>Add Log</Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    )
};

export default AddLog