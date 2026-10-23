import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [isSignIn, setIsSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, []);

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  // After successful register, switch to sign-in
  useEffect(() => {
    if (authState.isSuccess && !authState.loggedIn && !isSignIn) {
      setIsSignIn(true);
    }
  }, [authState.isSuccess]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [isSignIn]);

  const handleSubmit = () => {
    if (isSignIn) {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(registerUser({ username, password, email, name }));
    }
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.cardleft__heading}>{isSignIn ? "Sign In" : "Sign Up"}</p>
            <p style={{ color: authState.isError ? "red" : "green" }}>{authState.message}</p>

            <div className={styles.inputContainers}>
              {!isSignIn && (
                <div className={styles.inputRow}>
                  <input onChange={(e) => setUsername(e.target.value)} className={styles.inputField} type="text" placeholder="Username" />
                  <input onChange={(e) => setName(e.target.value)} className={styles.inputField} type="text" placeholder="Name" />
                </div>
              )}
              <input onChange={(e) => setEmail(e.target.value)} className={styles.inputField} type="email" placeholder="Email" />
              <input onChange={(e) => setPassword(e.target.value)} className={styles.inputField} type="password" placeholder="Password" />

              <div onClick={handleSubmit} className={styles.buttonWithOutline}>
                <p>{isSignIn ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer__right}>
            <p>{isSignIn ? "Don't have an account?" : "Already have an account?"}</p>
            <div onClick={() => setIsSignIn(!isSignIn)} style={{ color: "black", textAlign: "center" }} className={styles.buttonWithOutline}>
              <p>{isSignIn ? "Sign Up" : "Sign In"}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;