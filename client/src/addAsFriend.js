import axios from "./axios";
import { useState, useEffect } from "react";

const BUTTON_TEXT = {
    MAKE_REQUEST: "Make Request",
    CANCEL_REQUEST: "Cancel Request",
    ACCEPT_REQUEST: "Accept Request",
    UNFRIEND: "Unfriend",
};

export default function AddAsFriend({ id }) {
    const otherUserId = Number(id);
    const [button, setButton] = useState("");

    // useEffect(() => {
    //     axios.get(`/friendship-status/${otherUserId}`).then(({ data }) => {
    //         console.log("data addasfriend::", data);
    //     });
    // }, [otherUserId]);

    // function handleClick() {
    //     axios
    //         .post("/friendship-req", {
    //             action: button,
    //             otherUserId: otherUserId,
    //         })
    //         .then(({ data }) => {
    //             setButton(data.changeButton);
    //         })
    //         .catch((err) => {
    //             console.error(`error on friendship req `, err);
    //         });
    // }

    return (
        <div>
            <button onClick={handleClick}>{button}</button>
        </div>
    );
}
