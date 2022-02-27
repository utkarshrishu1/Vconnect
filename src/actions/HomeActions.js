const HomeActions=(dispatch)=>{
    return{
       changeQuestions:(value)=>dispatch({
           type:"addQuestions",
           prop:value
       }),
       changeUser:(value)=>dispatch({
           type:"addUser",
           prop:value
       }),
       changeFetching:(value)=>dispatch({
           type:"isFetching",
           prop:value
       })
    }
}
export default HomeActions;