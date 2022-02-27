import "./Background.css";
import { connect } from "react-redux";
import Backdrop from "../Backdrop/Backdrop"
import React from "react";
const Background=(props)=>{
return(
    <React.Fragment>
    <div className="background">
        {props.item}
    </div>
    </React.Fragment>
);
}
const mapStateToProps=(state)=>{
    return {
        isFetching:state.fetch
    }
}
export default connect(mapStateToProps)(Background);