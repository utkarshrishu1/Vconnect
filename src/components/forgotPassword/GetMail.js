import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import Background from "../background/Background";
import "./ForgotPassword.css";
import validator from "validator";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Backdrop from "../Backdrop/Backdrop";
const GetMail = (props) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const sendOtp = async () => {
        setError("");
        props.changeFetching(true);
        let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/forgotpasswordotp", { method: "POST", body: JSON.stringify({ email: email }), headers: { "Content-Type": "application/json" } });
        const data = await res.json();
        props.changeFetching(false);
        if (res.status === 404) {
            setError(data.error);
        }
        else if (res.status === 200) {
            props.changeOtpType({ type: true, email: email });
            setSuccess(true);
        }
    }
    const formSubmitted = (e) => {
        e.preventDefault();
        if (!validator.isEmail(email)) {
            setError("Enter a valid Email!");
        }
        else {
            sendOtp();
        }
    }
    useEffect(() => {
        setError("");
    }, []);
    const form = <form onSubmit={formSubmitted}>
        <label htmlFor="email">Enter your Email</label>
        <div className="inputDiv">
            <input onChange={(e) => { setEmail(e.target.value.trim()) }} id="email" type="email" required autoFocus placeholder="Enter your Email" />
            <div className="errorDiv">{error}</div>
        </div>
        <input className="getOtp" type="submit" value="Get Otp" />
    </form>
    return (
        <React.Fragment>
            {success ? <Redirect to="/login/forgotpassword/verifyemail" /> :
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
        fetch: state.fetch
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changeOtpType: (value) => dispatch({
            type: "forgotPassword",
            prop: value
        }),
        changeFetching: (value) => dispatch({
            type: "isFetching",
            prop: value
        })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GetMail);