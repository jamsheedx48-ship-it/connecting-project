import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import API from "../api/axios";
import Swal from "sweetalert2";
import "./css/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await API.get("/orders/");
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getOrders();
  }, []);

  const CancelOrder = async (order_id) => {
    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No",
      confirmButtonColor: "#000",
      cancelButtonColor: "#aaa",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await API.post(`orders/${order_id}/cancel/`);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === order_id ? { ...order, status: "cancelled" } : order,
        ),
      );
      Swal.fire({
        title: "Success",
        text: res.data.message,
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const handleRetryPayment = async (order) => {
  try {
    // create razorpay order again
    const { data } = await API.post("/orders/create-order/", {
      amount: Number(order.total_price),
    });

    let paymentCompleted = false;

    const options = {
      key: "rzp_test_SWKCCTluNoYQ9W",
      amount: data.amount,
      currency: "INR",
      name: "Nike Store",
      description: "Retry Payment",
      order_id: data.order_id,

handler: async function (response) {
  paymentCompleted=true
  console.log("HANDLER TRIGGERED", response);
  try {
    console.log("VERIFY CALL", response, order.id);

    await API.post("/orders/verify-payment/", {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      order_id: order.id,  // ✅ DB ORDER ID
    });

    Swal.fire("Success", "Payment successful", "success")
      .then(() => window.location.reload());

  } catch (err) {
    console.log("VERIFY ERROR:", err.response?.data);
    Swal.fire("Error", "Verification failed", "error");
  }
},

      modal: {
        ondismiss: async function () {
          if (paymentCompleted) return;

          await API.post("/orders/payment-failed/", {
            order_id: order.id,
          });
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", async function () {
      if(paymentCompleted)return;
      await API.post("/orders/payment-failed/", {
        order_id: order.id,
      });

      Swal.fire("Failed", "Payment failed. Try again.", "error");
    });

    rzp.open();

  } catch (err) {
    console.log(err);
    console.log("RETRY ERROR:", err);
    console.log("RESPONSE:", err?.response);
    Swal.fire("Error", "Something went wrong", "error");
  }
};

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return { background: "#000", color: "#fff" };
      case "shipped":
        return { background: "#111", color: "#fff" };
      case "processing":
        return { background: "#f2f2f2", color: "#000" };
      case "cancelled":
        return { background: "#ddd", color: "#000" };
      default:
        return { background: "#f5f5f5", color: "#000" };
    }
  };

  return (
    <div className="container order-page">
      <h2 className="orders-title text-center my-5">YOUR ORDERS</h2>

      {orders.length === 0 && (
        <h5 className="text-center orders-empty">No orders yet</h5>
      )}

      <div className="order-wrapper">
        {orders.map((order) => (
          <Card key={order.id} className="order-card mb-4">
            {/* header */}
            <div className="order-card-header">
              <div className="order-header-top">
                <p className="order-id">ORDER #{order.id}</p>

                <p>
                  Payment Status:{" "}
                  <span
                    style={{
                      color:
                        order.payment_status === "paid"
                        ? "green"
                        : order.payment_status === "failed"
                        ? "red"
                        : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {order.payment_status === "paid"
                      ? "Paid"
                      : order.payment_status === "failed"
                        ? "Failed"
                        : "Pending"}
                  </span>
                </p>

                <h5 className="order-total">₹{order.total_price}</h5>
                {order.status !== "cancelled" &&
                  order.status !== "delivered" &&
                  order.payment_status !== "failed" &&
                  order.status !== "shipped" && (
                    <Button variant="danger"
                    onClick={() => CancelOrder(order.id)}>
                      Cancel Order
                    </Button>
                  )}
                {order.payment_status === "failed" && (
                  <Button
                  variant="dark"
                    onClick={() => handleRetryPayment(order)}
                  >
                    Retry Payment
                  </Button>
                )}
              </div>

              <div className="order-header-bottom">
                <span
                  className="order-status"
                  style={getStatusStyle(order.status)}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {order.items.map((item, index) => (
              <Row key={index} className="align-items-center order-row mx-0">
                <Col md={3} className="order-img-col">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="order-product-img"
                  />
                </Col>

                <Col md={9} className="order-details">
                  <h5 className="order-product-name">{item.product_name}</h5>

                  <p className="order-price">
                    {item.price} × {item.quantity}
                  </p>
                </Col>
              </Row>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
