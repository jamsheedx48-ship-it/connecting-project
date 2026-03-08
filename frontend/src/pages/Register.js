import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./css/Reg.css"
import { toast } from 'react-toastify'
import API from '../api/axios'
const Register = () => {
    const navigate=useNavigate()
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    const handleValidation= async(e)=>{
       e.preventDefault()
     if(!username.trim()){
        alert("Enter a valid name")
        return;
     }

     if(!email.includes("@")){
        alert("Enter valid email")
        return;
     }
     if(password.length<8){
        alert("Password must be at least 8 characters")
        return;
     }

        const user={username,email,password}
       
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
            <input
            type='password'
            placeholder='Password'
            value={password}
            required
            onChange={(e)=>setPassword(e.target.value)}
            />
            <br/><br/>

            <button type='submit'>Continue</button>
            <p> <small>Already have an account?</small> <Link to="/login"><span>Login</span></Link></p>


        </form>
        </div>
    </>
  )
}

export default Register