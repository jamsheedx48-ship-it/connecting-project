import React, { useEffect, useState } from "react";
import "./css/AdminOrders.css";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import AdminAPI from "../api/adminAPI";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    date: "",
  });

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  // fetch Orders
  const fetchOrders = async () => {
    try {
      const params = {};

      if (filters.search) params.search = filters.search;
      if (filters.status !== "all") params.status = filters.status;
      if (filters.date) params.date = filters.date;

      const res = await AdminAPI.get("/orders/", { params });

      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  //payment status change
  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
      await AdminAPI.patch(`/orders/${orderId}/payment/`, {
        payment_status: newStatus,
      });

      // refresh orders list
      fetchOrders();

      toast.success("Payment status updated");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status");
    }
  };
  //update Status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await AdminAPI.patch(`/orders/${id}/status/`, {
        status: newStatus,
      });

      toast.success("Status updated");
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-center mb-4">Orders</h2>

      {orders.length === 0 && (
        <h5 className="text-center text-muted">No orders found</h5>
      )}

      <div className="d-flex gap-3 mb-3">
        <input
          type="text"
          placeholder="Search order or customer"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">All</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Payment Method</th>
            <th>Payment Status</th>
            <th>Order Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>#{order.id}</td>
              <td>{order.customer}</td>
              <td>₹{order.total_price}</td>
              <td>
                {order.payment_method}
                {order.payment_channel && (
                  <> (Paid via {order.payment_channel.toUpperCase()})</>
                )}
              </td>
              <td>
                <select
                  value={order.payment_status}
                  onChange={(e) =>
                    handlePaymentStatusChange(order.id, e.target.value)
                  }
                  
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </td>
              {/* STATUS DROPDOWN */}
              <td>
                <select
                  disabled={order.status === "cancelled"||order.status=="delivered"}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={`status-dropdown status-${order.status}`}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>

              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => navigate(`/adminpanel/orders/${order.id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminOrders;
