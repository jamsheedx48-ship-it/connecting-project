import React, { useEffect, useState } from 'react'
import {Button,Card,Row,Col} from "react-bootstrap"
import {useNavigate } from 'react-router-dom'
import "./css/ProductItem.css"
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'



const ProductItem = () => {
  
    const navigate=useNavigate()
    const {addTocart}=useContext(CartContext)

  const details=(id)=>{
    navigate(`/details/${id}`)}

    const [search,setSearch]=useState("")
    const [product,setProduct]=useState([])
    const [category,setCategory]=useState("all")
    
       useEffect(()=>{
      fetch("https://json-server-ecommerce-t2t5.onrender.com/products")
      .then((res)=>res.json())
      .then((data)=>setProduct(data))
    },[])
     
    const FilteredProducts=product.filter((curr)=>{
       const searchMatch= curr.name.toLowerCase().includes(search.toLowerCase())
       if(category==="featured"){
        return curr.featured===true&&searchMatch
       }
       return searchMatch
    }
    )

   
  
  return (
    <div className='container my-4'>
      <h1 className='text-center mb-4'>All Products</h1>
     <div className='text-center my-4'>
       <input
      placeholder='Search products'
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      className='border border-2 rounded-3'
      />
     </div>
     

      { <div className='btn-category text-center mb-4'>
        <Button variant={category==="all"? "dark" : "outline-dark"} className='me-2' onClick={()=>setCategory('all')}>All</Button>
      <Button variant={category==="featured"?"dark" : "outline-dark"} className='ms-2' onClick={()=>setCategory('featured')}>Featured</Button>
      </div> }

      <Row>
        
        
        
        {FilteredProducts.map((curr) => (

          <Col md={4} sm={6} xs={12} className='mb-4' key={curr.id}>
        
            <Card className='shadow-sm mb-4 p-3 shadow-sm rouned-3'  >
              <Card.Img  className="product-img"src={curr.image} alt={curr.name} onClick={()=>details(curr.id)}/>
              <Card.Body>
                <Card.Title onClick={()=>details(curr.id)}>{curr.name}</Card.Title>
                <Card.Text >
                  {curr.type}
                </Card.Text>
                <Card.Text>
                  ₹{curr.price}
                </Card.Text>
                <Button variant="dark" onClick={()=>{addTocart(curr)}}>Add to cart</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

    </div>
  )
}

export default ProductItem