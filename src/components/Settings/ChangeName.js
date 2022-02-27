import React, { useState, useEffect } from "react";
import Background from "../background/Background";
import Navbar from "../navbar/Navbar";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Backdrop from "../Backdrop/Backdrop";
const ChangeName = (props) => {
    const [name, setName] = useState(props.user.name);
    const [error, setError] = useState("");
    const [nameChanged, setNameChanged] = useState(false);
    const formSubmitted = async (e) => {
        e.preventDefault();
        const authToken = localStorage.getItem("authToken");
        props.changeFetching(true);
        let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/changename", { method: "PATCH", body: JSON.stringify({ name: name }), headers: { "Content-Type": "application/json", "Autherization": authToken } });
        const data = await res.json();
        props.changeFetching(false);
        if (res.status === 200) {
            setNameChanged(true);
        }
        else {
            setError(data.error);
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
        <label className="settingLabel" htmlFor="name">Change Name</label>
        <div className="inputDiv">
            <input autoFocus required defaultValue={props.user.name} onChange={(e) => { setName(e.target.value.trim()) }} placeholder="Change name" />
            <div className="errorDiv">{error}</div>
        </div>
        <input className="saveButton" type="submit" value="Save" />
    </form>
    return (
        <React.Fragment>
            {nameChanged ? <Redirect to="/home" /> :
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
export default connect(mapStateToProps, mapDispatchToProps)(ChangeName);