import io from "socket.io-client";
import {
    postNewMessage,
    addTenMostRecentMessagesToRedux,
    renewLoggedInUsers,
} from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
    socket.on("new message and user", (userAndMessage) => {
        // console.log("socket incoming!:", userAndMessage);
        store.dispatch(postNewMessage(userAndMessage));
    });

    socket.on("10 most recent messages", (recent) => {
        store.dispatch(addTenMostRecentMessagesToRedux(recent));
    });

    socket.on("update online users", (users) => {
        store.dispatch(renewLoggedInUsers(users));
    });

    socket.on("userJoined", (users) => {
        store.dispatch(renewLoggedInUsers(users));
    });
};
