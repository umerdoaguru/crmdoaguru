const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const { db } = require("./db");
dotenv.config();
const bodyParser = require("body-parser");

const Router4 = require("./routers/employeRouter");
const Router2 = require("./routers/organizationRoutes");
const Router3 = require("./routers/dashboardRoutes");
const Router = require("./routers/userdataroutes");
const Router5 = require("./routers/response_99acres");
const Router6 = require("./routers/FacebookRoutes");
const Router7 = require("./routers/WebsiteRoutes");

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use("/api", Router3);
app.use("/api", Router2);
app.use("/api", Router4);
app.use("/api", Router);
app.use("/api", Router5);
app.use("/api", Router6);
app.use("/api", Router7);
app.use(cors({ origin: "http://localhost:3000" }));
app.use("/Assets", express.static(path.join(__dirname, "Assets")));

console.log("Fetching data from API...Kar raha he");

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Get dates within the last 30 days
const now = new Date();
const startDate = new Date();
startDate.setDate(now.getDate() - 2); // 2 days before today

const formattedStartDate = formatDate(startDate);
const formattedEndDate = formatDate(now);

console.log("Start Date:", formattedStartDate, "End Date:", formattedEndDate);

// Function to extract text from XML tag
const getValueBetweenTags = (xml, tag) => {
  const regex = new RegExp(
    `<${tag}>(<!\\[CDATA\\[)?(.*?)(\\]\\]>|<\/${tag}>)`,
    "i"
  );
  const match = xml.match(regex);
  return match ? match[2].trim() : "";
};

// Function to convert the XML data into JSON
const convertXMLToJSON = (xml) => {
  const responses = [];
  const respRegex = /<Resp>(.*?)<\/Resp>/gis; // Regex to find all <Resp> blocks

  let match;
  while ((match = respRegex.exec(xml)) !== null) {
    const respXML = match[1];

    // Extract data from within each <Resp> block
    const qryDtl = {
      ResType: getValueBetweenTags(respXML, "QryDtl ResType"),
      QueryId: getValueBetweenTags(respXML, "QryDtl QueryId"),
      CmpctLabl: getValueBetweenTags(respXML, "CmpctLabl"),
      QryInfo: getValueBetweenTags(respXML, "QryInfo"),
      RcvdOn: getValueBetweenTags(respXML, "RcvdOn"),
      ProjId: getValueBetweenTags(respXML, "ProjId"),
      ProjName: getValueBetweenTags(respXML, "ProjName"),
      CityName: getValueBetweenTags(respXML, "CityName"),
      ResCom: getValueBetweenTags(respXML, "ResCom"),
      Price: getValueBetweenTags(respXML, "Price"),
      PhoneVerificationStatus: getValueBetweenTags(
        respXML,
        "PhoneVerificationStatus"
      ),
      EmailVerificationStatus: getValueBetweenTags(
        respXML,
        "EmailVerificationStatus"
      ),
      IDENTITY: getValueBetweenTags(respXML, "IDENTITY"),
      ProdId: getValueBetweenTags(respXML, "ProdId"),
      ProdStatus: getValueBetweenTags(respXML, "ProdId Status"), // Extract the ProdId status attribute
      ProdType: getValueBetweenTags(respXML, "ProdId Type"), // Extract the ProdId type attribute
    };

    const cntctDtl = {
      Name: getValueBetweenTags(respXML, "Name"),
      Email: getValueBetweenTags(respXML, "Email"),
      Phone: getValueBetweenTags(respXML, "Phone"),
    };

    // Combine into sponse object
    responses.push({
      QueryDetails: qryDtl,
      ContactDetails: cntctDtl,
    });
  }

  return {
    ActionStatus: getValueBetweenTags(xml, "Xml ActionStatus"),
    Responses: responses,
  };
};

// // Fetch and Save Data Function
// const fetchDataAndSave = async () => {
//   try {
//     const url = 'https://www.99acres.com/99api/v1/getmy99Response/OeAuXClO43hwseaXEQ/uid/';
//     const xmlRequest = `<?xml version='1.0'?><query><user_name>onenirvana</user_name><pswd>onerealty@123</pswd><start_date>${formattedStartDate}</start_date><end_date>${formattedEndDate}</end_date></query>`;
//     const response = await axios.post(url, { xml: xmlRequest }, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });

//     console.log('API Response:', response.data);

//     // Convert the XML response to JSON change ho gya
//     const jsonResponse = convertXMLToJSON(response.data);
//     console.log(jsonResponse);

