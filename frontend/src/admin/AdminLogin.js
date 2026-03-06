import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import "./css/AdminLogin.css"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const AdminLogin = () => {
   const navigate=useNavigate()
   const [email,setEmail]=useState("")
   const [password,setPassword]=useState("")

   const handleLogin=(e)=>{
    
    e.preventDefault()
      if(!email.includes("@")){
        toast.error("Invalid email")
        return;
      }
      if(password.length<8){
        toast.error("Password must be at least 8 characters")
        return;
      }
      
      fetch(`https://json-server-ecommerce-t2t5.onrender.com/admin?email=${email}&password=${password}`)
      .then((res)=>res.json())
      .then((data)=>{
         if(data.length>0){
          
          localStorage.setItem("adminLogin","true")
          toast.success("Login success")
          navigate("/adminpanel")
         }
         else{
          toast.error("Invalid email or password")
         }
      })
     
    .catch((err)=>{console.log("error");
    })
   }


  return (
    <div className='auth-container'>
      <div className='admin-login-box'>
           <h2>Admin Login</h2>

        <form>
            <input
            type='email'
            placeholder='Email'
            onChange={(e)=>setEmail(e.target.value)}
            /> <br/><br/>
            <input
            type='password'
            placeholder='Password'
            onChange={(e)=>setPassword(e.target.value)}
            /> <br/><br/>
            
            <Button variant='dark' className='admin-login-btn' onClick={handleLogin}>Login</Button>
        </form>
      </div>
       
    </div>
  )
}

export default AdminLogin