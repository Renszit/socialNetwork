const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
const { s3Url } = require("./config");

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

app.use(
    cookieSession({
        secret: `Kill them with kindness`,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 6,
    })
);

app.use(csurf());

app.use(function (req, res, next) {
    // console.log("token", req.csrfToken());
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

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    const secretCode = cryptoRandomString({
        length: 6,
    });
    db.checkIfEmailExists(email)
        .then(() => {
            db.addSecretCode(email, secretCode)
                .then(() => {
                    // console.log("result of pw reset:", result);
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
    const { code, password, email } = req.body;
    db.checkIfCodeIsCorrect(email, code)
        .then(() => {
            hash(password)
                .then((hashedpass) => db.updatePassword(hashedpass, email))
                .then(() => res.json({ view: 3 }));
        })
        .catch(() => {
            res.json({ error: true });
            // console.log("error in verify:", err);
        });
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
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
            console.error("error in profile get ", err);
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
            .then(
                () => {
                    res.json({ url: image });
                }
                // (singleImage.id = result.rows[0].id)
            )
            .catch((err) => {
                "posterror:", err;
            });
    } else {
        res.json({ error: true });
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
