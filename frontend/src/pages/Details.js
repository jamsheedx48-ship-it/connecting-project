import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Row,Col, Button } from 'react-bootstrap'
import "./css/Details.css"
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import API from '../api/axios'

const Details = () => {
  const {addTocart,BuySingleProduct}=useContext(CartContext)
  const {id}=useParams()
  const [Details,setDetails]=useState({})
  useEffect(()=>{
     const getProductDetails= async ()=>{
      try{
        const res= await API.get(`/products/${id}/`)
        setDetails(res.data)
      }catch(err){
        console.log(err);
        
      }
     }
     getProductDetails()
  },[id])
  return (
    <div className='details-container'>
      <Row className='align-items-center'>
          <Col md={6}>
          <img src={Details?.image} alt='product-image' className='detailsimg shadow-sm'/>
          </Col>
          <Col md={6}>
           <h2>{Details?.name}</h2>
           <p>{Details?.type}</p>
           <h3>${Details?.price}</h3>

           <div className='Details-btn'>
            <Button variant='dark' onClick={()=>{addTocart(Details)}}>Add to cart</Button>
            <Button variant='primary'onClick={()=>BuySingleProduct(Details)}>Buy now</Button>
           </div>
          </Col>
        </Row>
    </div>
  )
}

export default Details