import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import AdminAPI from "../api/adminAPI";
import API from "../api/axios";
const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    type: "",
    price: "",
    stock: "",
    category: "",
    featured: false,
    image: null,
    image_url: "",
  });
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
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await AdminAPI.get(`/products/${id}/`);
        setProduct(res.data)
      } catch (err) {
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
  };
  const handleImageChange = (e) => {
    setProduct({
      ...product,
      image: e.target.files[0],
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("type", product.type);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("category", product.category);
    formData.append("featured", product.featured ? "true" : "false");
    // send image only if new one selected
    if (product.image instanceof File) {
      formData.append("image", product.image);
    }

    try {
      await AdminAPI.patch(`/products/update/${id}/`, formData);

      toast.success("Product updated successfully ");
      navigate("/adminpanel/products");
    } catch (err) {
      console.error(err);
      toast.error("Update failed ");
    }
  };
  return (
    <div>
      <h2>Edit product</h2>
      <form onSubmit={handleSubmit} className="container mx-4 mt-4">
        <label>Name</label>
        <input
          className="form-control mb-2"
          type="text"
          name="name"
          value={product.name || ""}
          onChange={handleChange}
          required
        />
        <label>Type</label>
        <input
          className="form-control mb-2"
          type="text"
          name="type"
          value={product.type || ""}
          onChange={handleChange}
          required
        />
        <label>Price</label>
        <input
          className="form-control mb-2"
          type="number"
          name="price"
          value={product.price ?? ""}
          onChange={handleChange}
          required
        />
        <label>Stock</label>
        <input
          className="form-control mb-2"
          type="number"
          name="stock"
          value={product.stock ?? 0}
          onChange={handleChange}
        />
        <label>Category</label>
        <select
          className="form-control mb-2"
          name="category"
          value={product.category ?? ""}
          onChange={handleChange}
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {product.image_url && (
          <img
            src={product.image_url}
            alt="preview"
            style={{ width: "120px", marginBottom: "10px" }}
          />
        )}
        <label>Image</label>
        <input
          className="form-control mb-2"
          type="file"
          name="image"
          onChange={handleImageChange}
        />
        <label>Featured</label>
        <input
          type="checkbox"
          name="featured"
          checked={product.featured}
          onChange={handleChange}
        />{" "}
        <br /><br/>
        <Button variant="primary" type="submit">
          Update Product
        </Button>
      </form>
    </div>
  );
};

export default EditProduct;
