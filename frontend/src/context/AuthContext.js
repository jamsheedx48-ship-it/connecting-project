import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(
    localStorage.getItem("username")
)

const login=(data)=>{
    localStorage.setItem("token",data.access)
    localStorage.setItem("refresh",data.refresh)
    localStorage.setItem("username",data.username)

    setUser(data.username)
}
const logout=()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("cart")
    localStorage.removeItem("refresh")
    setUser(null)
    localStorage.setItem("logout",Date.now())
    window.location.href="/login"
}

useEffect(()=>{
    const handleStorage=(event)=>{
        if(event.key==="token" || event.key==="logout"){
            const currentUser=localStorage.getItem("username")
            setUser(currentUser)
            window.location.reload()
        }
    }
    window.addEventListener("storage",handleStorage)
    return ()=> window.removeEventListener("storage",handleStorage)


},[])


return(
    <AuthContext.Provider value={{user,login,logout}}>
      {children}
    </AuthContext.Provider>
)
}