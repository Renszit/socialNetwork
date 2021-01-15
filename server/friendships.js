var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL || "postgres:rens:social@localhost:5432/social"
);

module.exports.getFriendshipStatus = (sender_id, recipient_id) => {
    const q = `SELECT * 
    FROM friendships 
    WHERE (sender_id = $1 AND recipient_id = $2)
    OR (sender_id = $2 AND recipient_id = $1)`;
    const param = [sender_id, recipient_id];
    return db.query(q, param);
};

module.exports.friendAccept = (userId, otherUserId) => {
    const q = `UPDATE friendships SET accepted = TRUE 
    WHERE (sender_id = $1 AND recipient_id = $2) 
    OR (recipient_id = $1 AND sender_id = $2) `;
    const param = [userId, otherUserId];
    return db.query(q, param);
};

module.exports.makeRequest = (userId, otherUserId) => {
    const q = `INSERT INTO friendships (sender_id, recipient_id) VALUES ($1, $2) RETURNING *`;
    const param = [userId, otherUserId];
    return db.query(q, param);
};

module.exports.unfriend = (userId, otherUserId) => {
    const q = `DELETE FROM friendships 
    WHERE (sender_id = $1 AND recipient_id = $2) 
    OR (recipient_id = $1 AND sender_id = $2) `;
    const param = [userId, otherUserId];
    return db.query(q, param);
};

module.exports.cancelReq = (userId, otherUserId) => {
    const q = `DELETE FROM friendships 
    WHERE (sender_id = $1 AND recipient_id = $2) 
    OR (recipient_id = $1 AND sender_id = $2)`;
    const param = [userId, otherUserId];
    return db.query(q, param);
};

module.exports.getCurrentFriends = (userId) => {
    const q = `SELECT users.id, first, last, url, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`;
    const param = [userId];
    return db.query(q, param);
};