//     // Check if there are responses to save yadi hua to nhi to respose
//     if (jsonResponse.Responses.length === 0) {
//       console.log('No responses to save.');
//       return;
//     }

//     // Insert karte me database with validation
//     for (const response of jsonResponse.Responses) {
//       const { QueryId, ProjName, CityName, QryInfo, RcvdOn } = response.QueryDetails;
//       const { Name, Email, Phone } = response.ContactDetails;

//       // Check if the entry already exists
//       const existingEntryQuery = `
//         SELECT * FROM responses_99acres 
//         WHERE email = ? AND phone = ? AND project_name = ?
//       `;
//       const existingEntryValues = [Email, Phone, ProjName]; // Get the date from received_on

//       db.query(existingEntryQuery, existingEntryValues, (error, results) => {
//         if (error) {
//           console.error('Error checking for existing entry:', error);
//           return;
//         }

//         if (results.length > 0) {
//           console.log(`Entry already exists for ${Name} on ${ProjName}. Skipping...`);
//           return; // vo entry save nhi hogii
//         }

//         // jo entry pehle se vo save nhi hogi, save the new entry
//         const sql = 'INSERT INTO responses_99acres (query_id, project_name, city_name, query_info, received_on, contact_name, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
//         const leadData = [QueryId, ProjName, CityName, QryInfo, RcvdOn, Name, Email, Phone];
//         console.log('Checking lead data:', leadData);

//         db.query(sql, leadData, (err) => {
//           if (err) {
//             console.error('Error inserting into database:', err);
//           } else {
//             console.log('Data inserted:', { QueryId, Name });
//           }
//         });
//       });
//     }

//   } catch (error) {
//     console.error('Error fetching and saving 99Acres responses:', error);
//   }
// };


// fetchDataAndSave();
// // Fetch data every 10 minutes
// setInterval(fetchDataAndSave, 10 * 60 * 1000); // 10 <minutes></minutes>
const fetchDataAndSave = async () => {
  try {
    const url =
      "https://www.99acres.com/99api/v1/getmy99Response/OeAuXClO43hwseaXEQ/uid/";
    const xmlRequest = `<?xml version='1.0'?><query><user_name>USERNAME</user_name><pswd>PASSWORD</pswd><start_date>${formattedStartDate}</start_date><end_date>${formattedEndDate}</end_date></query>`;

    // Make the API request
    const response = await axios.post(url, { xml: xmlRequest }, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log("API Response:", response.data);

    // Convert the XML response to JSON
    const jsonResponse = convertXMLToJSON(response.data);
    console.log(jsonResponse);

    // Check if there are any responses to save
    if (jsonResponse.Responses.length === 0) {
      console.log("No responses to save.");
      return;
    }

    // Sequentially insert data into the database
    for (const response of jsonResponse.Responses) {
      const { QueryId, ProjName, CityName, QryInfo, RcvdOn } =
        response.QueryDetails;
      const { Name, Email, Phone } = response.ContactDetails;

      // Check if the entry already exists
      const existingEntryQuery = `
        SELECT * FROM responses_99acres 
        WHERE email = ? AND phone = ? AND project_name = ?
      `;
      const existingEntryValues = [Email, Phone, ProjName];

      // Check for existing entries in a Promise
      const existingEntry = await new Promise((resolve, reject) => {
        db.query(existingEntryQuery, existingEntryValues, (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        });
      });

      // If entry already exists, skip to the next one
      if (existingEntry.length > 0) {
        console.log(`Entry already exists for ${Name} on ${ProjName}. Skipping...`);
        continue;
      }

      // Insert new entry
      const insertQuery = `
        INSERT INTO responses_99acres 
        (query_id, project_name, city_name, query_info, received_on, contact_name, email, phone) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const leadData = [QueryId, ProjName, CityName, QryInfo, RcvdOn, Name, Email, Phone];

      // Insert data into the database with a Promise
      await new Promise((resolve, reject) => {
        db.query(insertQuery, leadData, (error) => {
          if (error) {
            return reject(error);
          }
          console.log('Data inserted:', { QueryId, Name });
          resolve();
        });
      });
    }
  } catch (error) {
    console.error("Error fetching and saving 99Acres responses:", error);
  }
};

// Call the function initially
fetchDataAndSave();
// Fetch data every 10 minutes
setInterval(fetchDataAndSave, 10 * 60 * 1000); // 10 minutes


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
