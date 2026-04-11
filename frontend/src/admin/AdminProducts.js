import React, { useEffect, useState } from "react";
import "./css/AdminProducts.css";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AdminAPI from "../api/adminAPI";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let url = `products/?`;

      if (category && category !== "") {
        url += `category=${category}&`;
      }
      if (search && search !== "") {
        url += `search=${search}`;
      }
      const res = await AdminAPI.get(url);
      setProduct(res.data);
      setLoading(false);

      if (categories.length === 0) {
        const uniqueCategory = [
          ...new Map(
            res.data.map((item) => [
              item.category,
              {
                id: item.category,
                name: item.category_name,
              },
            ]),
          ).values(),
        ];
        setCategories(uniqueCategory);
      }
    } catch (err) {
      toast.error("Failed to load products");
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(delay);
  }, [category, search]);

  if (loading) return <h3 className="text-center">Loading...</h3>;

  const handleRemove = async (id) => {
    const result = await Swal.fire({
      title: "Move to Trash?",
      text: "You can restore this later from Trash.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await AdminAPI.delete(`products/delete/${id}/`);

        setProduct((prev) => prev.filter((item) => item.id !== id));
        toast.success("Moved to trash");
      } catch (err) {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div>
      <h2 className="mt-5 mb-5 text-center">Manage Products</h2>
      {/* search */}
      <div className="text-center my-4">
        <input
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-2 rounded-3 px-3 py-1"
        />
      </div>

      {/* category filter */}
      {
        <div className="btn-category text-center mb-4">
          <Button
            variant={category === "" ? "dark" : "outline-dark"}
            className="me-2"
            onClick={() => setCategory("")}
          >
            All
          </Button>

          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? "dark" : "outline-secondary"}
              className="me-2"
              onClick={() => setCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      }

      {/* prdct list */}
      <Row>
        <div className="text-end">
          <Button
            onClick={() => navigate("/adminpanel/products/trash")}
            variant="dark"
            className="mb-3"
          >
            Trash
          </Button>
        </div>
        <div className="text-end my-4 me-3">
          <Button
            variant="success"
            onClick={() => navigate("/adminpanel/addproduct")}
          >
            Add products
          </Button>
        </div>
        {product.map((curr) => (
          <Col md={4} sm={6} xs={12} className="mb-4" key={curr.id}>
            <Card className="shadow-sm mb-4 p-3 rounded-3">
              <Card.Img
                className="product-img"
                src={curr.image}
                alt={curr.name}
              />
              <Card.Body>
                <Card.Title>{curr.name}</Card.Title>
                <Card.Text>{curr.type}</Card.Text>
                <Card.Text>₹{curr.price}</Card.Text>
                <Card.Text>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backgroundColor: curr.stock > 0 ? "#e6f4ea" : "#fdecea",
                      color: curr.stock > 0 ? "#2e7d32" : "#d32f2f",
                    }}
                  >
                    {curr.stock > 0 ? `In Stock ${curr.stock ??0}` : "Out of Stock"}
                  </span>
                </Card.Text>

                {/* OPTIONAL: show number */}
                
                <Button
                  variant="dark"
                  className="me-1"
                  onClick={() => navigate(`/adminpanel/editproduct/${curr.id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="warning"
                  className="ms-1"
                  onClick={() => handleRemove(curr.id)}
                >
                  Remove
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminProducts;
