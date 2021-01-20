const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const multer = require("multer");
const uidSafe = require("uid-safe");

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const dbchat = require("./dbchat");
const db = require("./db");
const { hash, compare } = require("./bc");
const { sendEmail } = require("./ses");
const s3 = require("./s3");
const { s3Url } = require("./config");
const friendships = require("./friendships");

const BUTTON_TEXT = {
    MAKE_REQUEST: "Make Request",
    CANCEL_REQUEST: "Cancel Request",
    ACCEPT_REQUEST: "Accept Request",
    UNFRIEND: "Unfriend",
};

////////////////////////////////////////////////////////////////

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname + "/uploads");
    },
    filename: (req, file, callback) => {
        uidSafe(24)
            .then((uid) => {
                callback(null, `${uid}${path.extname(file.originalname)}`);
            })
            .catch((err) => callback(err));
    },
});

const uploader = multer({
    storage,
    limits: {
        // Set a file size limit to prevent users from uploading huge files and to protect against DOS attacks
        fileSize: 2097152,
    },
});

app.use(
    express.json({
        extended: false,
    })
);

app.use(compression());

//cookiesession:
const cookieSessionMiddleware = cookieSession({
    secret: `Kill them with kindness`,
    maxAge: 1000 * 60 * 60 * 24 * 7 * 6,
});

app.use(cookieSessionMiddleware);

//socket stuff:
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password)
        .then((hash) => {
            db.addRegister(first, last, email, hash)
                .then(({ rows }) => {
                    req.session.userId = rows[0].id;
                    res.json("/");
                })
                .catch((err) => {
                    res.json({ error: true });
                    console.log(
                        "🚀 ~ file: server.js ~ line 74 ~ .then ~ err",
                        err
                    );
                });
        })
        .catch((err) => {
            console.log("🚀 ~ file: server.js ~ line 82 ~ app.post ~ err", err);
            res.json({ error: true });
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.getHashAndEmail(email)
        .then(({ rows }) => {
            const { pass: hash, id: userId } = rows[0];
            compare(password, hash).then((result) => {
                if (result) {
                    req.session.userId = userId;
                    res.json("/");
                } else {
                    res.json({ error: true });
                }
            });
        })
        .catch((err) => {
            console.log(
                "🚀 ~ file: server.js ~ line 104 ~ app.post ~ err",
                err
            );
            res.json({ error: true });
        });
});

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    const secretCode = cryptoRandomString({
        length: 6,
    });
    db.checkIfEmailExists(email)
        .then(() => {
            db.addSecretCode(email, secretCode)
                .then(() => {
                    sendEmail(
                        "renspennings@gmail.com",
                        secretCode,
                        "Here is the code to reset your password!"
                    );
                    res.json({ view: 2 });
                })
                .catch((err) => {
                    console.log(
                        "🚀 ~ file: server.js ~ line 127 ~ .then ~ err",
                        err
                    );
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.log("email does not exist", err);
            res.json({ error: true });
        });
});

app.post("/password/reset/verify", (req, res) => {
    const { code, password, email } = req.body;
    db.checkIfCodeIsCorrect(email, code)
        .then(() => {
            hash(password)
                .then((hashedpass) => db.updatePassword(hashedpass, email))
                .then(() => res.json({ view: 3 }));
        })
        .catch((err) => {
            console.log(
                "🚀 ~ file: server.js ~ line 146 ~ app.post ~ err",
                err
            );
            res.json({ error: true });
        });
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("/app/user/:id", (req, res) => {
    db.getProfile(req.params.id)
        .then(({ rows }) => {
            const { first, last, bio, url, id } = rows[0];
            res.json({
                id: id,
                first: first,
                last: last,
                bio: bio,
                url: url,
            });
        })
        .catch((err) => {
            console.log("🚀 ~ file: server.js ~ line 173 ~ app.get ~ err", err);
            res.json({
                error: true,
            });
        });
});

app.get("/profile", (req, res) => {
    const id = req.session.userId;
    db.getProfile(id)
        .then(({ rows }) => {
            const { first, last, email, bio, created_at, url } = rows[0];
            res.json({
                id: id,
                first: first,
                last: last,
                email: email,
                createdAt: created_at,
                url: url,
                bio: bio,
            });
        })
        .catch((err) => {
            console.log("🚀 ~ file: server.js ~ line 196 ~ app.get ~ err", err);
            res.json({ error: true });
        });
});

app.post("/bio", (req, res) => {
    const { draftBio } = req.body;
    db.postBio(draftBio, req.session.userId)
        .then(() => {
            res.json({ bio: draftBio });
        })
        .catch((err) => console.log("error in posting bio:", err));
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    if (req.file) {
        const image = `${s3Url}${req.file.filename}`;
        db.putImage(req.session.userId, image)
            .then(() => {
                res.json({ url: image });
            })
            .catch((err) => {
                console.log(
                    "🚀 ~ file: server.js ~ line 221 ~ app.post ~ err",
                    err
                );
            });
    } else {
        res.json({ error: true });
    }
});

app.get("/users/recent", (req, res) => {
    db.getRecentThree()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) =>
            console.log("🚀 ~ file: server.js ~ line 247 ~ app.get ~ err", err)
        );
});

