const express = require("express");
const multer = require("multer");
const {  getResponses } = require("../controllers/99AcresController");
const router = express.Router();




  router.get("/get-responses",getResponses);



  module.exports = router;