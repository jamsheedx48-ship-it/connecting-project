import React, { useEffect, useState } from 'react'
import {Button,Card,Row,Col} from "react-bootstrap"
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
const Item = () => {
  const {addTocart}=useContext(CartContext)
  const navigate=useNavigate()

  const details=(id)=>{
    navigate(`/details/${id}`)
  }
    const [item,setItem]=useState([])
    useEffect(()=>{
    fetch("https://json-server-ecommerce-t2t5.onrender.com/products")
    .then((res)=>res.json())
    .then((data)=>{
      const featured=data.filter((curr)=>(
        curr.featured===true
      ))
      setItem(featured)
    })
    },[])
  return (
    
    <div className='container my-4'>
      <h1 className='text-center mb-4'>Featured Products</h1>

      <Row>
        {item.map((curr) => (
          <Col md={4} sm={6} xs={12} className='mb-4' key={curr.id}>
            <Card className='shadow-sm ' >
              <Card.Img variant="top" src={curr.image} alt={curr.name}  onClick={()=>details(curr.id)} />
              <Card.Body>
                <Card.Title  onClick={()=>details(curr.id)}>{curr.name}</Card.Title>
                <Card.Text>
                  {curr.type}
                </Card.Text>
                <Card.Text>
                  ₹{curr.price}
                </Card.Text>
                <Button variant="dark" onClick={()=>addTocart(curr)}>Add to cart</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

    </div>
  )
}

export default Item