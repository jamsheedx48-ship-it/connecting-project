import React from 'react'
import Admin from './Admin'
import "./css/AdminLayout.css"
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
   <div className="admin-layout">
      <Admin/>

      <div className="admin-content">
        <Outlet /> 
      </div>
    </div>

  )
}

export default AdminLayout
