import React from 'react'
import { Row,Col, Button } from 'react-bootstrap'
import "./css/Admin.css"
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';

const Admin= () => {
    

  const navigate=useNavigate()

    const handleLogout=()=>{
      Swal.fire({
       title: "Are you sure?",
       text: "Do you want to logout?",
       icon: "warning",
       showCancelButton: true,
       confirmButtonText: "Logout",
       cancelButtonText: "Cancel"
     }).then((res)=>{
       if(res.isConfirmed){
         localStorage.removeItem("adminLogin")
          navigate("/admin")
       }
     
     })
     
    }
  return (
    <div >
        <Row>
         <Col md={2} className='sidebar'>
           <h4 className='text-center mb-2'>Admin Panel</h4>
           <div className='text-center'>
            <NavLink to="/adminpanel"> <Button variant="dark" className='m-2'>Dashboard</Button></NavLink><br/> 
            <NavLink to="products"> <Button variant="dark" className='m-2'>Manage Products</Button></NavLink><br/> 
            <NavLink to="users"><Button variant="dark" className='m-2' >Manage Users</Button></NavLink><br/>
            <NavLink to="orders"><Button variant="dark" className='m-2'>Orders</Button> </NavLink><br/>
            <Button variant='danger'className='m-2' onClick={handleLogout}>Logout</Button> <br/>
           </div>
         </Col>

  
        </Row>

    </div>
  )
}

export default Admin