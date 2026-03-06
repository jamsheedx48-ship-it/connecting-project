import React from 'react'
import { Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const PaymentSuccesful = () => {
    const navigate=useNavigate()
    const{orderid}=useParams()
  return (
    <div className='text-center my-4 pt-4'>
        <h2 className=''>Payment Successful</h2>
        <p>Your order #{orderid} successfully placed</p>
        <p><b>ORDER ID</b>: {orderid}</p>
        <h4 className='mt-5'>Keep shopping with us</h4> <br/><br/>

        <Button variant='dark' onClick={()=>navigate("/orders")}>View your orders</Button>
    </div>

  )
}

export default PaymentSuccesful