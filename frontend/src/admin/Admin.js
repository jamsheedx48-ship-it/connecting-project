import React from 'react'
import "./css/Admin.css"
import { useNavigate, NavLink } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useContext } from "react";
import { AdminAuthContext } from "../context/AdminAuthContext";

const Admin = () => {
      const { logout } = useContext(AdminAuthContext);


  const navigate = useNavigate()

  const handleLogout = () => {

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel"
    }).then((res) => {
      if (res.isConfirmed) {
        logout()

        Swal.fire({
          title: "Logged out!",
          text: "You have been successfully logged out",
          icon: "success",
        })
      }
    })
  }

  return (
    <div className='sidebar'>
      <h4 className='text-center mb-3'>Admin Panel</h4>

      <div className='text-center'>
        <NavLink to="/adminpanel">
          <Button className='m-2'>Dashboard</Button>
        </NavLink><br />

        <NavLink to="products">
          <Button className='m-2'>Manage Products</Button>
        </NavLink><br />

        <NavLink to="users">
          <Button className='m-2'>Manage Users</Button>
        </NavLink><br />

        <NavLink to="orders">
          <Button className='m-2'>Orders</Button>
        </NavLink><br />

        <Button variant='danger' className='m-2' onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Admin