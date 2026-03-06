import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./css/Reg.css"
import { toast } from 'react-toastify'

const Register = () => {
    const navigate=useNavigate()
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    function handleValidation(e){
       e.preventDefault()
     if(!name.trim()){
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

        const user={name,email,password,status:"active"}
       
        fetch("https://json-server-ecommerce-t2t5.onrender.com/users",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Accept" : "application/json",
          },
          body:JSON.stringify(user)

        })
        .then((res)=>res.json())
        .then(()=>{
          toast.success("registered succesfully")
          navigate("/login")
        })
        
    }
    
  return (
    <>
        <div className='auth-container'>
            <h2>Register</h2>
        <form>
            
            <input 
            type='text'
            placeholder='Your Name'
            required
            onChange={(e)=>setName(e.target.value)}
            />
            <br/><br/>
            <input
            type='email'
            placeholder='Email Address'
            required
            onChange={(e)=>setEmail(e.target.value)}
            />
            <br/><br/>
            <input
            type='password'
            placeholder='Password'
            required
            onChange={(e)=>setPassword(e.target.value)}
            />
            <br/><br/>

            <button onClick={handleValidation}>Continue</button>
            <p> <small>Already have an account?</small> <Link to="/login"><span>Login</span></Link></p>


        </form>
        </div>
    </>
  )
}

export default Register