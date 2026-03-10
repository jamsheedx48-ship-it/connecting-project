import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import {  useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import "./css/Payment.css"
import { toast } from 'react-toastify'
import Swal from 'sweetalert2';
import API from '../api/axios'

const Payment = () => {
  const navigate=useNavigate()
    const {orderid}=useParams()
    const [order,setOrder]=useState(null)
    const [paymentMethod, setPaymentMethod] = useState("");
    const [address, setAddress] = useState({
      "name":"",
      "address":"",
      "state":"",
      "city":"",
    })
     



    useEffect(()=>{
      const fetchOrder= async()=>{
        try{
          const res= await API.get(`/orders/${orderid}/`)
          setOrder(res.data)
        }
        catch(err){
          console.log(err);
          toast.error("Failed to load order")
          
        }
      }
      fetchOrder()
    },[orderid])
    
    if(!order)
      return <h3 className='text-center mt-5'>Loading...</h3>
    const handleChange=(e)=>{
      setAddress({...address,[e.target.name]:e.target.value})
    }

    const handlePayment= async ()=>{
      
      if(!paymentMethod){
         toast.warn("Please select a payment method")
         return;
      }
      if(!address.name||!address.address||!address.state||!address.city){
        toast.warn("Please fill all delivery address fields")
        return;
      }
      try{
        await API.patch(`/orders/${orderid}/`,{
          "status":"paid"
        })
        Swal.fire({
          title: "Success!",
          text: "Order placed",
          icon: "success",
         confirmButtonText: "OK"
       })
       .then((result)=>{
        if(result.isConfirmed){
          navigate(`/success/${orderid}`)
        }
       })
      }
      catch(err){
        console.log(err)
        toast.error("Payment failed")
        
      }
        
    
    }
  return (
    <div>
        <h2 className='my-5 text-center'>Payment Details</h2>
        <Row>
            <Col md={6} className='text-center mb-3 border border-dark-1'>
            <h4>Order Summary</h4>
           
              {order.items?.map((curr)=>
                <div key={curr.id}>
                  <p>Product Name : {curr.product_name}</p>
                  <p>Qty : {curr.quantity}</p>
                </div>
              )}
              <h4>Total : {order.total_price}/-</h4>
            </Col>

            <Col md={6} className='text-center mb-3 border border-dark-1'>
            <h4>Payment Method</h4>
           <div className='my-5'>
            <input type='radio' name="payment" onChange={(e)=>setPaymentMethod(e.target.value)} value="COD"/> <label>Cash on delivery</label> <br/> 
            <input type='radio' name='payment' onChange={(e)=>setPaymentMethod(e.target.value)} value="GPAY"/>  <label>Gpay</label>  <br/> 
            <input type='radio' name='payment' onChange={(e)=>setPaymentMethod(e.target.value)} value="PHONEPE"/>  <label>Phonpe</label>  <br/> 
            <input type='radio' name='payment' onChange={(e)=>setPaymentMethod(e.target.value)} value="PAYTM"/>  <label>Paytm</label>  <br/>
          </div> 

           
            
            </Col>
            <Col md={12}>
               <div className='auth-container'>
         <form>
          <h2>Delivery Address</h2>

          <input
          type='text'
          name='name'
          placeholder='Name'
          required
          value={address.name}
          onChange={handleChange}
          
          />
          <br/><br/>
          <input
          type='text'
          name='address'
          placeholder='Address'
          required
          value={address.address}
          onChange={handleChange}
          
          />
          <br/><br/>
          <input
          type='text'
          name='state'
          placeholder='State'
          required
          value={address.state}
          onChange={handleChange}
          
          />
          <br/><br/>
          <input
          type='text'
          name='city'
          placeholder='City'
          required
          value={address.city}
          onChange={handleChange}
          
          />
          <br/><br/>
         
         </form>
         </div>
            </Col>
             <div className='text-center'>
              <Button variant='success' className='text-center' onClick={handlePayment}>Pay {order.total_price}/-</Button>
             </div>
        </Row>
    </div>
  )
}

export default Payment