import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const AdminAddproducts = () => {
    const navigate=useNavigate()
    const [product,setProduct]=useState({
        name:"",
        type:"",
        price:"",
        featured:"",
        image:"",
        qty:""
        
    })

    const handleSubmit=(e)=>{
        e.preventDefault()
    
        if(!product.name||!product.type||!product.price||product.featured===""||!product.image||!product.qty){
            toast.warn("All fields are required")
            return;
        }

        fetch(`https://json-server-ecommerce-t2t5.onrender.com/products`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(product)
        })
        .then(()=>{
            toast.success("Product added succesfuly")
            navigate("/adminpanel")
        })
    }
  return (
    <div className='container mt-4'>
        <h2 className='my-4 text-center'>Add Products</h2>
        <form onSubmit={handleSubmit}>
            <input
            type='text'
            className="form-control mb-2"
            placeholder='Product name'
            onChange={(e)=>setProduct({...product,name:e.target.value})}
            /> 
            <input
            className="form-control mb-2"
            type='text'
            placeholder='Type of the product'
            onChange={(e)=>setProduct({...product,type:e.target.value})}
            />
            <input
            className="form-control mb-2"
            type='number'
            placeholder='Price'
            onChange={(e)=>setProduct({...product,price:e.target.value})}
            />

            <select className="form-control mb-2" onChange={(e)=>setProduct({...product,featured:e.target.value=== "true"})}>
                <option value="">Select Category</option>
                <option value="true">Featured</option>
                <option value="false">Not Featured</option>
            </select>
            <input
            className="form-control mb-2"
            type='text'
            placeholder='Image URL'
            onChange={(e)=>setProduct({...product,image:e.target.value})}
            />
            <input
            className="form-control mb-2"
            type='number'
            placeholder='Quantity'
            onChange={(e)=>setProduct({...product,qty:e.target.value})}
            />
            
            <div className='text-center my-4'>
                <button type='submit' className='btn btn-success me-2'>Add</button>
                <button type='button' className='btn btn-danger ms-2' onClick={()=>navigate("/adminpanel/products")}>Cancel</button>
            </div>
        </form>
    </div>
  )
}

export default AdminAddproducts