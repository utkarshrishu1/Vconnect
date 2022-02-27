import React, { useState } from "react";
import Background from "../background/Background";
import Navbar from "../navbar/Navbar";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Backdrop from "../Backdrop/Backdrop";
const VerifyChangeEmailOtp = (props) => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [emailChanged, setEmailChanged] = useState(false);
    const verifyOtp = async (e) => {
        e.preventDefault();
        const authToken = localStorage.getItem("authToken");
        props.changeFetching(true);
        let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/verifychangeemailotp", { method: "PATCH", body: JSON.stringify({ otp: otp, email: props.otp.newEmail }), headers: { "Content-Type": "application/json", "Autherization": authToken } });
        const data = await res.json();
        props.changeFetching(false);
        if (res.status === 200) {
            setEmailChanged(true);
        }
        else {
            setError(data.error);
        }
    }
    const form = <form onSubmit={verifyOtp}>
        <label htmlFor="otp">Verify Email</label>
        <div className="inputDiv">
            <input id="otp" onChange={(e) => { setOtp(e.target.value) }} autoFocus required maxLength='5' minLength='5' placeholder="Enter Otp" />
            <div className="errorDiv">{error}</div>
        </div>
        <input className="verifyButton" type="submit" value="Verify" />
    </form>
    return (
        <React.Fragment>{
            emailChanged ? <Redirect to="/home" /> :
                <React.Fragment>
                    {
                        props.fetch.isFetching ?
                            <Backdrop item={<div className="Spinner"></div>} /> : null
                    }
                    <Navbar />
                    <Background item={form} />
                </React.Fragment>}
        </React.Fragment>
    );
}
const mapStateToProps = (state) => {
    return {
        otp: state.otpType,
        fetch: state.fetch
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changeFetching: (value) => dispatch({
            type: "isFetching",
            prop: value
        })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(VerifyChangeEmailOtp);