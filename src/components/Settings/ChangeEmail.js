import React, { useState, useEffect } from "react";
import Background from "../background/Background";
import Navbar from "../navbar/Navbar";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import validator from "validator";
import Backdrop from "../Backdrop/Backdrop";
const ChangeEmail = (props) => {
    const [email, setEmail] = useState(props.user.email);
    const [error, setError] = useState("");
    const [Otpsent, setOtpSent] = useState(false);
    const formSubmitted = async (e) => {
        e.preventDefault();
        if (validator.isEmail(email)) {
            const authToken = localStorage.getItem("authToken");
            props.changeFetching(true);
            let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/sendchangeemailotp", { method: "POST", body: JSON.stringify({ email: email }), headers: { "Content-Type": "application/json", "Autherization": authToken } });
            const data = await res.json();
            props.changeFetching(false);
            if (res.status === 409) {
                setError(data.error);
            }
            else if (res.status === 200) {
                props.changeOtp({ type: true, email: data.email });
                setOtpSent(true);
            }
            else {
                setError(data.error);
            }
        }
        else {
            setError("Enter a Valid Email!");
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
        <label className="settingLabel" htmlFor="email">Change Email</label>
        <div className="inputDiv">
            <input autoFocus defaultValue={props.user.email} required type="email" onChange={(e) => { setEmail(e.target.value.trim()) }} placeholder="Change Email" />
            <div className="errorDiv">{error}</div>
        </div>
        <input className="saveButton" type="submit" value="Save" />
    </form>
    return (
        <React.Fragment>
            {Otpsent ? <Redirect to="/home/settings/changeemail/verifyemail" /> :
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
        changeOtp: (value) => dispatch({
            type: "newEmail",
            prop: value,
        }),
        changeFetching: (value) => dispatch({
            type: "isFetching",
            prop: value
        })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail);