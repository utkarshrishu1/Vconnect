const initialState = {
    questions: []
}
const QuesReducer = (state = initialState, action) => {
    const newState = JSON.parse(JSON.stringify(state));
    if (action.type === "addQuestions") {
        newState.questions = action.prop;
    }
    return newState;
}
export default QuesReducer;