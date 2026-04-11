import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminAPI from "../api/adminAPI";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const AdminUsersTrash = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // fetch deleted users
  const fetchDeletedUsers = async () => {
    try {
      const res = await AdminAPI.get("/users/trash/");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load trash users");
    }
  };

  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  //restore user
  const handleRestore = async (id) => {
    try {
      await AdminAPI.patch(`/users/restore/${id}/`);
      toast.success("User restored");
      fetchDeletedUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to restore user");
    }
  };

  //hard delete
  const handleHardDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete permanently?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete permanently",
    });

    if (!result.isConfirmed) return;

    try {
      await AdminAPI.delete(`/users/hard-delete/${id}/`);

      toast.success("User permanently deleted");
      fetchDeletedUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to delete user", "error");
    }
  };

  return (
    <div>
      <h2 className="mt-5 text-center mb-4">Users Trash</h2>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((curr, index) => (
              <tr key={curr.id}>
                <td>{index + 1}</td>
                <td>{curr.id}</td>
                <td>{curr.username}</td>
                <td>{curr.email}</td>

                <td>
                  {/*restore */}
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={() => handleRestore(curr.id)}
                  >
                    Restore
                  </Button>

                  {/*hard Delete */}
                  <Button
                    variant="danger"
                    onClick={() => handleHardDelete(curr.id)}
                  >
                    Delete Permanently
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No deleted users
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminUsersTrash;