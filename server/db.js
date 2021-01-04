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
