const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash } = require("./bc");
const { compare } = require("./bc");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");

app.use(
    express.json({
        extended: false,
    })
);

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    cookieSession({
        secret: `Kill them with kindness`,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 6,
    })
);

app.use(csurf());

app.use(function (req, res, next) {
    console.log("token", req.csrfToken());
    res.cookie("mytoken", req.csrfToken());
    next();
});

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
                    console.log("error in registratioooon", err);
                });
        })
        .catch((err) => {
            res.json({ error: true });
            console.log("error in registration", err);
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.getHashAndEmail(email)
        .then(({ rows }) => {
            console.log("result rows:", rows);
            const { pass: hash, id: userId } = rows[0];
            compare(password, hash).then((result) => {
                // console.log("login post result:" ,result);
                if (result) {
                    req.session.userId = userId;
                    res.json("/");
                } else {
                    res.json({ error: true });
                }
            });
        })
        .catch((err) => {
            console.log("error in login", err);
            res.json({ error: true });
        });
});

const secretCode = cryptoRandomString({
    length: 6,
});

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
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
                    console.log("error in password reset 1", err);
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.log("email does not exist", err);
            res.json({ error: true });
        });
});

app.post("/password/reset/verify", (req, res) => {
    const { code, password } = req.body;
    db.checkIfCodeIsCorrect(code).then(()=> {

    });
    //post /password/reset/verify
    // when user enters code and clicks "submit"
    // make sure the code the user enters matches the code we have stored in db
    // - make sure user entered the right code
    // - make sure the code is not expired
    // - i.e. more than 10 minutes old = expired
    // - Special SELECT query in class notes that has to be modified a little
    // then reset password
    // else render error message
    // hash password using the same hash function we used in registration route
    // UPDATE user's pass in the users table
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
