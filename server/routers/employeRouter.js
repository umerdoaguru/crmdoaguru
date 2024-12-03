const express = require("express");
const multer = require("multer");
const {
  getEmployeeInvoice,
  employeeProfile,
  getEmployeeLeads,
  updateLeadStatus,
  getEmployeeQuotation,
  updateOnlyLeadStatus,
  updateOnlyQuotationStatus,
  getAllEmployeeTotalLeads,
  getLeadQuotation,
  getEmployeeVisit,
  createVisit,
  updateVisit,
  deleteVisit,
  getEmployeebyidvisit,
  AllgetEmployeebyvisit,
  updateOnlyVisitStatus,
  updateFollow_Up,
  deleteFollow_Up,
  createFollow_Up,
  getEmployeeFollow_Up,
  updateOnlyFollowUpStatus,
} = require("../controllers/employeController");
const router = express.Router();

router.get("/get-employee-invoice/:id", getEmployeeInvoice);
router.get("/employeeProfile/:id", employeeProfile);
router.get("/employe-leads/:id", getEmployeeLeads);
router.get("/employebyid-visit/:id", getEmployeebyidvisit);
router.get("/employe-all-visit", AllgetEmployeebyvisit);
router.put("/updateVisitStatus/:id", updateOnlyVisitStatus);

router.get("/employe-visit/:id", getEmployeeVisit);
router.put('/employe-visit', updateVisit);           
router.delete('/employe-visit/:id', deleteVisit); 
router.post("/employe-visit", createVisit);

router.get("/employe-follow-up/:id", getEmployeeFollow_Up);
router.put('/employe-follow-up', updateFollow_Up);           
router.delete('/employe-follow-up/:id', deleteFollow_Up); 
router.post("/employe-follow-up", createFollow_Up);
router.put("/updateOnlyFollowUpStatus/:id", updateOnlyFollowUpStatus);



router.put("/updateLeadStatus/:id", updateLeadStatus);
router.put("/updateOnlyLeadStatus/:id", updateOnlyLeadStatus);
router.put("/updateOnlyQuotationStatus/:id", updateOnlyQuotationStatus);
router.get("/get-quotation-byEmploye/:id", getEmployeeQuotation);
router.get("/get-quotation-byLead/:id", getLeadQuotation);
router.get("/getAllEmployee-Toal-lead", getAllEmployeeTotalLeads);

module.exports = router;
