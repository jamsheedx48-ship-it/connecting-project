import React, { useEffect, useState } from 'react'
import {Button,Card,Row,Col} from "react-bootstrap"
import {useNavigate } from 'react-router-dom'
import "./css/ProductItem.css"
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import API from "../api/axios"

const ProductItem = () => {
  
    const navigate=useNavigate()
    const {addTocart}=useContext(CartContext)

  const details=(id)=>{
    navigate(`/details/${id}`)}

    const [search,setSearch]=useState("")
    const [product,setProduct]=useState([])
    const [loading,setLoading] = useState(true)
    const [categories,setCategories]=useState([])
    const [category,setCategory]=useState("")
    
       useEffect(()=>{
        const getProducts=async ()=>{
          try{
            const res= await API.get("products/")
            
            setProduct(res.data)
            setLoading(false)
            const uniqueCategory=[
              ...new Set(res.data.map((item)=>item.category))
            ]

            setCategories(uniqueCategory)

          } catch(error){
            console.log(error)
          }
        }
        getProducts()
    },[])
     
    const FilteredProducts=product.filter((curr)=>{
       const searchMatch= curr.name?.toLowerCase().includes(search.toLowerCase())
       const categoryMatch = category===""||curr.category===category
       return searchMatch && categoryMatch
    }
    )

   if(loading) return <h3 className='text-center'>Loading...</h3>
  
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
        <Button
        variant={category === "" ? "dark" : "outline-dark"}
        className="me-2"
        onClick={() => setCategory("")}
        >
        All
        </Button>

        {categories.map((cat,index)=>(
          <Button
          key={index}
          variant={category===cat? "dark" : "outline-secondary"}
          className='me-2'
          onClick={()=>setCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div> }

      <Row>
        
        
        
        {FilteredProducts.map((curr) => (

          <Col md={4} sm={6} xs={12} className='mb-4' key={curr.id}>
        
            <Card className='shadow-sm mb-4 p-3 rounded-3'  >
              <Card.Img  className="product-img"src={`${curr.image}`} alt={curr.name} onClick={()=>details(curr.id)}/>
              <Card.Body>
                <Card.Title onClick={()=>details(curr.id)}>{curr.name}</Card.Title>
                <Card.Text >
                  {curr.type}
                </Card.Text>
                <Card.Text>
                  ₹{curr.price}
                </Card.Text>
                <p style={{color: curr.stock>0 ?"green" :"red",fontWeight:"bold"}}>
                  {curr.stock>0 ? "In Stock" : "Out of Stock"}
                </p>
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