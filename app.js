const express = require("express");
const router = require("./routes/myRouter");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "mysession", resave: false, saveUninitialized: false }));
app.use(router);
app.use(express.static(path.join(__dirname, "k-shop templates")));

app.listen(8080, () => {
  console.log(`start server at port 8080`);
})