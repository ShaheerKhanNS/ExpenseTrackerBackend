const express = require("express");
const router = express.Router();
const premiumController = require("../controllers/premiumController");
const authController = require("../controllers/authController");

router
  .route("/premiummembership")
  .get(authController.whichUser, premiumController.getPremiumMemebership);

router
  .route("/premiummembership")
  .post(authController.whichUser, premiumController.updateTransactionDetail);
module.exports = router;
