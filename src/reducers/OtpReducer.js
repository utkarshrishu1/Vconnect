const initialState = {
    forgotPassword: false,
    signup: false,
    forgotEmail: "",
    changeEmail: true,
    newEmail: ""
}
const OtpReducer = (state = initialState, action) => {
    let newState = JSON.parse(JSON.stringify(state));
    if (action.type === "forgotPassword") {
        newState.forgotPassword = action.prop.type;
        newState.forgotEmail = action.prop.email;
    }
    else if (action.type === "signup") {
        newState.signup = action.prop;
    }
    else if (action.type === "newEmail") {
        newState.changeEmail = action.prop.type;
        newState.newEmail = action.prop.email;
    }
    return newState;
}
export default OtpReducer;