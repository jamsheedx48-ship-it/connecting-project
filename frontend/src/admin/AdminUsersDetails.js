import React, { useEffect, useState } from 'react'
import {  useParams } from 'react-router-dom'
import { Card,Row,Col } from 'react-bootstrap'

const AdminUsersDetails = () => {
    const {userid}=useParams()
    const [user,setUser]=useState([])
    useEffect(()=>{
     fetch(`https://json-server-ecommerce-t2t5.onrender.com/users/${userid}`)
     .then((res)=>res.json())
     .then((data)=>setUser(data))
    },[userid])

    const OrderDetails=[
        {orderId: 101, productName: "Air Jordan 1 Low SE", price: 10257 },
        {ordeerId:102, productName:"Nike Zoom Vomero 5 Premium",price: 15995},
        {ordeerId:103, productName:"Nike Total 90",price: 9695}
    ]
  return (
    <div>
        <h2 className='text-center my-5'>User Details</h2>

        <Card className='shadow-sm'>
            <Row>
                <Col md={12} className='p-5'>
                <p>User ID: <b> {user.id}</b></p>
                <p>Name: <b> {user.name}</b></p>

                <h4>Order Details:</h4>
                 {OrderDetails.map((curr)=>(
                    <div >
                        <ul>
                            <li>
                            <p>{curr.productName} <br/>Price:{curr.price}/-</p>
                        </li>
                        </ul>
                    </div>
                 ))}
                </Col>
            </Row>
        </Card>
        
    </div>
  )
}

export default AdminUsersDetails