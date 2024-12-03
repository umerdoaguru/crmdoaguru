import React, { useState, useEffect } from "react";

import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";



const EmpVisitReport = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 6; // Default leads per page
  const EmpId = useSelector((state) => state.auth.user.id);
 
  const [duration, setDuration] = useState("all"); // Default is "all"
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
  


  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
    
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employebyid-visit/${EmpId}`
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
 

  const filterByDuration = (leads, duration) => {
    const today = moment();

    switch (duration) {
      case "week":
        return leads.filter((lead) =>
          moment(lead.visit_date).isSame(today, "week")
        );
      case "month":
        return leads.filter((lead) =>
          moment(lead.visit_date).isSame(today, "month")
        );
      case "year":
        return leads.filter((lead) =>
          moment(lead.visit_date).isSame(today, "year")
        );
      case "all":
      default:
        return leads;
    }
  };



  // Automatically apply date filter when start or end date changes

  useEffect(() => {
    let filtered = leads;

    

    // Filter by selected employee
    
    filtered = filterByDuration(filtered, duration);

    setFilteredLeads(filtered);
  }, [ selectedEmployee,duration, leads]);

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
  
    // Generate Excel file
    const worksheet = XLSX.utils.json_to_sheet(completedLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visit Report");
    XLSX.writeFile(workbook, "VisitReport.xlsx");
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
    <>
      <div className="container 2xl:w-[95%]">
      <div className="flex-grow  mt-14 lg:mt-0 sm:ml-0">
       
       
        {/* Date Filter */}
        <div className="flex mb-4 sm:flex-row justify-end flex-col gap-2">
   
            <div>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="all">All</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <button
              onClick={downloadExcel}
              className="bg-blue-500 text-white font-medium px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Excel
            </button>
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
    </>
  );
};

export default EmpVisitReport;


