// จัดการ Routing
const express = require("express");
const router = express.Router();

// เรียกใช้งาน Model
const Product = require("../models/products");

// อัพโหลดไฟล์
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./k-shop templates/images/products"); // ตำแหน่งที่จัดเก็บไฟล์
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg"); // เปลี่ยนชื่อไฟล์ ป้องกันชื่อซ้ำกัน
  },
});

// เริ่มต้นอัพโหลด
const upload = multer({
  storage: storage,
});

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.render("index", { products: products });
});

router.get("/add-product", (req, res) => {
  // if (req.cookies.login) {
  //   res.render("form");
  // } else {
  //   res.render("admin");
  // }
  if (req.session.login) {
    res.render("form");
  } else {
    res.render("admin");
  }
});

router.get("/manage", async (req, res) => {
  // if (req.cookies.login) {
  //   const manage = await Product.find();
  //   res.render("manage", { manage: manage });
  // } else {
  //   res.render("admin");
  // }
  // console.log("sesion ID = ", req.sessionID);
  // console.log("ข้อมูลใน sesion = ", req.session);
  if (req.session.login) {
    const manage = await Product.find();
    res.render("manage", { manage: manage });
  } else {
    res.render("admin");
  }
});

router.get("/delete/:id", async (req, res) => {
  // console.log(req.params.id);
  await Product.findByIdAndDelete(req.params.id, { useFindAndModify: false });
  res.redirect("/manage");
});

// ออกจากระบบ
router.get("/logout", async (req, res) => {
  // console.log("test logout");
  // res.clearCookie("username");
  // res.clearCookie("password");
  // res.clearCookie("login");
  // res.render("/manage")
  req.session.destroy((err) => {
    res.redirect("/manage");
  });
});

router.post("/insert", upload.single("image"), async (req, res) => {
  // console.log(req.file);
  let data = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.file.filename,
    description: req.body.description,
  });
  // console.log(data);
  await Product.saveProduct(data);
  res.redirect("/");
});

router.get("/:id", async (req, res) => {
  // console.log(req.params.id);
  const products_id = req.params.id;
  const products = await Product.findOne({ _id: products_id });
  res.render("product", { products: products });
});

router.post("/edit", async (req, res) => {
  const edit_id = req.body.edit_id;
  const editId = await Product.findOne({ _id: edit_id });
  res.render("edit", { editId: editId });
});

router.post("/update", async (req, res) => {
  const update_id = req.body.update_id;
  let data = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  };
  // console.log(data);
  await Product.findByIdAndUpdate(update_id, data, { useFindAndModify: false });
  res.redirect("/manage");
});

// เข้าสู่ระบบ
router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const timeExpire = 30000; // 30 วินาที
  // if (username === "admin" && password === "1234") {
  //   // สร้างคุกกี้
  //   res.cookie("username", username, { maxAge: timeExpire });
  //   res.cookie("password", password, { maxAge: timeExpire });
  //   res.cookie("login", true, { maxAge: timeExpire }); // true => login เข้าสู่ระบบ
  //   res.redirect("/manage");
  // } else {
  //   res.render("404");
  // }

  if (username === "admin" && password === "1234") {
    // สร้าง session
    req.session.username = username;
    req.session.password = password;
    req.session.login = true;
    req.session.cookie.maxAge = timeExpire;
    res.redirect("/manage");
  } else {
    res.render("404");
  }
});

module.exports = router;
