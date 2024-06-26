import React, { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./LoginPage.module.css";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelector, signInAsync } from "../../redux/reducers/authReducer";

const LoginPage = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { user, loading, error } = useSelector(authSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // If user is authenticated redirect him to home page
  useEffect(() => {
    if (user) {
      navigate("/");
    }
    if (error) {
      toast.error(error);
      dispatch(authActions.clearError());
    }
  }, [user])


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const emailVal = emailRef.current.value;
    const passwordVal = passwordRef.current.value;
    // Form validation
    if (emailVal === "" || passwordVal === "" || passwordVal.length < 6) {
      return toast.error("Please enter valid data!");
    }
    // write function here to login the user using redux

    const payload = { email: emailRef.current.value, password: passwordRef.current.value };
    dispatch(signInAsync(payload));

  };

  if(error){
    toast.error(error);
    dispatch(authActions.clearError());
  }

  return (
    <>
      {/*If some error occurs display the error*/}
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={onSubmitHandler}>
          <h2 className={styles.loginTitle}>Sign In</h2>
          <input
            type="email"
            name="email"
            ref={emailRef}
            className={styles.loginInput}
            placeholder="Enter Email"
          />
          <input
            type="password"
            name="password"
            ref={passwordRef}
            className={styles.loginInput}
            placeholder="Enter Password"
          />
          <button className={styles.loginBtn}>
            {loading ? "..." : "Sign In"}
          </button>
          <NavLink
            to="/signup"
            style={{
              textDecoration: "none",
              color: "#224957",
              fontFamily: "Quicksand",
            }}
          >
            <p style={{ fontWeight: "600", margin: 0 }}>Or SignUp instead</p>
          </NavLink>
        </form>
      </div>
    </>
  );
};

export default LoginPage;