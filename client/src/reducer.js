const ACTIONS = {
    UPDATE: "update",
    ACCEPT: "accept",
    DECLINE: "decline",
};

export function reducer(state = {}, action) {
    if (action.type == ACTIONS.UPDATE) {
        state = {
            ...state,
            users: action.users,
        };
    } else if (action.type == ACTIONS.ACCEPT) {
        state = {
            ...state,
            accepted: true,
            users: state.users.map((userCheck) => {
                userCheck.id == action.users &&
                    (userCheck = {
                        ...userCheck,
                        accepted: true,
                    });
                console.log("usercheck:", userCheck);
                return userCheck;
            }),
        };
    } else if (action.type == ACTIONS.DECLINE) {
        state = {
            ...state,
            accepted: false,
            users: state.users.filter(
                (declineCheck) => declineCheck.id != action.users
            ),
        };
    } else if (action.type == "RECENT_MESSAGES") {
        state = {
            ...state,
            messages: action.messages,
        };
    } else if (action.type == "NEW_MESSAGE") {
        state = {
            ...state,
            messages: [...state.messages, action.userAndMessage],
        };
    } else if (action.type == "LOGGED_IN_USERS") {
        state = {
            ...state,
            online: action.online,
        };
    }
    return state;
}
