import {  createContext, useContext, useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import API from "../api/axios";
import { AuthContext } from "./AuthContext";

export const CartContext=createContext()


export const CartProvider=({children})=>{

    const navigate=useNavigate()
    const {user} =useContext(AuthContext)
     const [cart,setCart]=useState(
        JSON.parse(localStorage.getItem("cart"))||[]
     )


    useEffect(()=>{
        if(!user){
        setCart([])
        localStorage.removeItem("cart")
        return;
        }
        const getCart=async ()=>{
            try{
                const res= await API.get("/cart/")
                setCart(res.data)
            }
            catch(err){
                console.log(err);
                setCart([])
                
            }
        }
        getCart()
},[user])
    
    useEffect(()=>{
        localStorage.setItem("cart",JSON.stringify(cart))
    },[cart])
    useEffect(()=>{
        const handleStorage=(event)=>{
            if(event.key==="cart"){
                const updatedCart=
                JSON.parse(localStorage.getItem("cart"))||[]
                setCart(updatedCart)
            }
        }
        window.addEventListener("storage",handleStorage);
        return()=>window.removeEventListener("storage",handleStorage)
    },[])

    const addTocart= async (product)=>{
        if(!user){
  Swal.fire({
    title: "Error!",
    text: "Please login to continue",
    icon: "error",
    confirmButtonText: "OK"
  })
  .then((result)=>{
    if(result.isConfirmed){
        navigate("/login")
    }
  })
  return
 }
   if(product.stock===0){
     toast.warn("Out of Stock")
     return
   }
   const existingItem=cart.find(item=>item.product===product.id)
   if(existingItem && existingItem.quantity>=product.stock){
    toast.warn("Stock limit reached")
    return
   }
  
  try{
    const res= await API.post("/cart/add/",{
        "product_id":product.id
    })

    const newItem=res.data
    setCart(prev=>{
        const existing = prev.find(item=>item.product===newItem.product)
        if (existing){
            return prev.map(item=>
                item.product===newItem.product ? newItem : item
            )
        }
        return [...prev,newItem]
    })
    toast.success("Item added to cart")
    
  }
  catch(err){
    console.log(err);
    
  }
   
        
       
    }

    const RemoveTask= async(id)=>{
        const result= await Swal.fire({
            title:"Remove item?",
            text :"Do you want to remove this item from the cart?",
            icon:"warning",
            showCancelButton:true,
            confirmButtonColor:"#d33",
            cancelButtonColor:"#6c757d",
            confirmButtonText:"Yes, remove it"
        });

        if(!result.isConfirmed){
            return
        }
       try{
        await API.delete(`/cart/remove/${id}/`)
        setCart(prev=>prev.filter(curr=>curr.id!==id))
        Swal.fire("Removed!", "Item removed from cart.", "success");
       }
       catch(err){
        console.log(err);
        Swal.fire("Error", "Failed to remove item.", "error");
        
       }
    }

    const IncreaseQty= async (id)=>{
      const item= cart.find((curr)=>curr.id===id)
      if(!item) return

      if(item.quantity>=item.stock){
        toast.warn("Maximum stock reached")
        return
      }
       try{
        await API.patch(`/cart/update/${id}/`,{
            "quantity":item.quantity+1
        })
       
        setCart((prev)=>
            prev.map((curr)=>
                curr.id===id ? {...curr, quantity:curr.quantity+1} :curr
            )
        )
    }
    catch(err){
        console.log(err);
        
    } 
        
    }

    const DecreaseQty= async (id)=>{
         const item= cart.find((curr)=>curr.id===id)
      if(!item) return;

        if(item.quantity===1){
            RemoveTask(id)
            return
        }
         
        try{
            await API.patch(`/cart/update/${id}/`,{
                "quantity":item.quantity-1
            })

            setCart(prev=>
                prev.map(curr=>
                    curr.id===id
                    ? {...curr,quantity:curr.quantity-1}
                    :curr
                )
            )
        }
        catch(err){
            console.log(err);
            
        }

        

    }

    const BuySingleProduct= async (product)=>{
        
       if (!user){
        Swal.fire({
            title:"Error!",
            text:"Please login to continue",
            icon:"error",
            confirmButtonText: "OK"
        })
        .then((result)=>{
            if(result.isConfirmed){
                navigate('/login')
            }
        });
        return;
        
       }


       try{
        const res= await API.post("/orders/buy-now/",{
            "product_id":product.product || product.id,
            "quantity":product.quantity
        })
    setCart(prev=>prev.filter(item=>item.id!==product.id))
        navigate(`/payment/${res.data.order_id}`)
       }
       catch(err){
        console.log(err);
        Swal.fire({
            title:"Error!",
            text:"Order creation failed",
            icon:"error"
        });
        
       }


       
    }

    const PayForAll= async ()=>{
        if(!user){
            Swal.fire({
                title:"Error!",
                text:"Please login to continue",
                icon:"error"
            }).then((result)=>{
                if(result.isConfirmed){
                    navigate("/login")
                }
            })
            return
        }
        try{
            const res=await API.post("/orders/create/")
            const order_id=res.data.order_id
            navigate(`/payment/${order_id}`)
        }
        catch(err){
            console.log(err);
            toast.error("Failed to create order")
            
        }
   
       
    }


    return(
        <CartContext.Provider value={{addTocart,cart,RemoveTask,IncreaseQty,DecreaseQty,BuySingleProduct,PayForAll,setCart}}>
            {children}
        </CartContext.Provider>
    )
}

