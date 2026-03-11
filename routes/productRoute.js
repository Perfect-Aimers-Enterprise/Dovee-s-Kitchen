const express = require("express");
const router = express.Router();

const {
  createMenuProduct,
  getMenuProducts,
  getSingleMenuProduct,
  deleteMenuProduct,
  updateMenuProduct,
} = require("../controller/productController");
// const {menuStorage} = require('../configuration/productConfiguration')
const { menuUpload } = require("../middleWare/upload");

router.post("/createMenuProduct", menuUpload, createMenuProduct);
router.get("/getMenuProducts", getMenuProducts);
router.get("/getSingleMenuProduct/:id", getSingleMenuProduct);
router.delete("/deleteMenuProduct/:id", deleteMenuProduct);
router.patch("/updateMenuProduct/:id", updateMenuProduct);

module.exports = router;
