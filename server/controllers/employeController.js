const { db } = require("../db");

const getEmployeeInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM  
                        invoice_data 
                        JOIN  invoice_services_data ON invoice_data.invoice_id = invoice_services_data.invoice_id 
                        WHERE  invoice_data.employeeId = ?`;

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });

    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const getEmployeeLeads = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM leads WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const updateOnlyLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { lead_status } = req.body;

    console.log(lead_status, id);

    const sql = `UPDATE leads SET 
    lead_status = ?
                    
    WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [lead_status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Lead updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};


const updateOnlyQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotation } = req.body;

    console.log(quotation, id);

    const sql = `UPDATE leads SET 
    quotation = ?
    
    WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [quotation, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Quotation Status updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};





const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      lead_status,
      quotation_status,

      deal_status,

      booking_amount,
      payment_mode,
      registry,

      reason,
      status,
      follow_up_status,

      d_closeDate, // Add d_closeDate (Deal Close Date) to destructured body
    } = req.body;

    console.log(
      lead_status,
      quotation_status,

      deal_status,
      booking_amount,
      payment_mode,
      registry,
      reason,
      status,
      follow_up_status,

      d_closeDate, // Log d_closeDate
      id
    );

    const sql = `UPDATE leads SET 
                      lead_status = ?, 
                      quotation_status = ?, 
                      
                      deal_status = ?, 
                      booking_amount = ?,
      payment_mode = ?,
      registry = ?,
                      reason = ?, 
                      status = ?, 
                      follow_up_status = ?, 
                   
                      d_closeDate = ?      
                      WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          lead_status,
          quotation_status,

          deal_status,
          booking_amount,
      payment_mode,
      registry,
          reason,
          status,
          follow_up_status,

          d_closeDate, // Pass d_closeDate to the query
          id,
        ],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    res.status(200).json({ message: "Lead updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getEmployeeQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM quotations_information WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });

    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const employeeProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT employeeId, name, email, phone,photo, position, createdTime FROM employee WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });

    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const getAllEmployeeTotalLeads = async (req, res) => {
  try {
    const query = `
    SELECT 
    e.employeeId,
    e.name,
    e.email,
    e.phone,
    COUNT(l.lead_id) AS total_leads
    FROM employee e
    LEFT JOIN leads l ON e.employeeId = l.employeeId
    
    GROUP BY e.employeeId;
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching employees with lead count:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json({
        success: true,
        employees: results,
      });
    });
  } catch (error) {
    console.error("Error in fetching employees:", error);
    res.status(500).json({
      success: false,
      message: "Error in fetching employees",
      error: error.message,
    });
  }
};

const getLeadQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM quotations_information WHERE lead_id = ?";
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });

    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const getEmployeeVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM visit WHERE lead_id = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};
const createVisit = (req, res) => {
  const {
    lead_id,
    name,
    employeeId,
    employee_name,
    visit,
    visit_date,
  
  } = req.body;

  const sql = `INSERT INTO visit (
    lead_id,
    name,
    employeeId,
    employee_name,
    visit,
    visit_date
   
  ) VALUES (?,?,?,?,?,?)`;

  db.query(
    sql,
    [lead_id, name, employeeId, employee_name, visit, visit_date],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error inserting data" });
      } else {
        res.status(201).json({
          success: true,
          message: "Visit data successfully submitted",
        });
      }
    }
  );
};
const updateVisit = (req, res) => {
  const {
    id, // Unique identifier for the visit
    lead_id,
    name,
    employeeId,
    employee_name,
    visit,
    visit_date,
    report,
  } = req.body;

  // Basic validation
  if (!id || !visit || !visit_date || !report) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields." });
  }

  const sql = `UPDATE visit SET 
    lead_id = ?, 
    name = ?, 
    employeeId = ?, 
    employee_name = ?, 
    visit = ?, 
    visit_date = ?, 
    report = ? 
    WHERE id = ?`;

  db.query(
    sql,
    [lead_id, name, employeeId, employee_name, visit, visit_date, report, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error updating visit data" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Visit not found" });
      } else {
        res
          .status(200)
          .json({ success: true, message: "Visit data updated successfully" });
      }
    }
  );
};

const deleteVisit = (req, res) => {
  const { id } = req.params;

  // Basic validation
  if (!id) {
    return res.status(400).json({ error: "Visit ID is required" });
  }

  const sql = `DELETE FROM visit WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error deleting visit" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Visit not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Visit deleted successfully" });
    }
  });
};

