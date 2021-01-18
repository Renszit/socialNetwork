import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    //1. retrieve chat messages from redux and render them
    const chatMessages = useSelector((state) => state && state.messages);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            socket.emit("my new chat message", e.target.value);
        }
    };

    return (
        <div>
            <h1 className="chatH1">Chatroom</h1>
            <div className="chatContainer">
                {chatMessages &&
                    chatMessages.map((message) => (
                        <div className="chatNode" key={message.id}>
                            <img className="chatImg" src={message.url}></img>
                            <p>
                                {message.first} {message.last} :{" "}
                                <strong>{message.message}</strong>
                            </p>
                        </div>
                    ))}
                <textarea onKeyDown={handleKeyDown} />
            </div>
        </div>
    );
}
