import { useSelector } from "react-redux";

export default function OnlineUsers() {
    // const dispatch = useDispatch();
    const online = useSelector((state) => state.online);

    if (!online) {
        return null;
    }

    return (
        <div>
            <h1>Online users:</h1>
            {online.map((online, idx) => (
                <div className="onlineNode" key={idx}>
                    <img className="onlineImg" src={online.url}></img>
                    <p>{online.first}</p>
                </div>
            ))}
        </div>
    );
}
