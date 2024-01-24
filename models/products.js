// ใช้งาน mongoose
const mongoose = require("mongoose");

// เชื่อมไปยัง mongoDB
const dbUrl = "mongodb://0.0.0.0:27017/productDB";
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
// .catch((err) => console.log(err));

// ออกแบบ Schema
let productSchema = mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
});

// สร้างโมเดล
let Product = mongoose.model("products", productSchema);

// ส่งออกโมเดล
module.exports = Product;

// ออกแบบฟังก์ชันสำหรับบันทึกข้อมูล
module.exports.saveProduct = async (model, data) => {
  model.save(data);
};
