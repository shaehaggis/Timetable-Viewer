import React, { useState } from "react";
import NavbarAdmin from '../Navbar/NavbarAdmin';
import "./style.css";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import StudentTimetable from "./StudentTimetable";
import TeacherTimetable from "./TeacherTimetable";

const AdminHome = () => {

    const [searchID, setSearchID]= useState();
    const [role,setRole]= useState("");
    const [userID,setUserID]= useState("");

    const onInputChange =(e) => {
        console.log(e.target.value);
        setSearchID(e.target.value);
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        
        const fetchUser = async () => {
            await axios
            .get(`/timetable/${searchID}`)
            .then((response) => {
                const data=response.data;
                setRole(data[0].role);
                setUserID(data[0].user_id);
            })
            
            .catch((err) => console.log(err))
            }
        fetchUser();
        
    }

    const renderTimeTable = () => {
        
        if(role === "student"){
            return <StudentTimetable role={role} userID={userID}/>
        }
        
        else if(role === "teacher"){
            return <TeacherTimetable role={role} userID={userID}/>
        }
        
        else{
            return <></>
        }
    }
  return (
    <div>
        <NavbarAdmin/>
        <h1> Welcome!</h1><br/>
        <div className="search-flex">
            <div className="search-form">
                <Form onSubmit={onFormSubmit}>
                    <Form.Group className="mb-3" controlId="searchID">
                        <Form.Label>Search by Student/Teacher ID</Form.Label>
                        <Form.Control type="text" placeholder="a1234" onChange={onInputChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
                
            </div>
        </div>
        <br/>
        <hr/>
        {renderTimeTable()}
    </div>
  )
}

export default AdminHome;
