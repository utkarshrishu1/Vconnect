import React, { useEffect, useState } from "react";
import Background from "../background/Background";
import Navbar from "../navbar/Navbar";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Backdrop from "../Backdrop/Backdrop";
const ChangeProfession = (props) => {
    const [colleges, setColleges] = useState([]);
    const [college, setCollege] = useState(props.user.college);
    const [collegeChanged, setCollegeChanged] = useState(false);
    const formSubmitted = async (e) => {
        e.preventDefault();
        const authToken = localStorage.getItem("authToken");
        props.changeFetching(true);
        let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/changecollege", { method: "PATCH", body: JSON.stringify({ college: college }), headers: { "Content-Type": "application/json", "Autherization": authToken } });
        props.changeFetching(false);
        if (res.status === 200) {
            setCollegeChanged(true);
        }
        else {
            setCollegeChanged(true);
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
            props.changeFetching(true);
            let res1 = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/colleges", { method: "GET" });
            const data1 = await res1.json();
            props.changeFetching(false);
            setColleges(data1);
        }
        fetchUser();
    }, []);
    const form = <form onSubmit={formSubmitted}>
        <label className="settingLabel" htmlFor="college">Change your college</label>
        <select required onChange={(e) => { setCollege(e.target.value) }} defaultValue={college} id="college">
            <option hidden value="">{college}</option>
            {colleges.map((data) => {
                return (<option key={data} value={data}>{data}</option>)
            })}
        </select>
        <input className="saveButton" type="submit" value="Save" />
    </form>
    return (
        <React.Fragment>
            {collegeChanged ? <Redirect to="/home" /> :
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