import express from "express";

// Creating express Router
const router = express.Router();

// Handling store request
router.get("/", (req, res, next) => {
  res.send("This is the store request");
});

module.exports = router;
