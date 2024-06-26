import React, { useState, useEffect } from "react";
import Loader from "../../components/UI/Loader/Loader";
import styles from "./OrdersPage.module.css";
import OrderTable from "../../components/OrderTable/OrderTable";
import { getAllOrders, getProductsUsingProductIds } from "../../utils/utils";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../../config/firebase";
import { getDoc, doc } from "firebase/firestore";


const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(authSelector);
  // const navigate = useNavigate();

  const  getData= async ()=> {
    setLoading(true);
    try {  
      const docRef = doc(db, "userOrders", user?.uid);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      if(!data){
        toast.error("No orders found");
      }

      let promiseArray = [];
      data.orders.forEach((order) => {
          promiseArray.push(
            new Promise((resolve, reject)=> {
              const prodData = getProductsUsingProductIds(order);
              if(prodData) {
                resolve(prodData);
              }else {
                reject("something went wrong!");
              }
            })
          )
      });
      const finalOrders = await Promise.all(promiseArray);
      setOrders(finalOrders);
      
    } catch (error) {
        console.log(error);
    }finally{
      setLoading(false)
    }

  }

  // Fetch user orders from firestore
  useEffect(()=>{
    getData();
  }, []);



  // if user is not logged in then redirect to sign in page
  // useEffect(() => {
  //   if (!user) {
  //     return navigate("/signin");
  //   }
  // }, [user]);
 
  if (loading) {
    return <Loader />;
  }

  if (!loading && !orders.length)
    return <h1 style={{ textAlign: "center" }}>No Orders Found!</h1>;

  return (
    <div className={styles.ordersContainer}>
      <h1>Your Orders</h1>
      {orders.map((order, idx) => {
        return <OrderTable order={order} key={idx} />;
      })}
    </div>
  );
};

export default OrdersPage;
