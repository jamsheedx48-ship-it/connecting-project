import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import "./css/AdminUsers.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AdminAPI from "../api/adminAPI";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);

  //fetch users
  const fetchUsers = async () => {
    try {
      const res = await AdminAPI.get("/users/");
      setUser(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //block / unblock
  const handleBlock = async (id) => {
    try {
      await AdminAPI.patch(`/users/block/${id}/`);
      toast.success("User status updated");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleRoleChange = async (id, role) => {
  const result = await Swal.fire({
    title: "Change Role?",
    text: `Make this user ${role}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
  });

  if (!result.isConfirmed) return;

  try {
    await AdminAPI.patch(`/users/role/${id}/`, { role });

    // 🔥 instant UI update
    setUser((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, is_staff: role === "admin" } : u
      )
    );

    toast.success("Role updated");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update role");
  }
};

  //soft delete
  const handleRemove = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "User will be moved to trash",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, move it!",
    });
    if (!result.isConfirmed) return;

    try {
      await AdminAPI.patch(`/users/delete/${id}/`);
      toast.success("User moved to trash");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div>
      <h2 className="mt-5 text-center mb-4">Manage Users</h2>
      <Button
        variant="dark"
        className="mb-3"
        onClick={() => navigate("/adminpanel/users/trash")}
      >
        View Trash
      </Button>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {user.map((curr, index) => (
            <tr key={curr.id}>
              <td
                onClick={() => navigate(`/adminpanel/userdetails/${curr.id}`)}
              >
                {index + 1}
              </td>

              <td
                onClick={() => navigate(`/adminpanel/userdetails/${curr.id}`)}
              >
                {curr.id}
              </td>

              <td
                onClick={() => navigate(`/adminpanel/userdetails/${curr.id}`)}
              >
                {curr.username}
              </td>

              <td
                onClick={() => navigate(`/adminpanel/userdetails/${curr.id}`)}
              >
                {curr.email}
              </td>

              {/* status */}
              <td>
                <span
                  className={`px-2 py-1 rounded text-white ${
                    curr.is_active ? "bg-success" : "bg-danger"
                  }`}
                >
                  {curr.is_active ? "Active" : "Blocked"}
                </span>
              </td>

              {/* rolechange */}
              <td>
                <select
                  value={curr.is_staff ? "admin" : "user"}
                  onChange={(e) => handleRoleChange(curr.id, e.target.value)}
                  className="form-select"
                  disabled={!curr.is_active}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>

              {/* actions */}
              <td>
                <Button
                  variant={curr.is_active ? "danger" : "success"}
                  className="me-2"
                  onClick={() => handleBlock(curr.id)}
                >
                  {curr.is_active ? "Block" : "Unblock"}
                </Button>

                <Button
                  variant="warning"
                  className="ms-2"
                  onClick={() => handleRemove(curr.id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminUsers;
