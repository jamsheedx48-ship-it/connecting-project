import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminAPI from "../api/adminAPI";
import { Card } from "react-bootstrap";

const AdminUserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await AdminAPI.get(`/users/${id}/`);
      setUser(res.data);
    }catch (err) {
  console.error("ERROR:", err.response || err);
}
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2>User Details</h2>

      <Card className="p-4 mt-3 shadow-sm">
        <p><strong>Name:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Status:</strong> {user.is_active ? "Active" : "Blocked"}</p>
        <p><strong>Role:</strong> {user.is_staff ? "Admin" : "User"}</p>

        <hr />

        <p><strong>Orders Count:</strong> {user.orders_count}</p>
        <p><strong>Total Spent:</strong> ₹{user.total_spent}</p>

        <hr />

        <p><strong>Joined:</strong> {new Date(user.date_joined).toLocaleDateString()}</p>
        <p><strong>Last Login:</strong> {
          user.last_login
            ? new Date(user.last_login).toLocaleString()
            : "Never"
        }</p>
      </Card>
    </div>
  );
};

export default AdminUserDetails;