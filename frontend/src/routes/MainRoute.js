import React from 'react'
import Register from '../pages/Register'
import Login from '../pages/Login'
import {Routes,Route} from "react-router-dom"
import Home from '../pages/Home'
import Products from '../pages/Products'
import Details from '../pages/Details'
import Cart from '../pages/Cart'
import About from '../pages/About'
import Payment from '../pages/Payment'
import PaymentSuccesful from '../pages/PaymentSuccesful'
import Orders from '../pages/Orders'
import AdminDashboard from '../admin/AdminDashboard'
import AdminProducts from '../admin/AdminProducts'
import AdminUsers from '../admin/AdminUsers'
import AdminOrders from '../admin/AdminOrders'
import AdminLogin from '../admin/AdminLogin'
import AdminUsersDetails from '../admin/AdminUsersDetails'
import AdminAddproducts from '../admin/AdminAddproducts'
import EditProduct from '../admin/EditProduct'
import ProtectedAdminRoute from '../admin/ProtectedAdminRoute'
import AdminLayout from '../admin/AdminLayout'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthRoute from './AuthRoute'


const MainRoute = () => {
  return (
    <div>
       <Routes>
         <Route path='/' element={
          <>
          <Navbar/>
           <Home/>
          <Footer/>
          </>
         }/>
         <Route path='/login' element={
          <AuthRoute>
           <>
            <Navbar/>
            <Login/>
            <Footer/>
          </>
          </AuthRoute>
         }/>
         <Route path='/register' element={
          <AuthRoute>
           <>
            <Navbar/>
            <Register/>
            <Footer/>
          </>
          </AuthRoute>
         }/>
         <Route path='/products' element={
          <>
          <Navbar/>
          <Products/>
          <Footer/>
          </>
         }/>
         <Route path='/details/:id' element={
          <>
          <Navbar/>
          <Details/>
          <Footer/>
          </>
         }/>
        <Route path='/cart' element={
          <>
          <Navbar/>
          <Cart/>
          <Footer/>
          </>
        }/>
        <Route path='/about' element={
          <>
          <Navbar/>
          <About/>
          <Footer/>
          </>
        }/>
        <Route path='/success/:orderid' element={
          <>
          <Navbar/>
          <PaymentSuccesful/>
          <Footer/>
          </>
        }/>
        <Route path='/payment/:orderid' element={
          <>
          <Navbar/>
          <Payment/>
          <Footer/>
          </>
        }/>
        <Route path='/orders' element={
          <>
          <Navbar/>
          <Orders/>
          <Footer/>
          </>
        }/>
        <Route path='/admin' element={<AdminLogin/>}/>
        <Route path='/adminpanel' element={
          <ProtectedAdminRoute>
            <AdminLayout/>
          </ProtectedAdminRoute>
        }>
          <Route  index element={<AdminDashboard/>}/>
        <Route path='products' element={<AdminProducts/>}/>
        <Route path='orders' element={<AdminOrders/>}/>
        <Route path='users' element={<AdminUsers/>}/>
        <Route path='userdetails/:userid' element={<AdminUsersDetails/>}/>
        <Route path='addproduct' element={<AdminAddproducts/>}/>
        <Route path='editproduct/:id' element={<EditProduct/>}/>

        </Route>
        
       </Routes>
    </div>
  )
}

export default MainRoute