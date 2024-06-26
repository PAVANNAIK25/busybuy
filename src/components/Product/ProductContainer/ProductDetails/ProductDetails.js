import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./ProductDetails.module.css";
import MinusIcon from "../../../UI/Icons/MinusIcon";
import PlusIcon from "../../../UI/Icons/PlusIcon";
import { addToCartAsync, cartSelector, decreaseQuantityAsync, removeProductAsync, updateQuantity } from "../../../../redux/reducers/cartReducer";
import { authSelector } from "../../../../redux/reducers/authReducer";
import Loader from "../../../UI/Loader/Loader";

const ProductDetails = ({ title, price, productId, onCart, quantity }) => {
  const [productAddingToCart, setProductAddingToCart] = useState(false);
  const [productRemovingFromCart, setProductRemovingCart] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const { loading } = useSelector(cartSelector);
  const navigate = useNavigate();


  const addProductToCart = async () => {
    // Function to add product to cart
    if(!user){
      navigate("/signin");
    }

    setProductAddingToCart(true);
    try {
      const payload = {
        user: user.uid,
        productId
      }
      quantity += 1;
      dispatch(addToCartAsync(payload));
    } catch (err) {
      console.log(err);
    } finally {
      setProductAddingToCart(false);
    }

  };

  // Function to remaove the cart
  const removeProduct = async () => {
    setProductRemovingCart(true);
    try {
      const payload = {
        user: user.uid,
        productId
      }
      dispatch(removeProductAsync(payload));
    } catch (err) {
      console.log(err);
    } finally {
      setProductRemovingCart(false);
    }

  };

  // Function for Handling the product quantity increase
  const handleAdd = async () => {
    const payload = {
      user: user.uid,
      productId
    }
    dispatch(addToCartAsync(payload));

  };

  // Handling the product quantity decrease
  const handleRemove = async () => {
    const payload = {
      user: user.uid,
      productId
    }
    dispatch(decreaseQuantityAsync(payload));
  };

  if (loading) {
    <Loader />
  }

  return (
    <div className={styles.productDetails}>
      <div className={styles.productName}>
        <p>{`${title?.slice(0, 35)}...`}</p>
      </div>
      <div className={styles.productOptions}>
        <p>₹ {price}</p>
        {onCart && (
          <div className={styles.quantityContainer}>
            <MinusIcon handleRemove={handleRemove} />
            {quantity}
            <PlusIcon handleAdd={handleAdd} />
          </div>
        )}
      </div>
      {/* Conditionally Rendering buttons based on the screen */}
      {!onCart ? (
        <button
          className={styles.addBtn}
          title="Add to Cart"
          disabled={productAddingToCart}
          onClick={addProductToCart}
        >
          {productAddingToCart ? "Adding" : "Add To Cart"}
        </button>
      ) : (
        <button
          className={styles.removeBtn}
          title="Remove from Cart"
          onClick={() => removeProduct(productId)}
        >
          {productRemovingFromCart ? "Removing" : "Remove From Cart"}
        </button>
      )}
    </div>
  );
};

export default ProductDetails;
