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
import AdminAPI from '../api/adminAPI';

const AdminDashboard = () => {
 const [loading, setLoading] = useState(true);
 const [stats,setStats]=useState({
  products:0,
  orders:0,
  users:0
 })
 const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard =async ()=>{
    try{
      const res= await AdminAPI.get("dashboard/")
      setStats({
        products:res.data.total_products,
        orders:res.data.total_orders,
        users:res.data.total_users
      })
      setMonthlySales(res.data.monthly_sales||[])
    }catch(error){
      console.log(error);
      
    }finally{
      setLoading(false)
    }
  }
  
 
  if (loading) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }
  return (
    
    <div className='container my-4 text-center'>
      <h2 className='mb-4 text-center fw-bold'>Dashboard Overview</h2>

      <Row className='mb-4'>
        <Col md={4}>
          <Card className='text-center shadow-sm p-3'>
            <h5>Total Products</h5>
            <h3>{stats.products}</h3>
          </Card>
        </Col>

        <Col md={4}>
          <Card className='text-center shadow-sm p-3'>
            <h5>Total Orders</h5>
            <h3>{stats.orders}</h3>
          </Card>
        </Col>

        <Col md={4}>
          <Card className='text-center shadow-sm p-3'>
            <h5>Total Users</h5>
            <h3>{stats.users}</h3>
          </Card>
        </Col>
      </Row>

      {/* 📈 MONTHLY SALES CHART */}
      <Row>
        <Col>
          <Card className='shadow-sm p-4 border-0'>
            <h5 className='mb-3 fw-semibold'>Monthly Sales</h5>

            {monthlySales.length === 0?(
              <p>No Sales data available</p>
            ):(
              <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                {/* Nike style black bar */}
                <Bar dataKey="sales" fill="#83dc82" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            )}

          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboard
