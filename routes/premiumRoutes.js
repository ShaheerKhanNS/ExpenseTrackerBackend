const express = require("express");
const router = express.Router();

const premiumController = require("../controllers/premiumController");

router.route("/showleaderboard").get(premiumController.showleaderboard);

module.exports = router;