app.get("/users/search", (req, res) => {
    db.searchForUsers(req.query.value)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("error in users: name", err));
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.sendStatus(200);
});

// /Friendships
app.get("/friendship-status/:id", (req, res) => {
    friendships
        .getFriendshipStatus(req.session.userId, req.params.id)
        .then(({ rows }) =>
            res.json({ rows: rows, userId: req.session.userId })
        )
        .catch((err) =>
            console.log("🚀 ~ file: server.js ~ line 285 ~ app.get ~ err", err)
        );
});

app.get("/current-friendships/wannabe", (req, res) => {
    const userId = req.session.userId;
    friendships
        .getCurrentFriends(userId)
        .then(({ rows }) => {
            res.json({ users: rows });
        })
        .catch((err) =>
            console.log(
                "🚀 ~ file: server.js ~ /current friendships -  app.get ~ err",
                err
            )
        );
});

app.post("/friendship-req", (req, res) => {
    const { action, otherUser } = req.body;
    const userId = req.session.userId;
    if (action == BUTTON_TEXT.ACCEPT_REQUEST) {
        friendships
            .friendAccept(userId, otherUser)
            .then(({ rows }) => {
                // console.log("ROWS IN FRIENDSHOIP",rows);
                res.json({ rows: rows, userId: userId });
            })
            .catch((err) => console.log("error in friendAccept query", err));
    } else if (action == BUTTON_TEXT.MAKE_REQUEST) {
        friendships
            .makeRequest(userId, otherUser)
            .then(({ rows }) => {
                res.json({ rows: rows, userId: userId });
            })
            .catch((err) => console.log("error in makeRequest query", err));
    } else if (action == BUTTON_TEXT.UNFRIEND) {
        friendships
            .unfriend(userId, otherUser)
            .then(() => {
                res.json({ rows: [], userId: userId });
            })
            .catch((err) => console.log("error in unfriending", err));
    } else if (action == BUTTON_TEXT.CANCEL_REQUEST) {
        friendships
            .cancelReq(userId, otherUser)
            .then(() => {
                res.json({ rows: [], userId: userId });
            })
            .catch((err) => console.log("error in canceling request", err));
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

//changed app for server(for socket.io)
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

let onlineUsers = {};
let arr;
//socket event listener// all (100% of the) server-side socket code will go here
io.on("connection", (socket) => {
    console.log(`socket with id ${socket.id} just connected!`);
    // const userId = socket.request.session.userId;

    // if (!userId) {
    //     return socket.disconnect(true);
    // }
    // // console.log("userId: ", userId);
    // if (Object.values(onlineUsers) != userId) {
    //     onlineUsers[socket.id] = userId;
    //     arr = Object.values(onlineUsers);
    // }
    // console.log("onlineusers variable: ", onlineUsers);
    // console.log("onlineusers array:", arr);
    // //
    // db.getOnlineUsers(arr)
    //     .then(({ rows }) => {
    //         socket.emit("update online users", rows);
    //     })
    //     .catch((err) => console.log("error in getting online users;", err));

    // socket.broadcast.emit("userJoined", () => {
    //     return arr;
    // });
    //
    // socket.on("disconnect", () => {
    //     delete onlineUsers[socket.id];
    //     return db
    //         .getOnlineUsers(arr)
    //         .then(({ rows }) => {
    //             socket.emit("update online users", rows);
    //         })
    //         .catch((err) =>
    //             console.log(
    //                 "error in getting onlne users within disconnect;",
    //                 err
    //             )
    //         );
    // });

    socket.on("my new chat message", (message) => {
        dbchat
            .insertNewMessage(socket.request.session.userId, message)
            .then(({ rows }) => {
                const messageId = rows.id;
                const messageTime = rows.timestamp;
                db.getProfile(socket.request.session.userId)
                    .then(({ rows }) => {
                        const { first, last, url } = rows[0];
                        // console.log("socket message Id, request:, ", rows);
                        io.sockets.emit("new message and user", {
                            first: first,
                            last: last,
                            message: message,
                            id: messageId,
                            url: url,
                            timestamp: messageTime,
                        });
                    })
                    .catch((err) => {
                        console.log("error in getprofile", err);
                    });
            })
            .catch((err) => {
                console.log("error inserting messages", err);
            });
    });

    dbchat.getTenMostRecentMessages().then(({ rows }) => {
        socket.emit("10 most recent messages", rows);
    });
});
