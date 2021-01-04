const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash } = require("./bc");

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

app.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password).then((hash) => {
        db.addRegister(first, last, email, hash)
            .then(({ rows }) => {
                req.session.userId = rows[0].id;
                res.json("/");
            })
            .catch((err) => {
                res.redirect("/welcome");
                console.log("error in registration", err);
            });
    });
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
