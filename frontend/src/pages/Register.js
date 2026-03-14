import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import "./css/Reg.css"
import { toast } from 'react-toastify'
import {FaEye,FaEyeSlash} from "react-icons/fa";
import API from '../api/axios'
const Register = () => {
    const navigate=useNavigate()
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [showPassword,setShowPassword]=useState(false)
    const [showConfirmPassword,setShowConfirmPassword]=useState(false)

    const handleValidation= async(e)=>{
       e.preventDefault()
     if(!username.trim()){
        toast.error("Enter a valid name")
        return;
     }
     if(username.trim().length<3){
        toast.error("Username must be at least 3 characters")
        return;
     }
     const usernamePattern = /^[A-Za-z0-9_]+$/;
     if (!usernamePattern.test(username)){
      toast.error("Username can only contain letters, numbers and underscore")
      return
     }
     
     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailPattern.test(email)){
      toast.error("Invalid email address")
      return
     }
     
     const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
     if(!passwordPattern.test(password)){
      toast.error("Password must contain uppercase, lowercase, number and be at least 8 characters")
      return
     }
     if(password!==confirmPassword){
      toast.error("Passwords do not match")
      return
     }  

    const user={
      username:username,
      email:email,
      password:password,
      confirm_password:confirmPassword
    }
       
    try{
          const res= await API.post(
            "/accounts/register/",
            user
          )

          toast.success("Registered successfully")
          navigate("/login")

        }catch(error){
          console.log(error.response?.data)

          const err=error.response?.data
          if(err?.email){
            toast.error(err.email[0])
          }
          else if(err?.username){
            toast.error(err.username[0])
          }
          else if(err?.confirm_password){
            toast.error(err.confirm_password[0])
          }
          else{
            toast.error("Registration failed")
          }
        }
      
      
        
        
       

    }
    
  return (
    <>
        <div className='auth-container'>
            <h2>Register</h2>
        <form onSubmit={handleValidation}>
            
            <input 
            type='text'
            placeholder='Your Name'
            value={username}
            required
            onChange={(e)=>setUsername(e.target.value)}
            />
            <br/><br/>
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
            type={showPassword ? "text" : "password"}
            placeholder='Password'
            value={password}
            required
            onChange={(e)=>setPassword(e.target.value)}
            />
            <span className='eye-icon' onClick={()=>setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </span>
          </div>

          <div className='password-field'>
            <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder='Confirm Password'
            value={confirmPassword}
            required
            onChange={(e)=>setConfirmPassword(e.target.value)}
            />
            <span className='eye-icon' onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
            </span>
           </div>  

            <br/><br/>

            <button type='submit' >Continue</button>
            <p> <small>Already have an account?</small> <Link to="/login"><span>Login</span></Link></p>


        </form>
        </div>
    </>
  )
}
export default Register