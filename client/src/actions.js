import axios from "./axios";

const BUTTON_TEXT = {
    MAKE_REQUEST: "Make Request",
    CANCEL_REQUEST: "Cancel Request",
    ACCEPT_REQUEST: "Accept Request",
    UNFRIEND: "Unfriend",
};

const ACTIONS = {
    UPDATE: "update",
    ACCEPT: "accept",
    DECLINE: "decline",
};

// REDUX

export async function getWannabes() {
    const { data } = await axios.get("/current-friendships/wannabe");
    // console.log(data);
    return {
        type: ACTIONS.UPDATE,
        users: data.users,
    };
}

export async function acceptFriend(otherUser) {
    await axios.post("/friendship-req", {
        action: BUTTON_TEXT.ACCEPT_REQUEST,
        otherUser: otherUser,
    });
    return {
        type: ACTIONS.ACCEPT,
        users: otherUser,
    };
}

export async function unfriend(otherUser) {
    await axios.post("/friendship-req", {
        action: BUTTON_TEXT.UNFRIEND,
        otherUser: otherUser,
    });

    return {
        type: ACTIONS.DECLINE,
        users: otherUser,
    };
}
