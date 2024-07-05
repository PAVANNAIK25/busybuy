import React, { useEffect, useState } from "react";
import Loader from "../../components/UI/Loader/Loader";
import ProductList from "../../components/Product/ProductList/ProductList";
import styles from "./CartPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { cartSelector, getUserProductsAsync, purchaseFromCartAsync } from "../../redux/reducers/cartReducer";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { user } = useSelector(authSelector);
  const { cart, loading, cartMap } = useSelector(cartSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartProducts, setCartProducts] = useState([]);
  const [purchasing, setPurchasing] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // if user is not logged in then redirect to sign in page
  useEffect(() => {
    if (!user) {
      return navigate("/signin");
    }
  }, [user])

  // Fetch all cart products for the user
  useEffect(() => {
    dispatch(getUserProductsAsync(user?.uid));
    if(!cart){
      setCartProducts([]);
    }else{
      setCartProducts(cart);
    }
  }, [])


  useEffect(() => {
    if(cartProducts.length){
      let updatedPrice = cartProducts?.reduce((acc, item) => {
        return acc + item.price * item.quantity
      }, 0);
      setTotalPrice(updatedPrice);
    }
      
  }, [cartProducts])

  useEffect(() => {
    setCartProducts(cart);
  }, [cart])

  const purchaseProductsHandler = async () => {
    setPurchasing(true);
    try {
      // Write code to purchase the item present in the cart
      // Clear the item present in the cart after successful purchase
      dispatch(purchaseFromCartAsync({ user, cart, cartMap }));
      // Redirect the user to orders page after successful purchase
      setTimeout(() => {
        navigate("/myorders");
      }, 500);
    } catch (error) {
      console.log(error);
    } finally {
      setPurchasing(false);
    }
  };


  if (loading) return <Loader />;

  return (
    <div className={styles.cartPageContainer}>
      {/*cartProduct here is the array of item present in the cart for the user yu can change this as per your need */}
      {!!cartProducts?.length && (
        <aside className={styles.totalPrice}>
          <p>TotalPrice:- ₹{totalPrice}/-</p>
          <button
            className={styles.purchaseBtn}
            onClick={purchaseProductsHandler}
          >
            {purchasing ? "Purchasing" : "Purchase"}
          </button>
        </aside>
      )}
      {!!cartProducts?.length ? (
        <ProductList products={cartProducts} onCart={true} />
      ) : (
        <h1>Cart is Empty!</h1>
      )}
    </div>
  );
};

export default CartPage;
