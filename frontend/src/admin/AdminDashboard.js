import React, { useEffect, useState } from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const AdminDashboard = () => {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch(`https://json-server-ecommerce-t2t5.onrender.com/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))

    fetch(`https://json-server-ecommerce-t2t5.onrender.com/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data))

    fetch(`https://json-server-ecommerce-t2t5.onrender.com/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
  }, [])
  
  // Function to calculate monthly sales
  const getMonthlySales = () => {
    const monthlySalesMap = {}

    orders.forEach(order => {
      if (order.status !== "paid") return; // only paid orders

      const date = new Date(order.date)
      const month = date.toLocaleString("default", { month: "short" }) // Jan, Feb...
      const year = date.getFullYear()
      const key = `${month} ${year}`

      if (!monthlySalesMap[key]) monthlySalesMap[key] = 0
      monthlySalesMap[key] += Number(order.total)
    })

    // convert to array for chart
    return Object.keys(monthlySalesMap).map(month => ({
      month,
      sales: monthlySalesMap[month]
    }))
  }

  const monthlySales = getMonthlySales()
  

  return (
    <div className='container my-4 text-center'>
      <h2 className='mb-4 text-center fw-bold'>Dashboard Overview</h2>

      <Row className='mb-4'>
        <Col md={4}>
          <Card className='text-center shadow-sm p-3'>
            <h5>Total Products</h5>
            <h3>{products.length}</h3>
          </Card>
        </Col>

        <Col md={4}>
          <Card className='text-center shadow-sm p-3'>
            <h5>Total Orders</h5>
            <h3>{orders.length}</h3>
          </Card>
        </Col>

        <Col md={4}>
          <Card className='text-center shadow-sm p-3'>
            <h5>Total Users</h5>
            <h3>{users.length}</h3>
          </Card>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col>
          <Card className='shadow-sm p-3'>
            <h5 className='mb-3'>Monthly Sales</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboard
