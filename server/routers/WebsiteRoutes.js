const express = require('express');
const { saveWebsiteAPI,updateWebsiteAPI,deleteWebsiteAPI} = require('../controllers/WebsiteController');
const router = express.Router();


// Routes for form operations
router.post('/website-api', saveWebsiteAPI);
router.put('/update-website-api', updateWebsiteAPI);
router.delete('/delete-website-api/:id', deleteWebsiteAPI);



module.exports = router;
