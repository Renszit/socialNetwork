DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS friendships;


CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL,
      last VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      pass VARCHAR(255) NOT NULL,
      bio VARCHAR,
      url VARCHAR,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships (
id SERIAL PRIMARY KEY,
sender_id INT REFERENCES users(id) NOT NULL,
recipient_id INT REFERENCES users(id) NOT NULL,
accepted BOOLEAN DEFAULT false
);

DROP TABLE IF EXISTS chat_messages;

CREATE TABLE chat_messages (
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id) NOT NULL,
message VARCHAR NOT NULL,
timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat_messages (user_id, message) VALUES ('1', 'hi');
INSERT INTO chat_messages (user_id, message) VALUES ('34', 'hey!');
INSERT INTO chat_messages (user_id, message) VALUES ('90', 'Hello Yaallll');