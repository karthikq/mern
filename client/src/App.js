import { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserDetails,
  loginUser,
  logout,
  registerUser,
} from "./slice/userSlice";
import queryString from "query-string";

function App() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [loginState, setLoginState] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginState) {
      dispatch(registerUser(userData));
    } else {
      dispatch(loginUser(userData));
    }
  };

  const onlogout = () => {
    dispatch(logout());
  };
  useEffect(() => {
    dispatch(getUserDetails());
  }, []);

  const { token } = queryString.parse(window.location.search);

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
      setTimeout(() => {
        dispatch(getUserDetails());
        window.history.pushState("", {}, "/");
      }, 1000);
    }
  }, [token]);

  return (
    <div className="container">
      <button onClick={() => setLoginState(!loginState)}>
        {!loginState ? "Login" : "register"}
      </button>
      <form onSubmit={handleSubmit} className="form">
        <h1>{!loginState ? "Register" : "Login"}</h1>
        {!loginState && (
          <input
            type="text"
            name="username"
            placeholder="username"
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="email"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <input
          type="text"
          name="password"
          placeholder="password"
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
        />
        <input
          type="text"
          name="city"
          placeholder="city"
          onChange={(e) => setUserData({ ...userData, city: e.target.value })}
        />

        <button>Submit</button>
      </form>
      {state.email && <p onClick={onlogout}>Logout</p>}
      {!state.email && (
        <p>
          <a href="http://localhost:5000/google/login">Google Login</a>
        </p>
      )}
    </div>
  );
}

export default App;
