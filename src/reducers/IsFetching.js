const initialState = {
    isFetching: false
}
const FetchingReducer = (state = initialState, action) => {
    const newState = JSON.parse(JSON.stringify(state));
    if (action.type === "isFetching") {
        newState.isFetching = action.prop;
    }
    return newState;
}
export default FetchingReducer;