const express = require('express');
const router = express.Router();
const { CreatUser,LoginUser,CurrentUser } = require("../controller/userController")
const validateToken = require("../middleware/validateTokenhandler")

router.route("/create").post(CreatUser);

router.route("/login").post(LoginUser);

router.get("/current", validateToken ,CurrentUser);
module.exports = router;