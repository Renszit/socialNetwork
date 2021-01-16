import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getWannabes, acceptFriend, unfriend } from "./actions";
import { useDispatch, useSelector } from "react-redux";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) =>
            state.users && state.users.filter((user) => user.accepted == true)
    );
    const wannabe = useSelector(
        (state) =>
            state.users && state.users.filter((user) => user.accepted == false)
    );

    useEffect(() => {
        dispatch(getWannabes());
    }, []);

    if (!friends && !wannabe) {
        return null;
    }

    return (
        <div>
            <div className="membersLookupContainer">
                <strong>
                    <p>Current friends</p>
                </strong>
                <div className="userBlock">
                    {friends.map((friend, idx) => (
                        <div key={idx} className="searchImgContainer">
                            <Link to={`/user/${friend.id}`}>
                                <img src={friend.url}></img>
                                <p>
                                    {friend.first} {friend.last}
                                </p>
                            </Link>
                            <button
                                onClick={() => {
                                    dispatch(unfriend(friend.id));
                                }}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="membersLookupContainer">
                <strong>
                    <p>Friend requests</p>
                </strong>
                <div className="userBlock">
                    {wannabe.map((wannabe, idx) => (
                        <div key={idx} className="searchImgContainer">
                            <Link to={`/user/${wannabe.id}`}>
                                <img src={wannabe.url}></img>
                                <p>
                                    {wannabe.first} {wannabe.last}
                                </p>
                            </Link>
                            <button
                                onClick={() => {
                                    dispatch(acceptFriend(wannabe.id));
                                }}
                            >
                                accept request
                            </button>
                            <button
                                onClick={() => {
                                    dispatch(unfriend(wannabe.id));
                                }}
                            >
                                Decline request
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
