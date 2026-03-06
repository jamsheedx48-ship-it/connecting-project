import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import {  useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import "./css/Payment.css"
import { toast } from 'react-toastify'
import Swal from 'sweetalert2';

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
       fetch(`https://json-server-ecommerce-t2t5.onrender.com/orders/${orderid}`)
    .then((res=>res.json()))
    .then((data)=>{
       setOrder(data)
    })
    .catch((err)=>console.log("error")
    )
    },[orderid])
    
    if(!order)
      return;
    const handleChange=(e)=>{
      setAddress({...address,[e.target.name]:e.target.value})
    }

    const handlePayment=()=>{
      
      if(!paymentMethod){
         toast.warn("Please select a payment method")
         return;
      }
      if(!address.name||!address.address||!address.state||!address.city){
        toast.warn("Please fill all delivery address fields")
        return;
      }
        
      fetch(`https://json-server-ecommerce-t2t5.onrender.com/orders/${orderid}`,{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({status:"paid"})
      })
      .then(()=>(
         navigate(`/success/${orderid}`)
      ))
      navigate(`/success/${orderid}`)
      
       Swal.fire({
            title: "Success!",
            text: "Order placed",
            icon: "success",
            confirmButtonText: "OK"
          });
      
    
    }
  return (
    <div>
        <h2 className='my-5 text-center'>Payment Details</h2>
        <Row>
            <Col md={6} className='text-center mb-3 border border-dark-1'>
            <h4>Order Summary</h4>
           
              {order.items.map((curr)=>
                <div key={curr.id}>
                  <p>Product Name : {curr.name}</p>
                  <p>Qty : {curr.qty}</p>
                </div>
              )}
              <h4>Total : {order.total}/-</h4>
            </Col>

            <Col md={6} className='text-center mb-3 border border-dark-1'>
            <h4>Payment Method</h4>
           <div className='my-5'>
            <input type='radio' name="one" onChange={(e)=>setPaymentMethod(e.target.value)}/> <label>Cash on delivery</label> <br/> 
            <input type='radio' name='one' onChange={(e)=>setPaymentMethod(e.target.value)}/>  <label>Gpay</label>  <br/> 
            <input type='radio' name='one' onChange={(e)=>setPaymentMethod(e.target.value)}/>  <label>Phonpe</label>  <br/> 
            <input type='radio' name='one' onChange={(e)=>setPaymentMethod(e.target.value)}/>  <label>Paytm</label>  <br/>
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
          onChange={handleChange}
          
          />
          <br/><br/>
          <input
          type='text'
          name='address'
          placeholder='Address'
          required
          onChange={handleChange}
          
          />
          <br/><br/>
          <input
          type='text'
          name='state'
          placeholder='State'
          required
          onChange={handleChange}
          
          />
          <br/><br/>
          <input
          type='text'
          name='city'
          placeholder='City'
          required
          onChange={handleChange}
          
          />
          <br/><br/>
         
         </form>
         </div>
            </Col>
             <div className='text-center'>
              <Button variant='success' className='text-cneter' onClick={handlePayment}>Pay {order.total}/-</Button>
             </div>
        </Row>
    </div>
  )
}

export default Payment