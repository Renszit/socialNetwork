var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL || "postgres:rens:social@localhost:5432/social"
);

module.exports.getTenMostRecentMessages = () => {
    const q = `SELECT chat_messages.id, chat_messages.message, chat_messages.timestamp, users.url, users.first, users.last 
    FROM chat_messages 
    JOIN users 
    ON chat_messages.user_id = users.id 
    ORDER BY chat_messages.id DESC
    LIMIT 10 `;
    return db.query(q);
};

module.exports.insertNewMessage = (userId, message) => {
    const q = `INSERT INTO chat_messages(user_id, message)
    VALUES ($1, $2)
    RETURNING id, timestamp`;
    const params = [userId, message];
    return db.query(q, params);
};
