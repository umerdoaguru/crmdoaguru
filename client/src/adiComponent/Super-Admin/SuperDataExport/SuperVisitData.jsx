import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import styled from "styled-components";



const SuperVisitData = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 6; // Default leads per page
  const EmpId = useSelector((state) => state.auth.user.id);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([
    'lead_id',
'name',
'employee_name',
'employeeId',
'visit',
'report',
'visit_date',

]);
const superadminuser = useSelector((state) => state.auth.user);
const token = superadminuser.token;
const [admins, setAdmins] = useState([]);

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
    fetchEmployees();
    fetchAdmins();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/employe-all-visit-super-admin`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      // Filter out leads where visit is "Pending"
      const nonPendingLeads = response.data.filter(
        (lead) => lead.visit !== "pending"
      );

      setLeads(nonPendingLeads);
      setFilteredLeads(nonPendingLeads); // Initial data set for filtering
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/employee-super-admin",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/getAllAdmins",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      const admins = response.data.admins;
      setAdmins(admins || []);
      console.log("Admins fetched successfully", admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };


  // Automatically apply date filter when start or end date changes

  useEffect(() => {
    let filtered = leads;

    // Filter by date
    if (startDate && endDate) {
      filtered = filtered.filter((lead) => {
        const visitDate = moment(lead.visit_date, "YYYY-MM-DD");
        return visitDate.isBetween(startDate, endDate, undefined, "[]");
      });
    }

    // Filter by selected employee
    if (selectedEmployee) {
      filtered = filtered.filter((lead) => lead.employee_name === selectedEmployee);
    }

    setFilteredLeads(filtered);
  }, [startDate, endDate, selectedEmployee, leads]);

  const downloadExcel = () => {
    // Map to rename keys for export
    const columnMapping = {
        lead_id: "Lead ID",          
        name: "Name",                
        employee_name: "Employee Name", 
        employeeId: "Employee ID",   
        visit: "Visit",              
        report: "Report",             
        visit_date: "Visit Date",    
      };
      
  
    const completedLeads = filteredLeads
      .filter((lead) => lead.visit !== "pending")
      .map((lead) => {
        const formattedLead = {};
  
        // Dynamically include selected columns
        selectedColumns.forEach((col) => {
          const newKey = columnMapping[col] || col; // Use mapped name if available
          formattedLead[newKey] = 
            (col === "visit_date") && lead[col]
              ? moment(lead[col]).format("DD MMM YYYY").toUpperCase()
              : lead[col]; // Format dates or copy value
        });
  
      
       
        

  
        return formattedLead;
      });
       // Ensure we handle empty reports gracefully
  if (completedLeads.length === 0) {
    alert("No data available for the selected date range.");
    return;
  }

  // Generate the Excel workbook
  const worksheet = XLSX.utils.json_to_sheet(completedLeads);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  // Generate a valid filename
  const filename = ` Lead Report ${
    startDate ? moment(startDate).format("DD-MM-YYYY") : "Start"
  } to ${
    endDate ? moment(endDate).format("DD-MM-YYYY") : "End"
  }.xlsx`;

  // Download the Excel file
  XLSX.writeFile(workbook, filename);
  
  
  };


  // Pagination logic
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <Wrapper>
      <div className="container 2xl:w-[95%]">
      <div className="flex-grow  mt-14 lg:mt-0 sm:ml-0">
        <center className="text-2xl text-center mt-8 font-medium">
         Site Visits Data
        </center>
        <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
        {/* Date Filter */}
        <div className="flex  mb-4 sm:flex-row flex-col gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-1"
          />
          <div className="p-1">
            <p>to</p>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-1"
          />
            <div className="">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="border p-1"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name}
                </option>
              ))}
               {admins.map((admin) => (
                    <option key={admin.admin_id} value={`Assign by Admin ${admin.name}`}>
                    Assigned By Admin {admin.name}
                    </option>
                  ))}
            </select>
          </div>
          <div className="respo ">
            <button
              onClick={downloadExcel}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Download Excel
            </button>
          </div>
        
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border">
            <thead>
            <tr>
                    <th className="px-6 py-3  border-b-2 border-gray-300 text-black-500">
                      S.no
                    </th>
                    <th className="px-6 py-3  border-b-2 border-gray-300 text-black-500">
                     Lead Id 
                    </th>
                    <th className="px-6 py-3  border-b-2 border-gray-300 text-black-500">
                     Name
                    </th>
                    <th className="px-6 py-3  border-b-2 border-gray-300 text-black-500">
                      Assigned To
                    </th>
                    <th className="px-6 py-3  border-b-2 border-gray-300 text-black-500">
                      Visit 
                    </th>
                    <th className="px-6 py-3  border-b-2 border-gray-300 text-black-500">
                      Report
                    </th>
                    <th className="px-6 py-3  border-b-2 border-gray-300 text-black-500">
                      Visit Date
                    </th>
                
                  </tr>
            </thead>
            <tbody>
  {currentLeads.length === 0 ? (
    <tr>
      <td colSpan="11" className="px-6 py-4 border-b border-gray-200 text-center text-gray-500">
        No data found
      </td>
    </tr>
  ) : (
    currentLeads.map((visit, index) => (
      <tr
        key={visit.id}
        className={index % 2 === 0 ? "bg-gray-100" : ""}
      >
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {currentPage * leadsPerPage + index + 1}
        </td>
       
                    <td className="px-6 py-4 whitespace-nowrap">
                      {visit.lead_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {visit.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     {visit.employee_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     {visit.visit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     {visit.report}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    
                     {moment(visit.visit_date).format("DD MMM YYYY").toUpperCase()}
                    </td>
      </tr>
    ))
  )}
</tbody>

          </table>
        </div>
        <div className="mt-3 mb-2 flex justify-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
        />
</div>
      </div></div>
    </Wrapper>
  );
};

export default SuperVisitData;

const Wrapper = styled.div`
  /* Container class */
  .respo {
    @media screen and (max-width: 768px) {
      margin-top: 1rem;
    }
  }

`;
