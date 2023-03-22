const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const multer = require("multer");

const app = express();

require("./services/main");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: true,
  })
);
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mixmeet",
});

// multer js code
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/images/profiles");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  if (req.session.user) {
    res.render("home", { user: req.session.user });
  } else {
    res.render("index");
  }
});

app.get("/sign-in", (req, res) => {
  res.render("sign-in");
});

app.get("/sign-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});
app.post("/sign-in", (req, res) => {
  // confirm that email is registered
  // compare passwords with hash in database
  db.query(
    "SELECT email,password FROM users WHERE email =?",
    [req.body.email],
    (err, result) => {
      // handle error
      if (result.length > 0) {
        // proceed to compare password
        bcrypt.compare(req.body.password, result[0].password, (err, match) => {
          if (match) {
            req.session.user = result[0];
            res.redirect("/");
          } else {
            res.render("sign-in", {
              error: true,
              errorMessage: "Incorrect email or password",
            });
          }
        });
      } else {
        res.render("sign-up", {
          error: true,
          errorMessage: "Email not registered",
        });
      }
    }
  );
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});
app.post("/sign-up", upload.single("image"), (req, res) => {
  // get data-body-parser
  // check if confirm password is same as password
  //check if email is existing
  // encrypt password / create a hash
  let fileType = req.file.mimetype.slice(req.file.mimetype.indexOf("/" + 1));
  // console.log(req.file);
  //  console.log(req.body);
  if (req.body.password === req.body.confirm) {
    // proceed to next page
    db.query(
      "SELECT email  FROM users WHERE email = ?",
      [req.body.email],
      (err, result) => {
        if (result.length > 0) {
          // email already exists in the database
          res.render("sign-up", {
            error: true,
            errorMessage: "Email already exists. use another login",
          });
        } else {
          // proceed
          bcrypt.hash(req.body.password, 4, function (err, hash) {
            // we have hashed the password
            db.query(
              "INSERT INTO users(username,email,password,image_link,image_type,bio) values(?,?,?,?,?,?)",
              [
                req.body.username,
                req.body.email,
                hash,
                req.file.filename,
                fileType,
                req.body.bio,
              ],
              (error) => {
                //end
                if (error) {
                  res.render("sign-up", {
                    error: true,
                    errorMessage: "contact server",
                  });
                } else {
                  res.redirect("/sign-in"); // successful sign-up
                }
              }
            );
          });
        }
      }
    );
  } else {
    res.render("sign-up", {
      error: true,
      errorMessage: "Passwords and confirm password don't match",
    });
  }
});

app.listen(3001, () => {
  console.log("app running!!...");
});
