import axios from "./axios";
import { useState, useEffect } from "react";

const BUTTON_TEXT = {
    MAKE_REQUEST: "Make Request",
    CANCEL_REQUEST: "Cancel Request",
    ACCEPT_REQUEST: "Accept Request",
    UNFRIEND: "Unfriend",
};

export default function AddAsFriend({ otherUserId }) {
    const otherUser = Number(otherUserId);
    const [button, setButton] = useState("");
    // const [status, setStatus] = useState("");

    useEffect(() => {
        axios.get(`/friendship-status/${otherUser}`).then(({ data }) => {
            // console.log("data useeffect:", data.rows);
            // console.log("userId", data.userId);
            const buttonText = buttonTextAdapt(data);
            setButton(buttonText);
            // setStatus(data.rows);
        });
    }, [otherUserId]);

    function handleClick() {
        axios
            .post("/friendship-req", {
                // status: status,
                action: button,
                otherUser: otherUser,
            })
            .then(({ data }) => {
                console.log("data handleclick:,", data);
                const result = buttonTextAdapt(data);
                setButton(result);
            })
            .catch((err) => {
                console.error(`error on friendship req `, err);
            });
    }

    return (
        <div>
            <button onClick={handleClick}>{button}</button>
        </div>
    );
}

function buttonTextAdapt(status) {
    let text = BUTTON_TEXT.MAKE_REQUEST;
    console.log("status buttontext reqeus", status);

    if (!status.rows.length == 0) {
        console.log("status rows:", status);
        const { sender_id, accepted } = status.rows[0];
        const userId = status.userId;
        console.log("userId:", userId);
        if (accepted) {
            text = BUTTON_TEXT.UNFRIEND;
            return text;
        } else if (sender_id == userId) {
            text = BUTTON_TEXT.CANCEL_REQUEST;
            return text;
        } else {
            text = BUTTON_TEXT.ACCEPT_REQUEST;
            return text;
        }
    }
    return text;
}
