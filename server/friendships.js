var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL || "postgres:rens:social@localhost:5432/social"
);

module.exports.getFriendshipStatus = (sender_id, recipient_id) => {
    const q = `SELECT * 
    FROM friendships 
    WHERE (sender_id = ($1) AND recipient_id = ($2))
    OR (sender_id = ($2) AND recipient_id = ($1)) `;
    const param = [sender_id, recipient_id];
    return db.query(q, param);
};
