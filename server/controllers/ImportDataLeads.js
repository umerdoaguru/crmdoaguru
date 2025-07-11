const xlsx = require("xlsx");
const { db } = require("../db");
const moment = require("moment");

const importLeads = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      return res.status(400).json({ error: 'No data found in the Excel file' });
    }

    const {
      assignedTo,
      employeeId,
      project,
      assignedBy,
      assigned_date,
    } = req.body;

   const convertExcelDate = (excelDate) => {
  if (typeof excelDate === "number") {
    // Excel serial date
    return moment(new Date((excelDate - 25569) * 86400 * 1000)).format("YYYY-MM-DD");
  } else if (moment(excelDate, "DD-MMM-YY", true).isValid()) {
    // Handles format like '26-Apr-25'
    return moment(excelDate, "DD-MMM-YY").format("YYYY-MM-DD");
  } else {
    return null;
  }
};


    const checkDuplicate = (name, phone, email_id) => {
      return new Promise((resolve, reject) => {
        const query = `SELECT * FROM leads WHERE name = ? AND phone = ? AND (email_id = ? OR ? IS NULL OR email_id IS NULL)`;
        db.query(query, [name, phone, email_id, email_id], (err, results) => {
          if (err) return reject(err);
          resolve(results.length > 0);
        });
      });
    };


    const values = [];
    for (const lead of sheetData) {
      const name = lead["Name"] || null;
      const phone = lead["Phone"] || null;
      const email_id = lead["Email Id"] || null;
      const leadSource = lead["Lead Source"] || null;
      const address = lead["Address"] || null;
      const subject = project;

      const actual_date = convertExcelDate(lead["Actual Date"]);
      const createdTime = assigned_date || moment().format("YYYY-MM-DD");

      // Check for duplicate
      const isDuplicate = await checkDuplicate(name, phone, email_id);
      const lead_status = isDuplicate ? 'duplicate lead' : 'pending';

      values.push([
        name,
        phone,
        assignedTo,
        leadSource,
        employeeId,
        subject,
        address,
        email_id,
        createdTime,
        actual_date,
        assignedBy,
        lead_status
      ]);
    }

    

    const insertSql = `INSERT INTO leads (name, phone, assignedTo, leadSource, employeeId, subject, address, email_id, createdTime, actual_date, assignedBy, lead_status) VALUES ?`;

    db.query(insertSql, [values], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database insert failed', details: err });
      }

      res.status(200).json({
        message: 'Leads imported successfully',
        inserted: result.affectedRows,
      });
    });

  } catch (error) {
    res.status(500).json({ error: 'File processing failed', details: error.message });
  }
};

module.exports = { importLeads };
