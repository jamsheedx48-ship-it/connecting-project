import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
const EditProduct = () => {
    const {id}=useParams()
    const navigate=useNavigate()
    
    const [product,setProduct]=useState({
        name:"",
        type:"",
        price:"",
        image:"",
        featured: false
        
    })
    useEffect(()=>{
     fetch(`https://json-server-ecommerce-t2t5.onrender.com/products/${id}`)
     .then((res)=>res.json())
    .then((data)=>setProduct(data))
    },[id])
    
    const handleChange=(e)=>{
       const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
    }
     const handleSubmit=(e)=>{
     e.preventDefault()

     fetch(`https://json-server-ecommerce-t2t5.onrender.com/products/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(product)
     })
     .then(()=>{
        toast.success("Product updated succesfully")
        navigate("/adminpanel")
     })
   }
  return (
    <div>
        <h2>Edit product</h2>
        <form onSubmit={handleSubmit} className='container mx-4 mt-4'>
            <label>Name</label>
            <input
             className="form-control mb-2"
             type='text'
             name='name'
             value={product.name}
             onChange={handleChange}
             required
            />
            <label>Type</label>
            <input
             className="form-control mb-2"
             type='text'
             name='type'
             value={product.type}
             onChange={handleChange}
             required
            />
            <label>Price</label>
            <input
             className="form-control mb-2"
             type='number'
             name='price'
             value={product.price}
             onChange={handleChange}
             required
            />
            <label>Image-URL</label>
            <input
             className="form-control mb-2"
             type='text'
             name='image'
             value={product.image}
             onChange={handleChange}
             required
            />
            <label>Featured</label>
            <input
             type='checkbox'
             name='featured'
             checked={product.featured}
             onChange={handleChange}
            /> <br/>
            <Button variant="primary" type="submit">Update Product</Button>
           
        </form>
    </div>
  )
}

export default EditProduct