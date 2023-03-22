const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mixmeet",
});
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("db conn successful(main service)");
  }
});
db.query(
  "CREATE TABLE IF NOT EXISTS users(user_id INT NOT NULL AUTO_INCREMENT, username VARCHAR(100), email VARCHAR(200), password VARCHAR(255), image_link VARCHAR(255) DEFAULT NULL , image_type VARCHAR(10), bio VARCHAR(255), PRIMARY KEY (user_id))"
);

db.query(
  "CREATE TABLE IF NOT EXISTS  posts(post_id INT NOT NULL AUTO_INCREMENT, post_message VARCHAR(255), post_image_link VARCHAR(255) DEFAULT NULL , PRIMARY KEY(post_id) )"
);

db.query(
  "CREATE TABLE IF NOT EXISTS comments(comment_id INT NOT NULL AUTO_INCREMENT, comment_message VARCHAR(255),comment_image_link VARCHAR(255) DEFAULT NULL, PRIMARY KEY (comment_id) ) "
);
