import React from "react";
import Background from "../background/Background";
import Navbar from "../navbar/Navbar";
import "./Setting.css";
import { Link } from "react-router-dom";
const Setting = () => {
    const item = <div className="setting">
        <Link to="/home/settings/changename"><button className="settingButton">Change Name</button></Link>
        <Link to="/home/settings/changeemail"><button className="settingButton">Change Email</button></Link>
        <Link to="/home/settings/changepassword"><button className="settingButton">Change passsword</button></Link>
        <Link to="/home/settings/changeprofession"><button className="settingButton">Change Profession</button></Link>
        <Link to="/home/settings/changecollege"><button className="settingButton">Change College</button></Link>
    </div>
    return (
        <React.Fragment>
            <Navbar />
            <Background item={item} />
        </React.Fragment>
    )
}
export default Setting;