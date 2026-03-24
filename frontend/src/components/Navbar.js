import "./css/Navbar.css"
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { Button } from 'react-bootstrap'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
//  useEffect(()=>{
//    const token= localStorage.getItem("token")
//    if (token){
//     API.get("/accounts/user/")
//     .then((res)=>{
//       setName(res.data.username)
//       setUserid(res.data.id)
//     })
//     .catch((err)=>{
//       console.log(err);
      
//     })
//    }
//  },[])

  const {cart,setCart}=useContext(CartContext)
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
    logout()
    setCart([])
    toast.success("Logout successful")
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
          {user ?(
            <>
            <Button variant='outline-secondary'>HI, {user}</Button>
            <button className='btnlogin' onClick={handleLogout}>Logout</button>
            </>
          ):(
            <>
            <Button variant='outline-secondary'>Guest</Button>
            <button className='btnlogin' onClick={handleLogin}>Login</button>
            </>
          )
          }

          <img  className="cartimg" src="https://img.icons8.com/?size=100&id=85080&format=png&color=000000" alt='cart icon'
           onClick={handleCart}/>
           <p className='cart-count'>{cart.length}</p>

        </div>
      </div>
      
      
    </>
  )
}

export default Navbar