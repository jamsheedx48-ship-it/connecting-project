import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Await, useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./css/Payment.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import API from "../api/axios";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Payment = () => {
  const location = useLocation();
  const buyNowProduct = location.state?.buyNowProduct;
  const isBuyNow = !!buyNowProduct;
  const [loading, setLoading] = useState(false);
  const { cart, setCart } = useContext(CartContext);

  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    address: "",
    state: "",
    city: "",
    phone: "",
  });

  

  useEffect(() => {
    const saved = localStorage.getItem("savedAddress");
    if (saved) {
      setAddress(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await API.get("/wallet/");
      setWalletBalance(res.data.balance);
    } catch (err) {
      console.error(err);
    }
  };

  const totalAmount = isBuyNow
    ? buyNowProduct.price * buyNowProduct.quantity
    : cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const addressValidate = () => {
    if (!address.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (address.name.length < 3) {
      toast.error("Name must be more than 3 charcters ");
      return false;
    }
    if (!address.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (!address.state.trim()) {
      toast.error("State is required");
      return false;
    }
    if (!address.city.trim()) {
      toast.error("City is required");
      return false;
    }
    if (!/^\d{10}$/.test(address.phone)) {
      toast.error("Enter valid 10 digit phone number");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);
    if (!paymentMethod) {
      toast.warn("Please select a payment method");
      return;
    }

    if (!addressValidate()) return;

    try {
      // ✅ CREATE ORDER
      const createRes = await API.post(
        isBuyNow ? "/orders/buy-now/" : "/orders/create/",
        isBuyNow
          ? {
              product_id: buyNowProduct.id,
              quantity: buyNowProduct.quantity,
            }
          : {},
      );
      const orderid = createRes.data.order_id;

      // ✅ 2. SAVE ADDRESS + PAYMENT METHOD
      await API.patch(`/orders/${orderid}/`, {
        payment_method: paymentMethod,
        name: address.name,
        address: address.address,
        state: address.state,
        city: address.city,
        phone: address.phone,
      });

      // ✅ 3. COD FLOW
      if (paymentMethod === "COD") {
        if (!isBuyNow) {
          setCart([]);
        }
        localStorage.setItem("savedAddress", JSON.stringify(address));

        Swal.fire({
          title: "Success!",
          text: "Order placed",
          icon: "success",
        }).then(() => {
          navigate(`/success/${orderid}`);
        });

        return;
      }
      if (paymentMethod === "WALLET") {
        try {
          const res = await API.post("/wallet/pay/", {
            order_id: orderid,
          });
          if (!isBuyNow) {
            setCart([]);
          }
          localStorage.setItem("savedAddress", JSON.stringify(address));
          Swal.fire({
            title: "Success",
            text: "Payment done using wallet",
            icon: "success",
          }).then(() => {
            window.location.reload();
          });

          navigate("/orders");
        } catch (err) {
          Swal.fire({
            title: "Error",
            text: err.response?.data?.error || "Payment failed",
            icon: "error",
          });
        }
        return;
      }

      // ✅ 5. CREATE RAZORPAY ORDER
      const { data } = await API.post("/orders/create-order/", {
        amount: totalAmount,
      });

      // ✅ 6. OPEN RAZORPAY
      let paymentCompleted = false;
      const options = {
        key: "rzp_test_SWKCCTluNoYQ9W",
        amount: data.amount,
        currency: "INR",
        name: "Nike Store",
        description: "Order Payment",
        order_id: data.order_id,

        handler: async function (response) {
          paymentCompleted=true;
          try {
            // ✅ VERIFY PAYMENT
            await API.post("/orders/verify-payment/", {
              ...response,
              order_id: orderid,
            });
            if (!isBuyNow) {
              setCart([]);
            }
            localStorage.setItem("savedAddress", JSON.stringify(address));

            Swal.fire("Success", "Payment successful", "success").then(() => {
              navigate(`/success/${orderid}`);
            });
          } catch (err) {
            console.log(err);
            Swal.fire("Error", "Payment verification failed", "error");
          }
        },
        modal: {
          ondismiss: async function () {
            console.log("DISMISSED TRIGGERED", orderid); // 👈 ADD

            if(paymentCompleted)return;
            // 👉 USER CLOSED / CANCELLED PAYMENT
            await API.post("/orders/payment-failed/", {
              order_id: orderid,
            });

            Swal.fire("Cancelled", "Payment was cancelled", "warning");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async function (response) {
        console.log("FAILED TRIGGERED", orderid);
        
        await API.post("/orders/payment-failed/", {
          order_id: orderid,
        });

        Swal.fire("Failed", "Payment failed. Try again.", "error");
      });
      rzp.open();
    } catch (err) {
      console.log(err.response.data);
      toast.error("Payment failed");
    }
  };

  return (
    <div>
      <h2 className="my-5 text-center">Payment Details</h2>
      <Row>
        <Col md={6} className="text-center mb-3 border border-dark-1">
          <h4>Order Summary</h4>

          {isBuyNow ? (
            <div>
              <p>Product: {buyNowProduct.name}</p>
              <p>Qty: {buyNowProduct.quantity}</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id}>
                <p>Product Name: {item.name}</p>
                <p>Qty: {item.quantity}</p>
              </div>
            ))
          )}

          <h4>Total: {totalAmount}/-</h4>
        </Col>

        <Col md={6} className="text-center mb-3 border border-dark-1">
          <h4>Payment Method</h4>
          <div className="my-5">
            <input
              type="radio"
              name="payment"
              onChange={(e) => setPaymentMethod(e.target.value)}
              value="COD"
            />{" "}
            <label>Cash on delivery</label> <br />
            <input
              type="radio"
              name="payment"
              onChange={(e) => setPaymentMethod(e.target.value)}
              value="UPI"
            />{" "}
            <label>UPI</label> <br />
            <input
              type="radio"
              name="payment"
              onChange={(e) => setPaymentMethod(e.target.value)}
              value="CARD"
            />{" "}
            <label>CARD</label> <br />
            <label>
              <input
                type="radio"
                name="payment"
                value="WALLET"
                disabled={walletBalance < totalAmount}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Wallet (₹{walletBalance})
            </label>
          </div>
        </Col>
        <Col md={12}>
          <div className="auth-container">
            <h2>Delivery Address</h2>

            {localStorage.getItem("savedAddress") && !showForm ? (
              <div className="address-card">
                <p>
                  <strong>{address.name}</strong>
                </p>
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state}
                </p>
                <p>{address.phone}</p>

                <button onClick={() => setShowForm(true)}>
                  Change Address
                </button>
              </div>
            ) : (
              <form>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={address.name}
                  onChange={handleChange}
                />
                <br />
                <br />

                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={address.address}
                  onChange={handleChange}
                />
                <br />
                <br />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={handleChange}
                />
                <br />
                <br />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleChange}
                />
                <br />
                <br />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={address.phone}
                  onChange={handleChange}
                />
              </form>
            )}
          </div>
        </Col>
        <div className="text-center">
          <Button
            variant="success"
            className="text-center"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay ${totalAmount}/-`}
          </Button>
        </div>
      </Row>
    </div>
  );
};

export default Payment;
