import "./Navbar.css";
const Navbar=(props)=>{
return(
    <div className="navbar">
        <div className="logo">
            Vconnect
        </div>
        {props.item}
    </div>
)
}
export default Navbar;