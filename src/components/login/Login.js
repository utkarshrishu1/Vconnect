import React, { useEffect, useState } from "react";
import Background from "../background/Background";
import Navbar from "../navbar/Navbar";
import "./Login.css";
import { connect } from "react-redux";
import LoginAction from "../../actions/LoginAction";
import { Link, Redirect } from "react-router-dom";
import validator from "validator";
import Backdrop from "../Backdrop/Backdrop";
const Login = (props) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const loginSubmitted = (e) => {
        e.preventDefault();
        if (validator.isEmail(props.form.login.email))
            LogMeIn();
        else
            props.emailError("Enter a valid Email!");
    }
    const LogMeIn = async () => {
        props.changeFetching(true);
        let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/login", { method: "POST", body: JSON.stringify(props.form.login), headers: { "Content-Type": "application/json" } });
        const data = await res.json();
        props.changeFetching(false);
        if (res.status === 200) {
            localStorage.setItem("authToken", data.token);
            props.addUserDetails(data.user);
            setLoggedIn(true);
        }
        else if (res.status === 404) {
            props.emailError(data.error);
            props.passwordError("");
        }
        else if (res.status === 401) {
            props.emailError("");
            props.passwordError(data.error);
        }
    }
    useEffect(() => {
        props.emailError("");
        props.passwordError("");
    }, []);

    const form = <form className="loginForm" onSubmit={loginSubmitted}>
        <label htmlFor="email">Enter your Email</label>
        <div className="inputDiv">
            <input autoFocus onChange={(e) => { props.changeEmail(e.target.value.trim()) }} required id="email" type="email" placeholder="Enter your email" />
            <div className="errorDiv">{props.error.login.email}</div>
        </div>
        <label htmlFor="password">Enter your password</label>
        <div className="inputDiv">
            <input onChange={(e) => { props.changePassword(e.target.value) }} required id="password" type="password" placeholder="Enter your password" />
            <div className="errorDiv">{props.error.login.password}</div>
        </div>
        <Link style={{ "textDecoration": "none" }} to="/login/forgotpassword"><div className="forgotPass">Forgot Password?</div></Link>
        <input className="loginSubmit" type="submit" value="Login" />
    </form>
    return (
        <React.Fragment>
            {
                loggedIn ?
                    <Redirect to="/home" />
                    :
                    <React.Fragment>
                        {
                            props.fetch.isFetching ?
                                <Backdrop item={<div className="Spinner"></div>} /> : null
                        }
                        <Navbar />
                        <Background item={form} />
                    </React.Fragment>
            }
        </React.Fragment>
    );
}
const mapStateToProps = (state) => {
    return {
        form: state.form,
        error: state.error,
        fetch: state.fetch
    }
}
const mapDispatchToProps = (dispatch) => {
    return (LoginAction(dispatch))
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);