const getEmployeeFollow_Up= async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM follow_up_leads WHERE lead_id = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};



const createFollow_Up = (req, res) => {
  const {
    lead_id,
    name,
    employeeId,
    employee_name,
    follow_up_type,
    follow_up_date,
    report
  
  } = req.body;

  const sql = `INSERT INTO follow_up_leads (
    lead_id,
    name,
    employeeId,
    employee_name,
  follow_up_type,
    follow_up_date,
    report
   
  ) VALUES (?,?,?,?,?,?,?)`;

  db.query(
    sql,
    [lead_id, name, employeeId, employee_name,  follow_up_type,follow_up_date,report],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error inserting data" });
      } else {
        res.status(201).json({
          success: true,
          message: "Follow Up data successfully submitted",
        });
      }
    }
  );
};
const updateFollow_Up = (req, res) => {
  const {
    id, // Unique identifier for the Follow Up
    lead_id,
    name,
    employeeId,
    employee_name,
    follow_up_type,
    follow_up_date,
    report
  } = req.body;

  // Basic validation
  if (!id || !follow_up_type || !follow_up_date || !report) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields." });
  }

  const sql = `UPDATE follow_up_leads SET 
    lead_id = ?, 
    name = ?, 
    employeeId = ?, 
    employee_name = ?, 
    follow_up_type = ?, 
   follow_up_date = ?,
    report = ? 
    WHERE id = ?`;

  db.query(
    sql,
    [lead_id, name, employeeId, employee_name,  follow_up_type,follow_up_date, report, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error updating Follow Up data" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Follow Up not found" });
      } else {
        res
          .status(200)
          .json({ success: true, message: "Follow Up data updated successfully" });
      }
    }
  );
};

const deleteFollow_Up = (req, res) => {
  const { id } = req.params;

  // Basic validation
  if (!id) {
    return res.status(400).json({ error: "Follow Up ID is required" });
  }

  const sql = `DELETE FROM follow_up_leads WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error deleting visit" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Follow Up not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Follow Up deleted successfully" });
    }
  });
};

const getEmployeebyidvisit = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM visit WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const AllgetEmployeebyvisit = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM visit ";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const updateOnlyVisitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { visit } = req.body;

    console.log(visit, id);

    const sql = `UPDATE leads SET 
    visit = ?
    
    WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [visit, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Visit Status updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const updateOnlyFollowUpStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { follow_up_status } = req.body;

    console.log(follow_up_status, id);

    const sql = `UPDATE leads SET 
    follow_up_status = ?
                    
    WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [follow_up_status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Follow Up updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};



module.exports = {
  getEmployeeInvoice,
  getEmployeeLeads,
  updateLeadStatus,
  getEmployeeQuotation,
  employeeProfile,
  updateOnlyLeadStatus,
  updateOnlyQuotationStatus,
  getAllEmployeeTotalLeads,
  getLeadQuotation,
  getEmployeeVisit,
  createVisit,
  deleteVisit,
  updateVisit,
  getEmployeeFollow_Up,
  createFollow_Up,
  deleteFollow_Up,
  updateFollow_Up,
  getEmployeebyidvisit,
  AllgetEmployeebyvisit,
  updateOnlyVisitStatus,
  updateOnlyFollowUpStatus
};
