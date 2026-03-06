import React, { useEffect, useState } from 'react'
import { Card,Row,Col } from 'react-bootstrap'


const Orders = () => {
    const [orders,setOrders]=useState([])
    const userId = localStorage.getItem("userid")
    useEffect(()=>{
       fetch(`https://json-server-ecommerce-t2t5.onrender.com/orders/?userId=${userId}`)
       .then((res)=>res.json())
       .then((data)=>setOrders(data))
       .catch((err)=>console.log(err)
       )
    },[userId])
    
  return (
    <div className='container'>
        <h2 className='text-center my-5'>Your Orders</h2>

        <div>
       {orders.length===0 &&  <h4 className='text-center text-muted'>No orders yet</h4>}
       {orders.map((order)=>(
         <Card key={order.id} className='mb-4 p-3 shadow-sm rouned-3'>
           
            {order.items.map((curr)=>(
                <Row key={curr.index} className='align-items-center py-2'>
            <Col md={4}>
            <Card.Img src={curr.image} alt={curr.name} />
          
           </Col>
           <Col md={8}>
            <h5 >Order ID : <i>#{order.id}</i></h5>
            <h5 className='fw-bold'>{curr.name}</h5>
            <p className='text-muted mb-1'>{curr.price}*{curr.qty}</p>
            <p>status:{order.status}</p> <br/>
            <div className='text-end mt-2'>
                <h4 className='fw-bold'>
                Total:${order.total}
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