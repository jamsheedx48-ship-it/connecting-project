import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedAdminRoute = ({children}) => {
    const admin = localStorage.getItem("adminLogin")

    if(!admin){
      return <Navigate to="/admin" replace/>
    }
  return children
}

export default ProtectedAdminRoute