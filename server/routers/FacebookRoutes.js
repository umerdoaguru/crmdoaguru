const express = require('express');
const { saveForm, getAllForms, fetchLeads, getLeadsByFormId, updateForm, deleteForm } = require('../controllers/FacebookController');
const router = express.Router();


// Routes for form operations
router.post('/forms', saveForm);
router.put('/updateform', updateForm);
router.delete('/deleteform/:id', deleteForm);
router.post('/forms', saveForm);
router.get('/forms', getAllForms);

// Route to fetch leads from Meta API
router.post('/leads/fetch', fetchLeads);

// Route to fetch leads by form ID
router.get('/Leads-data-fetch/:formId', getLeadsByFormId);

module.exports = router;
