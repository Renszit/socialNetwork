var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL || "postgres:rens:social@localhost:5432/social"
);

module.exports.addRegister = (first, last, email, pass) => {
    const r = `INSERT INTO users (first,last, email, pass)
    VALUES ($1,$2,$3,$4)
    RETURNING id`;
    const param = [first, last, email, pass];
    return db.query(r, param);
};

module.exports.getHashAndEmail = (email) => {
    const k = "SELECT pass, id FROM users WHERE email = ($1)";
    const params = [email];
    return db.query(k, params);
};

module.exports.addSecretCode = (email, code) => {
    const q = `INSERT INTO reset_codes(email,code) 
    VALUES ($1, $2)
    RETURNING id `;
    const param = [email, code];
    return db.query(q, param);
};

module.exports.checkIfEmailExists = (email) => {
    const q = `SELECT * FROM users WHERE email = ($1)`;
    const param = [email];
    return db.query(q, param);
};

module.exports.checkIfCodeIsCorrect = (email, code) => {
    const q = `SELECT * FROM reset_codes
    WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes' AND email = ($1) AND code = ($2)`;
    const param = [email, code];
    return db.query(q, param);
};

module.exports.updatePassword = (pass, email) => {
    const q = `UPDATE users SET pass= ($1) WHERE email=($2)`;
    const param = [pass, email];
    return db.query(q, param);
};

module.exports.putImage = (userId, url) => {
    const q = `UPDATE users SET url = ($1) WHERE id=($2)`;
    const param = [url, userId];
    return db.query(q, param);
};

module.exports.getProfile = (userId) => {
    const q = `SELECT first, last, email, created_at, url FROM users WHERE id = ($1)`;
    const param = [userId];
    return db.query(q, param);
};
