import React from "react";
import Register from "../pages/Register";
import Login from "../pages/Login";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Details from "../pages/Details";
import Cart from "../pages/Cart";
import About from "../pages/About";
import Payment from "../pages/Payment";
import PaymentSuccesful from "../pages/PaymentSuccesful";
import Orders from "../pages/Orders";
import AdminDashboard from "../admin/AdminDashboard";
import AdminProducts from "../admin/AdminProducts";
import AdminUsers from "../admin/AdminUsers";
import AdminOrders from "../admin/AdminOrders";
import AdminLogin from "../admin/AdminLogin";
import AdminUserDetails from "../admin/AdminUserDetails";
import AdminAddproducts from "../admin/AdminAddproducts";
import EditProduct from "../admin/EditProduct";
import ProtectedAdminRoute from "../admin/ProtectedAdminRoute";
import AdminLayout from "../admin/AdminLayout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthRoute from "./AuthRoute";
import AdminProductsTrash from "../admin/AdminProductsTrash";
import AdminUsersTrash from "../admin/AdminUsersTrash";
import AdminOrderDetails from "../admin/AdminOrderDetails";
import WalletPage from "../pages/Wallet";
import ProtectedUserRoute from "../pages/ProtectedUserRoute";
import AdminAuthRoute from "./AdminAuthRoute";
import { AdminAuthProvider } from "../context/AdminAuthContext";
const MainRoute = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <>
                <Navbar />
                <Login />
                <Footer />
              </>
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <>
                <Navbar />
                <Register />
                <Footer />
              </>
            </AuthRoute>
          }
        />
        <Route
          path="/products"
          element={
            <>
              <Navbar />
              <Products />
              <Footer />
            </>
          }
        />
        <Route
          path="/details/:id"
          element={
            <>
              <Navbar />
              <Details />
              <Footer />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedUserRoute>
              <>
                <Navbar />
                <Cart />
                <Footer />
              </>
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/success/:orderid"
          element={
            <ProtectedUserRoute>
              <>
                <Navbar />
                <PaymentSuccesful />
                <Footer />
              </>
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/payment/"
          element={
            <ProtectedUserRoute>
              <>
                <Navbar />
                <Payment />
                <Footer />
              </>
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedUserRoute>
              <>
                <Navbar />
                <Orders />
                <Footer />
              </>
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedUserRoute>
              <>
                <Navbar />
                <WalletPage />
                <Footer />
              </>
            </ProtectedUserRoute>
          }
        />
        <Route path="/admin" element={
          <AdminAuthProvider>
          <AdminAuthRoute>
                <AdminLogin />
          </AdminAuthRoute>
          </AdminAuthProvider>

          
          
          } />
        <Route
          path="/adminpanel"
          element={
            <AdminAuthProvider>
              <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
            </AdminAuthProvider>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="userdetails/:id" element={<AdminUserDetails />} />
          <Route path="addproduct" element={<AdminAddproducts />} />
          <Route path="editproduct/:id" element={<EditProduct />} />
          <Route path="products/trash" element={<AdminProductsTrash />} />
          <Route path="/adminpanel/users/trash" element={<AdminUsersTrash />} />
          <Route
            path="/adminpanel/orders/:id"
            element={<AdminOrderDetails />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default MainRoute;
