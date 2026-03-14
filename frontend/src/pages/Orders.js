import React, { useEffect, useState } from 'react'
import { Card,Row,Col } from 'react-bootstrap'
import API from '../api/axios'

const Orders = () => {
    const [orders,setOrders]=useState([])
    useEffect(()=>{
      const getOrders= async ()=>{
        try{
          const res= await API.get("/orders/")
          setOrders(res.data)
        }catch(err){
          console.log(err);
        }
      }
      getOrders()
    },[])
    
  return (
    <div className='container'>
        <h2 className='text-center my-5'>Your Orders</h2>

        <div>
       {orders.length===0 &&  <h4 className='text-center text-muted'>No orders yet</h4>}
       {orders.map((order)=>(
         <Card key={order.id} className='mb-4 p-3 shadow-sm rouned-3'>
           
            {order.items.map((curr,index)=>(
                <Row key={index} className='align-items-center py-2'>
            <Col md={4}>
            <Card.Img src={curr.product_image} alt={curr.name} />
          
           </Col>
           <Col md={8}>
            <h5 >Order ID : <i>#{order.id}</i></h5>
            <h5 className='fw-bold'>{curr.product_name}</h5>
            <p className='text-muted mb-1'>{curr.price}*{curr.quantity}</p>
            <p>status:{order.status}</p> <br/>
            <div className='text-end mt-2'>
                <h4 className='fw-bold'>
                Total:${order.total_price}
            </h4>
            </div>
           </Col>
           </Row>
            ))}
            
           
         </Card>
       ))}
      
        </div>
    </div>
  )
}

export default Orders