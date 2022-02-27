import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Background from "../background/Background";
import "./Question.css";
import { connect } from "react-redux";
import Backdrop from "../Backdrop/Backdrop";
const Question = (props) => {
    const [question, setQuestion] = useState(null);
    const [deleteReplyId, setDeleteReplyId] = useState("");
    const [showDeleteReplyBackdrop, setShowDeleteReplyBackdrop] = useState(false);
    const [showReplyBackdrop, setShowReplyBackdrop] = useState(false);
    const [reply, setReply] = useState("");
    const deleteReply = async () => {
        const authToken = localStorage.getItem("authToken");
        props.changeFetching(true);
        let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/deletereply/" + question._id, { method: "DELETE", body: JSON.stringify({ id: deleteReplyId }), headers: { "Content-Type": "application/json", "Autherization": authToken } });
        const data = await res.json();
        props.changeFetching(false);
        if (res.status === 200) {
            setQuestion(data.question);
        }
    }
    const replyToQues = async (e) => {
        e.preventDefault();
        if (reply !== "") {
            const authToken = localStorage.getItem("authToken");
            const date = new Date();
            const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " (" + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + ")";
            props.changeFetching(true);
            let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/replyto", { method: "POST", body: JSON.stringify({ reply: reply, id: question._id, time: time }), headers: { "Content-Type": "application/json", "Autherization": authToken } });
            const data = await res.json();
            props.changeFetching(false);
            if (res.status === 200) {
                setShowReplyBackdrop(false);
                setQuestion(data.question);
            }
            else if (res.status === 404) {
                setShowReplyBackdrop(false);
            }
        }
    }
    const replyForm = <form onSubmit={replyToQues} className="replyForm">
        <textarea onChange={(e) => { setReply(e.target.value) }} className="textArea" placeholder="Reply to Question" autoFocus />
        <div className="replyButtons">
            <input className="replyButton" type="submit" value="Reply" />
            <button onClick={() => { setShowReplyBackdrop(false) }} className="cancelReplyButton">Cancel</button>
        </div>
    </form>
    const backdropAlert = <div className="alert">
        <div className="alertType">Are you sure you want to delete this Reply?</div>
        <div className="alertButtons">
            <button onClick={() => { setShowDeleteReplyBackdrop(false); deleteReply(); }} className="confirmDeleteQuesButton">Confirm</button>
            <button onClick={() => { setDeleteReplyId(""); setShowDeleteReplyBackdrop(false) }} className="cancelDeleteQuesButton">Cancel</button>
        </div>
    </div>
    const item = question ? <div className="questionDiv">
        <div className="question">
            <div className="questionBy">
                <div className="question_name">{question.askedByName}</div>
                <div className="question_email">({question.askedByEmail})</div>
                <div className="question_time">at {question.time}</div>
            </div>
            <div className="user_profession">-{question.askedByProfession}</div>
            <div className="ques">
                {question.question}
            </div>
            <button onClick={() => { setShowReplyBackdrop(true) }} className="replyQuesButton">Reply</button>
        </div>
        <div className="allReplies">
            <fieldset>
                <legend style={{ "textAlign": "center" }}>Replies</legend>
                {
                    question.replies.length > 0 ?
                        question.replies.map((reply) => {
                            return <div key={reply._id} className="reply">
                                <div className="replyInfo">
                                    <div className="replier_name">{reply.repliedByName}</div>
                                    <div className="replier_email">({reply.repliedByEmail})</div>
                                    <div className="replier_time">at {reply.time}</div>
                                </div>
                                <div className="replier_profession">-{reply.repliedByProfession}</div>
                                <div className="rep">
                                    {reply.reply}
                                </div>
                                {reply.repliedByEmail === props.user.email ? <button onClick={() => { setDeleteReplyId(reply._id); setShowDeleteReplyBackdrop(true) }} className="deleteReplyButton">Delete</button> : null}
                            </div>
                        }) : <h3>No Replies</h3>
                }
            </fieldset>
        </div>
    </div> : null;
    useEffect(() => {
        async function func() {
            const authToken = localStorage.getItem("authToken");
            const url = window.location.pathname;
            const id = url.substring(url.lastIndexOf('/') + 1);
            props.changeFetching(true);
            let res = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + "/question/" + id, { method: "GET", headers: { "Autherization": authToken } });
            const data = await res.json();
            props.changeFetching(false);
            if (res.status === 200) {
                props.changeUser(data.user);
                setQuestion(data.question[0]);
            }
            else if (res.status === 401) {

            }
        }
        func();
    }, []);
    return (
        <React.Fragment>
            {
                showDeleteReplyBackdrop ?
                    <Backdrop item={backdropAlert} />
                    : null
            }
            {
                showReplyBackdrop ?
                    <Backdrop item={replyForm} /> : null
            }
            {
                props.fetch.isFetching ?
                    <Backdrop item={<div className="Spinner"></div>} /> : null
            }
            <Navbar />
            <Background item={item} />
        </React.Fragment>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        changeUser: (value) => dispatch({
            type: "addUser",
            prop: value
        }),
        changeFetching: (value) => dispatch({
            type: "isFetching",
            prop: value
        })
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        fetch: state.fetch
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Question);