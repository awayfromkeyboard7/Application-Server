const router = require("express").Router();
const judge = require("./judge");
const problem = require("./problem");

router.use("/judge", judge);
router.post("/", (req, res) => {
  res.status(200).json(req.body);
});

router.use("/problem", problem);

module.exports = router;
