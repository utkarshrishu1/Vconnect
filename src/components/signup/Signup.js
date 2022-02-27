import "./Signup.css";

import React, { useEffect, useState } from "react";
import validator from "validator";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Background from "../background/Background";
import Navbar from "../navbar/Navbar";
import SignupAction from "../../actions/SignupAction.js";
import Backdrop from "../Backdrop/Backdrop";

const Signup = (props) => {

    const [colleges, setColleges] = useState([]);
    const [verify, setVerify] = useState(false);

    const formSubmitted = (e) => {
        e.preventDefault();
        if (validator.isEmail(props.form.signup.email)) {
            if (validator.isStrongPassword(props.form.signup.password, {
                minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
            })) {
                props.passwordError("");
                Signup();
            }
            else {
                props.passwordError("Password must be of minimum 8 letter,1 uppercase,1 lowercase and 1 symbol");
            }
        }
        else {
            props.emailError("Enter a valid Email!");
        }
    }

    const Signup = async () => {
        props.changeFetching(true);
        let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + '/signupotp', {
            method: "POST", body: JSON.stringify(props.form.signup), headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        props.changeFetching(false);
        if (res.status === 200) {
            props.changeOtpType(true);
            setVerify(true);
        }
        else {
            props.emailError(data.error);
        }
    }

    useEffect(() => {
        props.emailError("");
        props.passwordError("");
        async function func() {
            props.changeFetching(true);
            let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/colleges", { method: "GET" });
            const data = await res.json();
            props.changeFetching(false);
            setColleges(data);
        }
        func();
    }, []);

    const form =
        <form onSubmit={formSubmitted} className="signupForm">

            <label htmlFor="name">Enter your Name:</label>
            <div className="inputDiv">
                <input onChange={(e) => { props.changeName(e.target.value.trim()) }} required autoFocus id="name" placeholder="Enter your Name" />
                <div className="errorDiv"></div>
            </div>

            <label htmlFor="email">Enter your Email:</label>
            <div className="inputDiv">
                <input onChange={(e) => { props.changeEmail(e.target.value.trim()) }} required id="email" type="email" placeholder="Enter you Email" />
                <div className="errorDiv">{props.error.signup.email}</div>
            </div>

            <label htmlFor="password">Enter your Password:</label>
            <div className="inputDiv">
                <input onChange={(e) => { props.changePassword(e.target.value) }} required id="password" type="password" placeholder="Enter your password" />
                <div className="errorDiv">{props.error.signup.password}</div>
            </div>

            <label htmlFor="college">Select your college:</label>
            <select required onChange={(e) => { props.changeCollege(e.target.value) }} defaultValue="" id="college">
                <option hidden value="">Select your College</option>
                {colleges.map((data) => {
                    return (<option key={data} value={data}>{data}</option>)
                })}
            </select>

            <label htmlFor="profession">Select your Profession:</label>
            <select required onChange={(e) => { props.changeProfession(e.target.value) }} defaultValue="" id="profession">
                <option hidden value="">Select your profession</option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
            </select>

            <input className="signupSubmit" type="submit" value="Signup" />
        </form>
    return (
        <React.Fragment>
            {verify ? <React.Fragment>
                <Redirect to="/signup/verify" />
            </React.Fragment> :
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
        error: state.error,
        form: state.form,
        otpType: state.otpType,
        fetch: state.fetch
    }
}
const mapDispatchToProps = (dispatch) => {
    return SignupAction(dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);