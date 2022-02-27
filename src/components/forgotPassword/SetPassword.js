import React, { useState, useEffect } from "react";
import Background from "../background/Background";
import Navbar from "../navbar/Navbar";
import "./ForgotPassword.css";
import validator from "validator";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Backdrop from "../Backdrop/Backdrop";
const SetPassword = (props) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordChanged, setPasswordChanged] = useState(false);
    const setNewPassword = async () => {
        setError("");
        props.changeFetching(true);
        let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/setnewpassword", { method: "PATCH", body: JSON.stringify({ email: props.otpType.forgotEmail, newPassword: password }), headers: { "Content-Type": "application/json" } });
        const data = await res.json();
        props.changeFetching(false);
        if (res.status === 200) {
            setPasswordChanged(true);
        }
        else if (res.status === 404) {
            setError(data.error);
        }
    }

    const formSubmitted = (e) => {
        e.preventDefault();
        if (validator.isStrongPassword(password, {
            minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            setNewPassword();
        }
        else {
            setError("Password must be of minimum 8 letter,1 uppercase,1 lowercase and 1 symbol");
        }
    }
    const form = <form onSubmit={formSubmitted}>
        <label htmlFor="setPassword">Set New Password</label>
        <div className="inputDiv">
            <input required onChange={(e) => { setPassword(e.target.value) }} id="setPassword" type="password" autoFocus placeholder="Set New Password" />
            <div className="errorDiv">{error}</div>
        </div>
        <input className="setPasswordButton" type="submit" value="Set Password" />
    </form>

    useEffect(() => {
        setError("");
    }, [])
    return (
        <React.Fragment>
            {passwordChanged ? <Redirect to="/login" /> :
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
        otpType: state.otpType,
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
export default connect(mapStateToProps, mapDispatchToProps)(SetPassword);