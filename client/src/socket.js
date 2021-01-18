import io from "socket.io-client";
import { postNewMessage, addTenMostRecentMessagesToRedux } from "./actions";

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
};
