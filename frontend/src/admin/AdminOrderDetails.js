import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminAPI from "../api/adminAPI";
import { toast } from "react-toastify";
import "./css/AdminOrderDetails.css";
const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await AdminAPI.get(`/orders/${id}/`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load order");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (!order) return <h4 className="text-center mt-5">Loading...</h4>;

  return (
    <div className="p-4">
      <h2 className="mb-4">Order Details</h2>

      {/* 🔹 Order Info */}
      <div className="card p-3 mb-4">
        <h5>Order Info</h5>
        <p>
          <strong>Order ID:</strong> #{order.order_id}
        </p>
        <p>
          <strong>Customer:</strong> {order.customer}
        </p>
        <p>
          <strong>Email:</strong> {order.email}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      {/* 🔹 Payment Info */}
      <div className="card p-3 mb-4">
        <h5>Payment</h5>
        <p>
          <strong>Method:</strong> {order.payment_method}
        </p>
        <p>
          <strong>Status:</strong> {order.payment_status}
        </p>
        <p>
          <strong>Total:</strong> ₹{order.total_price}
        </p>
      </div>
      {/* 🔹 Delivery Address */}
      <div className="card p-3 mb-4">
        <h5>📍 Delivery Address</h5>

        <p>
          <strong>Name:</strong> {order.name}
        </p>
        <p>
          <strong>Phone:</strong> {order.phone}
        </p>
        <p>
          <strong>Address:</strong> {order.address}
        </p>
        <p>
          <strong>City:</strong> {order.city}
        </p>
        <p>
          <strong>State:</strong> {order.state}
        </p>
      </div>

      {/* 🔹 Items */}
      <div className="card p-3">
        <h5>Items</h5>

        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
