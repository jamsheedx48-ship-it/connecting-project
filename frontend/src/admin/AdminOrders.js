import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
const AdminOrders = () => {
  const [order,setOrder]=useState([])
 
  const userId=localStorage.getItem("userid")
  useEffect(()=>{
     fetch(`https://json-server-ecommerce-t2t5.onrender.com/orders`)
  .then((res)=>res.json())
  .then((data)=>setOrder(data))
  
   
  },[userId])
  return (
    <div>
       <h2 className='mt-5 text-center' >Orders</h2>
        
       {order.length===0 &&  <h4 className='text-center text-muted'>No orders yet</h4>}
       
           
            
             <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Order ID</th>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          
          <th>Status</th>
        </tr>
      </thead>
      
      <tbody>
        {order.map((curr,index)=>
      
            curr.items.map(item=>(
            
               <tr key={item.id}>
          <td>{index+1}</td>
          <td>#{curr.id}</td>
          <td>{item.name}</td>
          <td>{item.price}</td>
          <td>{item.qty}</td>
          
          <td>{curr.status}</td>
        </tr>
            
            ))
           
      
           
        )}
       
       
      </tbody>
    </Table>
          
           
      
        
    </div>
  )
}

export default AdminOrders