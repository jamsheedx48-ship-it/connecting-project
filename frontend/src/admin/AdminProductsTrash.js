import React, { useEffect, useState } from "react";
import AdminAPI from "../api/adminAPI"; // your axios instance
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminProductsTrash = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // fetch deleted products
  const fetchDeletedProducts = async () => {
    try {
      const res = await AdminAPI.get("/products/deleted/");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load deleted products");
    }
  };

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  //  restore product
  const handleRestore = async (id) => {
  try {
    await AdminAPI.post(`/products/restore/${id}/`);

    setProducts((prev) => prev.filter((item) => item.id !== id));

    toast.success("Product restored");
  } catch(err){
    console.log(err.response);
    
    toast.error("Restore failed");
  }
};

  //  hard delete
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
    await AdminAPI.delete(`/products/hard-delete/${id}/`);

    setProducts((prev) => prev.filter((item) => item.id !== id));

    toast.success("Deleted permanently");
  } catch {
    toast.error("Delete failed");
  }
};

  return (
    <div style={styles.container}>
      {/* header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Trash</h2>
        <button style={styles.backBtn} onClick={() => navigate("/admin/products")}>
          Back
        </button>
      </div>

      {/*empty state */}
      {products.length === 0 ? (
        <p style={styles.empty}>No deleted products</p>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product.id} style={styles.card}>
              
              {/* image */}
              <img
                src={product.image_url}
                alt={product.name}
                style={styles.image}
              />

              {/* info */}
              <h4 style={styles.name}>{product.name}</h4>
              <p style={styles.price}>₹{product.price}</p>

              {/* buttons */}
              <div style={styles.btnContainer}>
                <button
                  style={styles.restoreBtn}
                  onClick={() => handleRestore(product.id)}
                >
                  Restore
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleHardDelete(product.id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProductsTrash;

//
// ✅ STYLES (NIKE STYLE MINIMAL UI)
//

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#fff",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "600",
  },

  backBtn: {
    padding: "8px 16px",
    border: "1px solid black",
    background: "white",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    marginTop: "50px",
    color: "#777",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },

  card: {
    border: "1px solid #eee",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    transition: "0.2s",
  },

  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  name: {
    fontSize: "16px",
    marginBottom: "5px",
  },

  price: {
    color: "#555",
    marginBottom: "10px",
  },

  btnContainer: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },

  restoreBtn: {
    padding: "6px 10px",
    border: "1px solid black",
    background: "white",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "6px 10px",
    border: "none",
    background: "black",
    color: "white",
    cursor: "pointer",
  },
};