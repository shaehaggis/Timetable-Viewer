import React, {useState, useEffect, useRef} from 'react'
import { Navigate } from 'react-router-dom';
import { Buffer } from "buffer";
import NavbarStudent from '../Navbar/NavbarStudent'
import { Button, Form } from 'react-bootstrap'
import "./styles.css";
import EnrolCalendar from './EnrolCalendar';
import axios from 'axios';

function getToken() {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    console.log(userToken);
    return userToken;
  }


const StudentEnrol = () => {

    const [otherClasses, setOtherClasses] = useState([]);
    const classesRef = useRef(null);

    const token = getToken();

    const base64Url = token.split('.')[1];
    const buff = Buffer.from(base64Url, 'base64');
    const payloadinit = buff.toString('ascii');
    const payload = JSON.parse(payloadinit);
    const id=payload.id;
    const role = payload.role;

    useEffect(()=>{
        const fetchClasses = async () => {
            await axios
                            .get(`/classes`, { params: { id: id } })
                            .then((res) => {
                                console.log(res)
                                setOtherClasses(res.data);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
        }

        fetchClasses();
    }, [])

    const onSelectChange = (e) => {
        const index = e.target.selectedOptions[0].getAttribute('data-id');
        if (index === null){
            classesRef.current.addTempClass(null);
        }
        else {
            classesRef.current.addTempClass(otherClasses[index]);
        }
    }
    
    const options = otherClasses.map((element, index) => {
            if (element.class_name != null){
            return (<option data-id={index} key={index}>
                {element.class_code} {element.class_name} {element.class_type} {element.start_date} {element.start_time} {element.end_time}
                </option>)
            }
        })

    if(!token)
    {
        console.log(getToken());
        return <Navigate to='/'/>;
    }

    return (
        <div>
            <NavbarStudent />
            <div className='enrol-form-container'>
                <Form className='enrol-form'>
                    <Form.Group className="mb-3 mt-5" controlId="searchID">
                        <Form.Label>Enrol in a Class</Form.Label>
                        <Form.Select onChange={(e) => onSelectChange(e)}>
                            <option>Please Select a Class</option>
                            {options}
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="submit">Confirm</Button>
                </Form>
            </div>
            <EnrolCalendar id={id} ref={classesRef}/>
        </div>
    )
}

export default StudentEnrol