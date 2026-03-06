import React from 'react'
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { Card,Button,Row,Col } from 'react-bootstrap'
import "./css/Cart.css"


const Cart = () => {
     
  

    const {cart,RemoveTask,IncreaseQty,DecreaseQty,BuySingleProduct,PayForAll}=useContext(CartContext)

    const TotalPrice= cart.reduce((acc,curr)=>{
   return acc=acc+curr.price*curr.qty;
  },0)
  return (
    <div>
       <h1 className='text-center my-5' >Your cart</h1>
       {cart.length===0 &&  <h4 className='text-center text-muted'>Your cart is empty</h4>}

       {cart.map((curr)=>(
        <Card key={curr.id} className='cart-card'>
      <Row className='h-100'>
       <Col md={3} className="cart-image-column">
            <div className="cart-img-wrapper">
                  <img src={curr.image} alt={curr.name} className="cartimg" />
            </div>
       </Col>
        
        <Col md={8} >
        <Card.Body>
        <Card.Title >{curr.name}</Card.Title>
        <Card.Text>
          <p>{curr.type}</p>
          <h4>₹{curr.price}</h4>
          <div className='qty'>
            <button onClick={()=>DecreaseQty(curr.id)}>-</button>
            <p>{curr.qty}</p>
             <button onClick={()=>IncreaseQty(curr.id)}>+</button>
          </div>
        </Card.Text >
        <Button variant="outline-secondary" className='me-2' onClick={()=>RemoveTask(curr.id)}>Remove</Button>
        <Button variant="success" className='ms-2' onClick={()=>BuySingleProduct(curr)}>Buy now</Button>
      </Card.Body>
        </Col>
      </Row>
    </Card>
    
       ))}
       {!(cart.length===0)&&<h3 className='text-center'>Total price: ₹{TotalPrice}</h3>}
        <div className="d-flex justify-content-center">
             {!(cart.length===0)&&<Button variant='success' onClick={PayForAll}>Pay for all</Button>}
        </div>
      
    </div>
  )
}

export default Cart