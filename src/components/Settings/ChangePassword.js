import React, { useState, useEffect } from "react";
import Background from "../background/Background";
import Navbar from "../navbar/Navbar";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import validator from "validator";
import Backdrop from "../Backdrop/Backdrop";
const ChangePassword = (props) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordChanged, setPasswordChanged] = useState(false);
    const formSubmitted = async (e) => {
        e.preventDefault();
        if (validator.isStrongPassword(password, {
            minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            const authToken = localStorage.getItem("authToken");
            props.changeFetching(true);
            let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/changepassword", { method: "PATCH", body: JSON.stringify({ password: password }), headers: { "Content-Type": "application/json", "Autherization": authToken } });
            const data = await res.json();
            props.changeFetching(false);
            if (res.status === 200) {
                setPasswordChanged(true);
            }
            else {
                setError(data.error);
            }
        }
        else {
            setError("Password must be of minimum 8 letter,1 uppercase,1 lowercase and 1 symbol");
        }
    }
    useEffect(() => {
        async function fetchUser() {
            const authToken = localStorage.getItem("authToken");
            props.changeFetching(true);
            let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/getuser", { method: "GET", headers: { "Autherization": authToken } });
            const data = await res.json();
            props.changeFetching(false);
            if (res.status === 200) {
                props.changeUser(data.user);
            }
            else {

            }
        }
        fetchUser();
    }, []);
    const form = <form onSubmit={formSubmitted}>
        <label className="settingLabel" htmlFor="password">Change Password</label>
        <div className="inputDiv">
            <input autoFocus required type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Change Password" />
            <div className="errorDiv">{error}</div>
        </div>
        <input className="saveButton" type="submit" value="Save" />
    </form>
    return (
        <React.Fragment>
            {passwordChanged ? <Redirect to="/home" /> :
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
        user: state.user,
        fetch: state.fetch
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changeUser: (value) => dispatch({
            type: "addUser",
            prop: value
        }),
        changeFetching: (value) => dispatch({
            type: "isFetching",
            prop: value
        })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);