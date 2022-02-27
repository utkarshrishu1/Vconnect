import React from "react";
import "./Welcome.css";
import Navbar from "../navbar/Navbar";
import { Link, Redirect } from "react-router-dom";
import Background from "../background/Background";
const Welcome = () => {
  const authToken = localStorage.getItem("authToken");
  let loggedIn = null;
  if (authToken && authToken !== "") {
    loggedIn = <Redirect to="/home" />
  }
  const navbarDiv = <div className="navbarItem">
    <Link to="/signup"><button className="signupButton">SignUp</button></Link>
    <Link to="/login"><button className="loginButton">Login</button></Link>
  </div>
  const backgroundDiv = <React.Fragment>
    <h1 className="bgHeading1">Let's Connect</h1>
    <h3 className="bgHeading2">Ask your Doubts here...</h3>
  </React.Fragment>
  return (
    <React.Fragment>
      {loggedIn !== null ? loggedIn :
        <React.Fragment>
          <Navbar item={navbarDiv} />
          <Background item={backgroundDiv} />
        </React.Fragment>
      }
    </React.Fragment>
  );
}
export default Welcome;