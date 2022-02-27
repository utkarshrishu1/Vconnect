const initialState = {
    name: "",
    email: "",
    profession: "",
    college: ""
}
const UserReducer = (state = initialState, action) => {
    let newState = JSON.parse(JSON.stringify(state));
    if (action.type === "addUser") {
        newState = action.prop
    }
    return newState;
}
export default UserReducer;