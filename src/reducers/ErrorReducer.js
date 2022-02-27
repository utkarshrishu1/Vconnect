const initialState = {
    signup: {
        email: "",
        password: ""
    },
    login: {
        email: "",
        password: ""
    }
}
const ErrorReducer = (state = initialState, action) => {
    const newState = JSON.parse(JSON.stringify(state));
    if (action.about === "signupError") {
        if (action.type === "password") {
            newState.signup.password = action.prop;
        }
        else if (action.type === "email") {
            newState.signup.email = action.prop;
        }
    }
    else if (action.about === "loginError") {
        if (action.type === "email") {
            newState.login.email = action.prop;
        }
        else if (action.type === "password") {
            newState.login.password = action.prop;
        }
    }
    return newState;
};
export default ErrorReducer;
