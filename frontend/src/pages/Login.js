import React, {useState } from 'react'
import { useNavigate,Link, } from 'react-router-dom'
import { toast } from 'react-toastify';
import "./css/Reg.css"
import API from '../api/axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate=useNavigate()
  const[email,setEmail]=useState("")
  const[password,setPassword]=useState("")
  const[showPassword,setShowPassword]=useState(false)

  const LoginValidation= async (e)=>{
   e.preventDefault()

  const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailPattern.test(email)){
    toast.error("Invalid email address")
    return
  }
  
  if(!password.trim()){
    toast.error("Password is required")
    return
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
    localStorage.setItem("username",res.data.username)
    localStorage.setItem("refresh",res.data.refresh)
    navigate("/")
    window.location.reload()


   }catch(error){
    console.log(error.response)
    const err=error.response?.data

    if(err?.non_field_errors){
      toast.error(err.non_field_errors[0])
      return
    }
    else{
      toast.error("Login Failed")
    }
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
          <div className='password-field'>
          <input
          type={showPassword ? "text":"password"}
          placeholder='Password'
          value={password}
          required
          onChange={(e)=>setPassword(e.target.value)}
          />
          <span className='eye-icon' onClick={()=>setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash/> : <FaEye/>}
          </span>
          </div>

          <button type='submit'>Login</button>
           <p> <small>Don't have an account?</small> <Link to="/register"><span>Register</span></Link></p>
         </form>
      </div>
    </>
  )
}

export default Login