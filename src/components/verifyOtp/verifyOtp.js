import React, { useState, useEffect } from "react";
import Background from "../background/Background";
import Navbar from "../navbar/Navbar";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import "./verifyOtp.css";
import Backdrop from "../Backdrop/Backdrop";
const VerifyOtp = (props) => {
    const [userCreated, setUserCreated] = useState(false);
    const [newPassword, setNewPassword] = useState(false);
    const [otp, setOtp] = useState(0);
    const [error, setError] = useState("");

    const formSubmitted = (e) => {
        e.preventDefault();
        VerifyOtp();
    }
    useEffect(() => {
        setError("");
    }, []);
    const form = <form onSubmit={formSubmitted}>
        <label htmlFor="otp">Verify your Email</label>
        <div className="inputDiv">
            <input id="otp" onChange={(e) => { setOtp(e.target.value) }} autoFocus required maxLength='5' minLength='5' placeholder="Enter Otp" />
            <div className="errorDiv">{error}</div>
        </div>
        <input className="verifyButton" type="submit" value="Verify" />
    </form>
    const VerifyOtp = async () => {
        if (props.otpType.signup === true) {
            props.changeFetching(true);
            let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/verifyotp", { method: "POST", body: JSON.stringify({ email: props.form.signup.email, otp: otp, user: props.form.signup }), headers: { 'Content-Type': 'application/json' } });
            const data = await res.json();
            props.changeFetching(false);
            if (res.status === 200) {
                setUserCreated(true);
                props.changeOtpTypeOfSignUp();
            }
            else if (res.status === 406 || res.status === 400) {
                setError(data.error);
            }
        } else if (props.otpType.forgotPassword === true) {
            props.changeFetching(true);
            let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/forgotpasswordotpverify", { method: "POST", body: JSON.stringify({ email: props.otpType.forgotEmail, otp: otp }), headers: { "Content-Type": "application/json" } });
            const data = await res.json();
            props.changeFetching(false);
            if (res.status === 200) {
                setNewPassword(true);
                props.changeOtpTypeOfPassword({ type: false, email: props.otpType.forgotEmail });
            }
            else if (res.status === 406 || res.status === 400) {
                setError(data.error);
            }
        }
    }
    return (
        <React.Fragment>
            {userCreated ? <Redirect to="/login" /> : newPassword ? <Redirect to="/login/forgotpassword/setpassword" /> :
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
    )
}
const mapStateToProps = (state) => {
    return {
        form: state.form,
        otpType: state.otpType,
        fetch: state.fetch
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changeOtpTypeOfSignUp: () => dispatch({
            type: "signup",
            prop: false
        }),
        changeOtpTypeOfPassword: (value) => dispatch({
            type: "forgotPassword",
            prop: value
        }),
        changeFetching: (value) => dispatch({
            type: "isFetching",
            prop: value
        })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(VerifyOtp);