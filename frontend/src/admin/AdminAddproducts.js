import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../api/axios'
import AdminAPI from '../api/adminAPI'
const AdminAddproducts = () => {
    const navigate = useNavigate()

    const [product, setProduct] = useState({
        name: "",
        category: "",
        price: "",
        featured: "",
        image: null,
        qty: 1
    })

    const [categories, setCategories] = useState([])

    // 🔥 Fetch categories from backend
      useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/products/categories/");
        setCategories(res.data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

    // 🔥 Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!product.name || !product.category || !product.price || product.featured === "" || !product.image || !product.qty) {
            toast.warn("All fields are required")
            return
        }

        const formData = new FormData()
        formData.append("name", product.name)
        formData.append("category", product.category)
        formData.append("price", product.price)
        formData.append("featured", product.featured)
        formData.append("image", product.image)
        formData.append("qty", product.qty)

        try {
            const res = AdminAPI

            if (res.ok) {
                toast.success("Product added successfully")
                navigate("/adminpanel")
            } else {
                const data = await res.json()
                console.log(data)
                toast.error("Error adding product")
            }
        } catch (error) {
            console.log(error)
            toast.error("Server error")
        }
    }

    return (
        <div className='container mt-4'>
            <h2 className='my-4 text-center'>Add Product</h2>

            <form onSubmit={handleSubmit}>

                {/* Name */}
                <input
                    type='text'
                    className="form-control mb-2"
                    placeholder='Product name'
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                />

                {/* Category Dropdown */}
                <select
                    className="form-control mb-2"
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Price */}
                <input
                    className="form-control mb-2"
                    type='number'
                    placeholder='Price'
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                />

                {/* Featured */}
                <select
                    className="form-control mb-2"
                    onChange={(e) => setProduct({ ...product, featured: e.target.value === "true" })}
                >
                    <option value="">Select Featured</option>
                    <option value="true">Featured</option>
                    <option value="false">Not Featured</option>
                </select>

                {/* Image Upload */}
                <input
                    className="form-control mb-2"
                    type='file'
                    onChange={(e) => setProduct({ ...product, image: e.target.files[0] })}
                />

                {/* Quantity */}
                <input
                    className="form-control mb-2"
                    type='number'
                    placeholder='Stock'
                    value={product.qty}
                    onChange={(e) => setProduct({ ...product, qty: e.target.value })}
                />

                {/* Buttons */}
                <div className='text-center my-4'>
                    <button type='submit' className='btn btn-dark me-2'>Add</button>
                    <button
                        type='button'
                        className='btn btn-outline-dark ms-2'
                        onClick={() => navigate("/adminpanel/products")}
                    >
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    )
}

export default AdminAddproducts