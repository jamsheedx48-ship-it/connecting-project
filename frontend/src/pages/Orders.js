import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import API from "../api/axios";
import Swal from 'sweetalert2';
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

  const CancelOrder = async(order_id)=>{
    const result= await Swal.fire({
      title:"Cancel Order?",
      text:"Are you sure you want to cancel this order?",
      icon:"warning",
      showCancelButton:true,
      confirmButtonText:"Yes, Cancel",
      cancelButtonText:"No",
      confirmButtonColor:"#000",
      cancelButtonColor:"#aaa"
    });
    if(!result.isConfirmed)return;

    try{
      await API.post(`orders/${order_id}/cancel/`);
      setOrders(prev=>
        prev.map(order=>
          order.id===order_id ? {...order,status:"cancelled"}:order
        )
      )
      Swal.fire("Cancelled!", "Your order has been cancelled.", "success")
    }catch(err){
      Swal.fire("Error", "Something went wrong.", "error")
      
    }
  }
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

                <p className="order-payment">
                  Payment: {order.payment_method}
                </p>

                <h5 className="order-total">
                  ₹{order.total_price}
                </h5>
                {order.status !== "cancelled" && order.status!== "delivered" && order.status!== "shipped" &&(
                  <Button onClick={()=>CancelOrder(order.id)}>
                    Cancel Order
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
                  <h5 className="order-product-name">
                    {item.product_name}
                  </h5>

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