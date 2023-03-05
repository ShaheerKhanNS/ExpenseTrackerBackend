const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");
const authController = require("../controllers/authController");

router
  .route("/premiummembership")
  .get(authController.whichUser, purchaseController.getPremiumMemebership)
  .post(authController.whichUser, purchaseController.updateTransactionDetail);

module.exports = router;
