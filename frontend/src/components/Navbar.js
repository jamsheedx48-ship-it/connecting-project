import React, { useEffect,useState } from 'react'
import "./css/Navbar.css"
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { Button } from 'react-bootstrap'
import Swal from 'sweetalert2';


const Navbar = () => {
  const userid=localStorage.getItem("userid")
  const [name,setName]=useState('')
 useEffect(()=>{
   fetch(`https://json-server-ecommerce-t2t5.onrender.com/users/${userid}`)
  .then((res)=>res.json())
  .then((data)=>setName(data.name))
 },[userid])
  const {cart}=useContext(CartContext)
  const handleCart=()=>{
     navigate("/cart")
  }
   const navigate=useNavigate()
   const handleLogin=()=>{
     navigate("/login")
   }
   const ToHome=()=>{
    navigate("/")
   }

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
    localStorage.removeItem("userid")
     navigate("/")
  }

})


     
   }
  return (
    <>
      <div className='navbar'>
        <div className='navlogo'>
       <img src='https://img.icons8.com/?size=100&id=16647&format=png&color=000000' alt='nike logo' onClick={ToHome}/>
       
        </div>

        <ul className='navitems'>
         <li> <Link to="/">Home</Link></li>
         <li> <Link to="/products">Products</Link></li>
         <li> <Link to="/orders">Orders</Link></li>
         <li><Link to="/about">About</Link></li> 
        </ul>

        <div className='login-cart'>
          {(userid) ?<Button variant='outline-secondary'>HI, {name}</Button> :<Button variant='outline-secondary'>Guest</Button>}
          {!(userid)&&<button className='btnlogin' onClick={handleLogin}>Login</button>}
          {localStorage.getItem("userid") && (
            <button className='btnlogin' onClick={handleLogout}>Logout</button>
              )}

          <img  className="cartimg" src="https://img.icons8.com/?size=100&id=85080&format=png&color=000000" alt='cart icon'
           onClick={handleCart}/>
           <p className='cart-count'>{cart.length}</p>

        </div>
      </div>
      
      
    </>
  )
}

export default Navbar