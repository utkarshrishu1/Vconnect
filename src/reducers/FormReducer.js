const initialState = {
    signup: {
        name: "",
        email: "",
        password: "",
        college: "",
        profession: ""
    },
    login: {
        email: "",
        password: ""
    }
};
const FormReducer = (state = initialState, action) => {
    const newState = JSON.parse(JSON.stringify(state));
    if (action.about === "signupForm") {
        if (action.type === "name") {
            newState.signup.name = action.prop;
        }
        if (action.type === "email") {
            newState.signup.email = action.prop;
        }
        if (action.type === "password") {
            newState.signup.password = action.prop;
        }
        if (action.type === "college") {
            newState.signup.college = action.prop;
        }
        if (action.type === "profession") {
            newState.signup.profession = action.prop;
        }
    }
    else if (action.about === "loginForm") {
        if (action.type === "email") {
            newState.login.email = action.prop;
        }
        if (action.type === "password") {
            newState.login.password = action.prop;
        }
    }
    return newState;
}
export default FormReducer;
