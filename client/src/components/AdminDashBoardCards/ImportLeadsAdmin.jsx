import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useSelector } from 'react-redux';
import MainHeader from '../MainHeader';
import Sider from '../Sider';
import cogoToast from 'cogo-toast';



const ImportLeadsAdmin = () => {
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;
  const userId = adminuser.user_id;

  const [file, setFile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState('');
 
  const [selectedEmployee, setSelectedEmployee] = useState("");

 
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [assignedDate, setAssignedDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fileKey, setFileKey] = useState(Date.now());

  useEffect(() => {
    fetchEmployees();

  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/api/employee`, 
     {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

const handleEmployeeChange = (e) => {
    const employeeId = parseInt(e.target.value, 10); // Convert to number
    const emp = employees.find(emp => emp.employeeId === employeeId);
    setSelectedEmployee(employeeId);

    setSelectedEmployeeName(emp?.name || "");
  };




  



  const handleSubmit = async () => {
    if (!file || !selectedEmployee  || !assignedDate) {
      cogoToast.warn("Please fill all fields and upload a file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    ;
    formData.append("employeeId", selectedEmployee);
    formData.append("assignedTo", selectedEmployeeName);
    
    formData.append("project", projects);
  
    formData.append("assignedBy", "Admin");
    formData.append("assigned_date", assignedDate);

  
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:9000/api/import-leads", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
  
      cogoToast.success(res.data.message || "Leads imported successfully");
  
      // Clear form
      setFile(null);
      setFileKey(Date.now());
      setSelectedEmployee(""); 
      setSelectedEmployeeName("");
      setProjects("");
    
      setAssignedDate("");
      
    } catch (err) {
      console.error("Upload failed:", err);
      cogoToast.error(err.response?.data?.error || "Failed to import leads.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainHeader />
      <Sider />
      <div className="mt-[6rem] 2xl:ml-40">
        <div className=" text-center mx-2">
        <center className="text-2xl text-center  font-medium">
           Import Data 
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>

          <div className="">
            <label>Upload File only .xlsx,.csv</label>
            <br />
            <input type="file" accept=".xlsx,.csv" onChange={(e) => setFile(e.target.files[0])} className="border rounded-2xl p-2 xl:w-1/4 w-full"
    key={fileKey}/>
          </div>
          <a 
  href="/sample_leads.xlsx" 
  download 
  className="text-blue-600 underline hover:text-blue-800"
>
  Download Sample Excel File
</a>


          <div className="mb-3 mt-2">
            <label>Select Employee</label>
            <br />
            <select value={selectedEmployee} onChange={handleEmployeeChange} className="border rounded-2xl p-2 xl:w-1/4 w-full"
>
              <option value="">Select</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>{emp.name}</option>
              ))}
              
            </select>
          </div>

          <div className="mb-3">
            <label>Select Project</label>
            <br />
            <input
    type="text"
    value={projects}
    onChange={(e) => setProjects(e.target.value)}
    className="border rounded-2xl p-2 xl:w-1/4 w-full"

  />
          </div>

 
<div className="mb-3">
  <label>Assigned Date</label>
  <br />
  <input
    type="date"
    value={assignedDate}
    onChange={(e) => setAssignedDate(e.target.value)}
    className="border rounded-2xl p-2 xl:w-1/4 w-full"

  />
</div>


          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Import Leads"}
          </button>

          {message && <p className="mt-3 text-green-600">{message}</p>}

  
        </div>
      </div>
    </>
  );
};

export default ImportLeadsAdmin;
