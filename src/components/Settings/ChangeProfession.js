import React, { useEffect, useState } from "react";
import Background from "../background/Background";
import Navbar from "../navbar/Navbar";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Backdrop from "../Backdrop/Backdrop";
const ChangeProfession = (props) => {
    const [profession, setProfession] = useState(props.user.profession);
    const [professionChanged, setProfessionChanged] = useState(false);
    const formSubmitted = async (e) => {
        e.preventDefault();
        const authToken = localStorage.getItem("authToken");
        props.changeFetching(true);
        let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/changeprofession", { method: "PATCH", body: JSON.stringify({ profession: profession }), headers: { "Content-Type": "application/json", "Autherization": authToken } });
        props.changeFetching(false);
        if (res.status === 200) {
            setProfessionChanged(true);
        }
        else {
            setProfessionChanged(true);
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
        <label className="settingLabel" htmlFor="profession">Change Profession</label>
        <select required onChange={(e) => { setProfession(e.target.value) }} defaultValue={props.user.profession} id="profession">
            <option hidden value="">{props.user.profession}</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
        </select>
        <input className="saveButton" type="submit" value="Save" />
    </form>
    return (
        <React.Fragment>
            {professionChanged ? <Redirect to="/home" /> :
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
export default connect(mapStateToProps, mapDispatchToProps)(ChangeProfession);