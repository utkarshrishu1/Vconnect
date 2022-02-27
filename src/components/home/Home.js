import "./Home.css";
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import Background from "../background/Background";
import { connect } from "react-redux";
import HomeActions from "../../actions/HomeActions";
import { Redirect, Link } from "react-router-dom";
import Backdrop from "../Backdrop/Backdrop";
const Home = (props) => {
    const [showOptions, setShowOptions] = useState(false);
    const [showingOptions, setShowingOptions] = useState(false);
    const [nothingFound, setNothingFound] = useState("Nothing Found!");
    const [loggedOut, setLoggedOut] = useState(false);
    const [showAskQuesBackdrop, setShowAskQuesBackdrop] = useState(false);
    const [question, setQuestion] = useState("");
    const [myQuesSelected, setMyQuesSelected] = useState(false);
    const [showDeleteQuesBackdrop, setShowDeleteQuesBackdrop] = useState(false);
    const [showlogoutBackdrop, setShowlogoutBackdrop] = useState(false);
    const [deleteQuesId, setDeleteQuesId] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [showReplyBackdrop, setShowReplyBackdrop] = useState(false);
    const [dontShow, setDontShow] = useState(true);
    const [reply, setReply] = useState("");
    const [replyToQuesId, setReplyToQuesId] = useState("");
    const [search, setSearch] = useState("");
    let style = {}
    if (!showOptions && !showingOptions) {
        style = { display: "none" }
    }
    const deleteAlert = <div className="alert">
        <div className="alertType">Are you sure you want to delete this Question?</div>
        <div className="alertButtons">
            <button onClick={() => { setShowDeleteQuesBackdrop(false); deleteQuestion(); }} className="confirmDeleteQuesButton">Confirm</button>
            <button onClick={() => { setDeleteQuesId(""); setShowDeleteQuesBackdrop(false) }} className="cancelDeleteQuesButton">Cancel</button>
        </div>
    </div>
    const logoutAlert = <div className="alert">
        <div className="alertType">Are you sure you want Logout?</div>
        <div className="alertButtons">
            <button onClick={() => { logout() }} className="confirmDeleteQuesButton">Confirm</button>
            <button onClick={() => { setShowlogoutBackdrop(false); }} className="cancelDeleteQuesButton">Cancel</button>
        </div>
    </div>
    const askQuestion = async (e) => {
        e.preventDefault();
        if (question !== "") {
            const authToken = localStorage.getItem("authToken");
            const date = new Date();
            const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " (" + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + ")";
            props.changeFetching(true);
            let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/askquestion", { method: "POST", body: JSON.stringify({ question: question, time: time, getMyQues: myQuesSelected }), headers: { "Content-Type": "application/json", "Autherization": authToken } });
            const data = await res.json();
            props.changeFetching(false);
            if (res.status === 200) {
                props.changeQuestions(data.questions);
            }
            setShowAskQuesBackdrop(false);
        }
    }
    const replyToQues = async (e) => {
        e.preventDefault();
        if (reply !== "") {
            const authToken = localStorage.getItem("authToken");
            const date = new Date();
            const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " (" + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + ")";
            props.changeFetching(true);
            let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/reply", { method: "POST", body: JSON.stringify({ reply: reply, id: replyToQuesId, time: time, getMyQues: myQuesSelected }), headers: { "Content-Type": "application/json", "Autherization": authToken } });
            const data = await res.json();
            props.changeFetching(false);
            if (res.status === 200) {
                setShowReplyBackdrop(false);
                props.changeQuestions(data.questions);
            }
            else if (res.status === 400) {
                setRedirect(true);
                setShowReplyBackdrop(false);
            }
            else if (res.status === 404) {
                setShowReplyBackdrop(false);
            }
        }
    }
    const askQuestionForm = <form onSubmit={askQuestion} className="askQuesForm">
        <textarea onChange={(e) => { setQuestion(e.target.value) }} className="textArea" placeholder="Ask Your Question" autoFocus />
        <div className="askQuesButtons">
            <input className="askButton" type="submit" value="Ask" />
            <button onClick={() => { setShowAskQuesBackdrop(false) }} className="cancelButton">Cancel</button>
        </div>
    </form>
    const replyForm = <form onSubmit={replyToQues} className="replyForm">
        <textarea onChange={(e) => { setReply(e.target.value) }} className="textArea" placeholder="Reply to Question" autoFocus />
        <div className="replyButtons">
            <input className="replyButton" type="submit" value="Reply" />
            <button onClick={() => { setShowReplyBackdrop(false) }} className="cancelReplyButton">Cancel</button>
        </div>
    </form>
    const FetchAllQuestions = async () => {
        const authToken = localStorage.getItem("authToken");
        props.changeFetching(true);
        let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/getallquestions", { method: "GET", headers: { "Autherization": authToken } });
        const data = await res.json();
        props.changeFetching(false);
        if (res.status === 200) {
            props.changeQuestions(data.questions);
            props.changeUser(data.user);
        }
        else if (res.status === 404) {
            props.changeQuestions([]);
            setNothingFound(data.error);
            props.changeUser(data.user);
        }
        else if (res.status === 400) {
            localStorage.removeItem("authToken");
            setRedirect(true);
        }
    }
    const FetctMyQuestions = async () => {
        const authToken = localStorage.getItem("authToken");
        props.changeFetching(true);
        let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/getmyquestions", { method: "GET", headers: { "Autherization": authToken } });
        const data = await res.json();
        props.changeFetching(false);
        if (res.status === 200)
            props.changeQuestions(data.questions);
        else if (res.status === 404) {
            props.changeQuestions([]);
            setNothingFound(data.error);
            props.changeUser(data.user);
        }
    }
    const FetchSearchedQuestions = async () => {
        if (search !== "") {
            const authToken = localStorage.getItem("authToken");
            props.changeFetching(true);
            let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/search", { method: "POST", body: JSON.stringify({ search: search, getMyQues: myQuesSelected }), headers: { "Content-Type": "application/json", "Autherization": authToken } });
            const data = await res.json();
            props.changeFetching(false);
            if (res.status === 200)
                props.changeQuestions(data.questions);
            else if (res.status === 404) {
                props.changeQuestions([]);
            }
            else if (res.status === 400)
                setRedirect(true);
        }
    }
    const SelectQuestionType = (e) => {
        if (e.target.value === "All") {
            setMyQuesSelected(false);
            FetchAllQuestions();
        }
        else if (e.target.value === "My") {
            setMyQuesSelected(true);
            FetctMyQuestions();
        }
    }
    const deleteQuestion = async () => {
        const authToken = localStorage.getItem("authToken");
        props.changeFetching(true);
        let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/deletequestion", { method: "DELETE", body: JSON.stringify({ id: deleteQuesId, getMyQues: myQuesSelected }), headers: { "Content-Type": "application/json", "Autherization": authToken } });
        const data = await res.json();
        props.changeFetching(false);
        if (res.status === 200) {
            props.changeQuestions(data.questions);
        }
    }
    const logout = async () => {
        const authToken = localStorage.getItem("authToken");
        props.changeFetching(true);
        let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/logout", { method: "GET", headers: { "Autherization": authToken } });
        const data = await res.json();
        props.changeFetching(false);
        if (res.status === 200) {
            localStorage.removeItem("authToken");
            setShowlogoutBackdrop(false);
            setLoggedOut(true);
        }
        else if (res.status === 400) {
            setShowlogoutBackdrop(false);
            setRedirect(true);
        }
    }
    useEffect(() => {
        async function func() { await FetchAllQuestions(); }
        func();
    }, []);
    const page = <div className="outer">
        <div style={style} onMouseOver={() => { setShowOptions(true); setShowingOptions(true) } }
         onMouseOut={() => { setShowOptions(false); setShowingOptions(false) }}
          className="options">
            <div onClick={() => { props.history.push("/home/settings") }}>Settings</div>
            <div onClick={() => { setShowlogoutBackdrop(true) }}>Logout</div>
        </div>
        <div className="askBar">
            <div className="search">
                <input onChange={(e) => { setSearch(e.target.value.trim()) }} className="searchInput" placeholder="Search" type="search" />
                <button onClick={FetchSearchedQuestions} className="searchButton">Search</button>
            </div>
            <div className="filterDiv">
                <label htmlFor="filter">Filter:</label>
                <select onChange={SelectQuestionType} className="quesTypes" id="filter">
                    <option value="All">All Questions</option>
                    <option value="My">My Questions</option>
                </select>
            </div>
            <button onClick={() => { setShowAskQuesBackdrop(true) }} className="askQuesButton">Ask Question</button>
        </div>
        <div className="questions">
            {
                props.questions.questions.length > 0 ?
                    props.questions.questions.map((question) => {
                        return <div key={question._id} className="question">
                            <div className="questionBy">
                                <div className="question_name">{question.askedByName}</div>
                                <div className="question_email">({question.askedByEmail})</div>
                                <div className="question_time">at {question.time}</div>
                            </div>
                            <div className="user_profession">-{question.askedByProfession}</div>
                            <div className="ques">
                                {question.question}
                            </div>
                            <div>
                                <button onClick={() => { setReplyToQuesId(question._id); setShowReplyBackdrop(true) }} className="replyQuesButton">Reply</button>
                                <Link to={"/home/question/" + question._id}><button className="viewReplies" >View</button></Link>
                                {question.askedByEmail === props.user.email ? <button onClick={() => { setDeleteQuesId(question._id); setShowDeleteQuesBackdrop(true) }} className="deleteQuesButton">Delete</button> : null}
                            </div>
                        </div>
                    }) : <h3 style={{ "textAlign": "center" }}>{nothingFound}</h3>
            }
        </div>
    </div>
    const user = <div className="navbarItem"><div onMouseOver={() => { setShowOptions(true) }} onMouseOut={() => {
        setTimeout(() => {
            if (window.location.href.endsWith("/home")&&!showingOptions)
                setShowOptions(false);
        }, 500)
    }} className="profile"></div></div>
    return (
        <React.Fragment>
            {redirect || loggedOut ? <Redirect to="/" /> :
                <React.Fragment>
                    {showAskQuesBackdrop ?
                        <Backdrop item={askQuestionForm} /> : null
                    }
                    {
                        showDeleteQuesBackdrop ?
                            <Backdrop item={deleteAlert} /> : null
                    }
                    {
                        showlogoutBackdrop ?
                            <Backdrop item={logoutAlert} /> : null
                    }
                    {
                        showReplyBackdrop ?
                            <Backdrop item={replyForm} /> : null
                    }
                    {
                        props.fetch.isFetching ?
                            <Backdrop item={<div className="Spinner"></div>} /> : null
                    }
                    <Navbar item={user} />
                    <Background item={page} />
                </React.Fragment>
            }
        </React.Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        questions: state.questions,
        user: state.user,
        fetch: state.fetch
    }
}
const mapDispatchToProps = (dispatch) => {
    return HomeActions(dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);