import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import "./css/Reg.css"
import API from '../api/axios';

const Login = () => {
  const navigate=useNavigate()
  const[email,setEmail]=useState("")
  const[password,setPassword]=useState("")

  const LoginValidation= async (e)=>{
   e.preventDefault()

   if(!email.includes("@")){ 
   toast.error("Invalid email")
    return;
   }
   if(password.length<8){
    toast.error("Password must be at least 8 characters")
   return;
   }
   
   try{
    const res= await API.post(
      "/accounts/login/",
      {
        email:email,
        password:password
      }
    )
    toast.success("Login successful")
    localStorage.setItem("token",res.data.access)
    navigate("/")
    window.location.reload()


   }catch(error){
    console.log(error.response)
    toast.error("Invalid email or password")
   }
   
  }


  
  
  return (
    <>
      <div className='auth-container'>
         <form onSubmit={LoginValidation}>
          <h2>Login</h2>

          <input
          type='email'
          placeholder='Email Address'
          value={email}
          required
          onChange={(e)=>setEmail(e.target.value)}
          />
          <br/><br/>
          <input
          type='password'
          placeholder='Password'
          value={password}
          required
          onChange={(e)=>setPassword(e.target.value)}
          />
          <br/><br/>
          <button type='submit'>Login</button>
           <p> <small>Don't have an account?</small> <Link to="/register"><span>Register</span></Link></p>
         </form>
      </div>
    </>
  )
}

export default Login