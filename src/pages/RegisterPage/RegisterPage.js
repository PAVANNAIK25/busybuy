import React, { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./RegisterPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelector, signUpAsync } from "../../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { user, loading, error } = useSelector(authSelector);
  // Input refs
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
  // If user is authenticated redirect him to home page
  const navigate = useNavigate();

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
    // dispatch(authActions.setLoading(true));
    e.preventDefault();
    const nameVal = nameRef.current.value;
    const emailVal = emailRef.current.value;
    const passwordVal = passwordRef.current.value;

    // Form validation
    if (
      emailVal === "" ||
      nameVal === "" ||
      passwordVal === "" ||
      passwordVal.length < 6
    ) {
      return toast.error("Please enter valid data!");
    }
    try {
      const payload = { email: emailRef.current.value, password: passwordRef.current.value };
      // call the signup function using redux here 
      dispatch(signUpAsync(payload));
    } catch (error) {
      toast.error(error);
    }
  };

  if(error){
    toast.error(error);
    dispatch(authActions.clearError());
  }

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <h2 className={styles.loginTitle}>Sign Up</h2>
        <input
          type="text"
          name="name"
          ref={nameRef}
          placeholder="Enter Name"
          className={styles.loginInput}
        />
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
          {loading ? "..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
