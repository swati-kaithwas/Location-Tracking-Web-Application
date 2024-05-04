var express = require("express");
var router = express.Router();
const usercontroller = require("../controller/user.controller");
/* GET users listing. */
router.use((req, res, next) => {
  console.log(
    "TEST ROUTE: " + req.originalUrl + "::" + new Date().toISOString()
  );
  next();
});
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/register", usercontroller.register);
router.post("/signin", usercontroller.signin);
router.get("/getalluser", usercontroller.findusers);
router.post("/getuserloacation", usercontroller.userlocation);
router.post("/getboundryalert/:userId", usercontroller.getboundary);

module.exports = router;
