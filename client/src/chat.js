import { useSelector } from "react-redux";
import { socket } from "./socket";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
// import { useRef } from "react";

export default function Chat() {
    const elemRef = useRef();
    //1. retrieve chat messages from redux and render them
    const chatMessages = useSelector((state) => state && state.messages);

    useEffect(() => {
        elemRef.current.scrollTop += 200;
        // console.log("useEffect Runs", elemRef.current.scrollTop);
    }, [chatMessages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("my new chat message", e.target.value);
            return (e.target.value = "");
        }
    };

    return (
        <div>
            <h1 className="chatH1">Chatroom</h1>
            <div ref={elemRef} className="chatContainer">
                {chatMessages &&
                    chatMessages.map((message, idx) => (
                        <div className="chatNode" key={idx}>
                            <Link to={`/user/${message.user_id}`} > <img className="chatImg" src={message.url}></img> </Link>
                            <p>
                                <strong>{message.first}</strong>:{" "}
                                {message.message}
                            </p>
                        </div>
                    ))}
            </div>
            <textarea className="chatBox" onKeyDown={handleKeyDown} />
        </div>
    );
}
