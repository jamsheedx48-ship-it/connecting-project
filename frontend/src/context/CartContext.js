import {  createContext, useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';

export const CartContext=createContext()


export const CartProvider=({children})=>{

    const navigate=useNavigate()
    const userId= localStorage.getItem("userid")
     const [cart,setCart]=useState([])
    useEffect(()=>{
        if(!userId) return;

     fetch(`https://json-server-ecommerce-t2t5.onrender.com/cart?userId=${userId}`)
     .then((res)=>res.json())
     .then((data)=>setCart(data))
},[userId])
   

    const addTocart=(p)=>{
        if(!userId){
  Swal.fire({
    title: "Error!",
    text: "Please login to continue",
    icon: "error",
    confirmButtonText: "OK"
  });

            navigate("/login")
            return
        }
        toast.success("Item added to cart")
        
         const exist=cart.find((curr)=>curr.id===p.id)

         if(exist){
            fetch(`https://json-server-ecommerce-t2t5.onrender.com/cart/${exist.id}`,{
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({qty:exist.qty+1})
            })
            
            .then(()=>{
               
               setCart(prev=>
                prev.map(curr=>
                    curr.id===exist.id
                    ?{...curr,qty:curr.qty+1} :curr

                
                )
                
               )
            })
            
            
            

         }
         else{
            fetch("https://json-server-ecommerce-t2t5.onrender.com/cart",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({
                    ...p,
                    qty:1,
                    userId:userId
                })
            }) 
            .then((res)=>res.json())
            .then(newItem=>{
                setCart(prev => [...prev, newItem]);
            })
         }
        
       
    }

    const RemoveTask=(id)=>{
        fetch(`https://json-server-ecommerce-t2t5.onrender.com/cart/${id}`,{
            method:"DELETE"
        })
     .then(()=>{
          setCart((prev)=>prev.filter((curr)=>curr.id!==id))
     })
    }

    const IncreaseQty=(id)=>{
      const item= cart.find((curr)=>curr.id===id)
      if(!item) return;
       fetch(`https://json-server-ecommerce-t2t5.onrender.com/cart/${id}`,{
            method:"PATCH",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({qty:item.qty+1})
        })
        setCart((prev)=>
            prev.map((curr)=>
                curr.id===id ? {...curr, qty:curr.qty+1} :curr
            )
        )
        
    }

    const DecreaseQty=(id)=>{
         const item= cart.find((curr)=>curr.id===id)
      if(!item) return;

        if(item.qty===1){
            fetch(`https://json-server-ecommerce-t2t5.onrender.com/cart/${id}`,{
                method:"DELETE"
            })
        }
         
        fetch(`https://json-server-ecommerce-t2t5.onrender.com/cart/${id}`,{
            method:"PATCH",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({qty: item.qty-1})
        })

        setCart((prev)=>
        prev
        .map((curr)=>
            curr.id===id ? {...curr,qty:curr.qty-1} : curr

        )
         .filter((curr)=>curr.qty>0)
        )

    }

    const BuySingleProduct=(product)=>{
       
        
       const userId=localStorage.getItem("userid")

       const OrderData={
        userId:userId,
        items:[product],
        total:product.price*product.qty,
        status:"pending",
        date: new Date().toISOString(),
       }

        if(!userId){
            Swal.fire({
    title: "Error!",
    text: "Please login to continue",
    icon: "error",
    confirmButtonText: "OK"
  });
            navigate("login")
            return;
        }
        

       fetch("https://json-server-ecommerce-t2t5.onrender.com/orders",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(OrderData)
       })
       .then((res)=>res.json())
       .then((data)=>{
        
        fetch(`https://json-server-ecommerce-t2t5.onrender.com/cart/${product.id}`,{
            method:"DELETE"
        })
        setCart((prev)=>prev.filter((curr)=>curr.id!==product.id))
        navigate(`/payment/${data.id}`)
       })
       
    
        
       

       
       
    }

    const PayForAll=()=>{
        const userId=localStorage.getItem("userid");

        const TotalPrice=cart.reduce((acc,curr)=>{
           return acc=acc+curr.price*curr.qty
        },0)

        const OrderData={
            userId:userId,
            items:cart,
            total:TotalPrice,
            status:"pending",
           date: new Date().toISOString()
        };

        fetch("https://json-server-ecommerce-t2t5.onrender.com/orders",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(OrderData)
        })
        .then((res)=>res.json())
        .then((data)=>{
            cart.forEach((curr)=>{
            fetch(`https://json-server-ecommerce-t2t5.onrender.com/cart/${curr.id}`,{
                method:"DELETE",
            })
            setCart([]);
            navigate(`/payment/${data.id}`)
            })
        })

        
       
    }


    return(
        <CartContext.Provider value={{addTocart,cart,RemoveTask,IncreaseQty,DecreaseQty,BuySingleProduct,PayForAll}}>
            {children}
        </CartContext.Provider>
    )
}

