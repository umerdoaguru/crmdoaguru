

import React, { useState, useEffect } from "react";
import moment from "moment";

import cogoToast from "cogo-toast";
import { Link, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import axios from "axios";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import MainHeader from './../MainHeader';
import Sider from './../Sider';

function AssignedAdminLeads() {


  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [leadSourceFilter, setLeadSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("");
  const [dealFilter, setDealFilter] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("");
  const [leadnotInterestedStatusFilter, setLeadnotInterestedStatusFilter] = useState("");
  const [meetingStatusFilter, setMeetingStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desce"); 
  const [employees, setEmployees] = useState([]);


  const [endDate, setEndDate] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(10);

  const navigate = useNavigate();

  const adminuser = useSelector((state) => state.auth.user);

  const token = adminuser?.token;

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);
  
  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/employe-leads-admin/${adminuser.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      const data = response.data;
      console.log(data);
      setLeads(data.reverse()); // Reverse the data here
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/employeeself",
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
  

  const handleUpdate = async (lead) => {
    try {
      // Send updated data to the backend using Axios
      const response = await axios.put(
        `http://localhost:9000/api/updateOnlyLeadStatus/${lead.lead_id}`,
        { lead_status: "active lead" }
      );

      if (response.status === 200) {
        console.log("Updated successfully:", response.data);
        cogoToast.success("Lead status updated successfully");
        navigate(`/employee-lead-single-data/${lead.lead_id}`);
      } else {
        console.error("Error updating:", response.data);
        cogoToast.error("Failed to update the lead status.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      cogoToast.error("Failed to update the lead status.");
    }
  };

  
  


  

 
  

  const applyFilters = () => {
    let filtered = [...leads];
  
    // Sort by date
     filtered = filtered.sort((a, b) => {
      if (sortOrder === "desce") {
        return new Date(b.createdTime) - new Date(a.createdTime);
      } else {
        return new Date(a.createdTime) - new Date(b.createdTime);
      }
    });
  
 // Filter by search term
 if (searchTerm) {
  const trimmedSearchTerm = searchTerm.toLowerCase().trim();
  filtered = filtered.filter((lead) =>
    ["name", "leadSource", "phone","assignedTo"].some((key) =>
      lead[key]?.toLowerCase().trim().includes(trimmedSearchTerm)
    )
  );
}
  
    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((lead) => {
        const leadDate = moment(lead.createdTime).format("YYYY-MM-DD");
        return leadDate >= startDate && leadDate <= endDate;
      });
    }
  
    // Filter by lead source
    if (leadSourceFilter) {
      filtered = filtered.filter((lead) => lead.leadSource === leadSourceFilter);
    }
  
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }
  
    // Filter by deal
    if (dealFilter) {
      filtered = filtered.filter((lead) => lead.deal_status === dealFilter);
    }
  
    // Filter by lead status
    if (leadStatusFilter) {
      filtered = filtered.filter((lead) => lead.lead_status === leadStatusFilter);
    }
  
    // Filter by not interested reason
    if (leadnotInterestedStatusFilter) {
      if (leadnotInterestedStatusFilter === "other") {
        filtered = filtered.filter(
          (lead) => !["price", "budget", "distance"].includes(lead.reason)
        );
      } else {
        filtered = filtered.filter(
          (lead) => lead.reason === leadnotInterestedStatusFilter
        );
      }
    }
  
    // Filter by visit
    if (visitFilter) {
      filtered = filtered.filter((lead) => lead.visit === visitFilter);
    }
  
    // Filter by meeting status
    if (meetingStatusFilter) {
      filtered = filtered.filter(
        (lead) => lead.meeting_status === meetingStatusFilter
      );
    }
  
  
    // Filter by month
    if (monthFilter) {
      filtered = filtered.filter((lead) => {
        const leadMonth = moment(lead.createdTime).format("MM");
        return leadMonth === monthFilter;
      });
    }
  
    return filtered;
  };

  useEffect(() => {
    const filtered = applyFilters();
    setFilteredLeads(filtered);
  }, [
    searchTerm,
    startDate,
    endDate,
    leads,
    leadSourceFilter,
    statusFilter,
    visitFilter,
    dealFilter,
    leadStatusFilter,
    leadnotInterestedStatusFilter,
    meetingStatusFilter,
    
    monthFilter,
    sortOrder,
  ]);
  
  // Total Leads
  const totalLeads = applyFilters().length;
  
  // Total Closed Leads
  const totalClosedLeads = applyFilters().filter((lead) => lead.deal_status === "close").length;
  
  // Total Visits
  const totalVisits = applyFilters().filter((lead) =>
    ["fresh", "re-visit", "self", "associative"].includes(lead.visit)
  ).length;
  
 
  
  

  // Use filteredLeads for pagination
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leadsPerPage === Infinity ? filteredLeads : filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);


  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  const handleLeadsPerPageChange = (e) => {
    const value = e.target.value;
    setLeadsPerPage(value === "All" ? Infinity : parseInt(value, 10));
    setCurrentPage(0); // Reset to the first page
  };
  const toggleSortOrder = () => {
  setSortOrder((prevOrder) => (prevOrder === "desce" ? "asce" : "desce"));
};

  return (
    <>
      <MainHeader />
      <Sider />
      {/* <div className=" container"> */}
      <div className="flex flex-col  2xl:ml-44 ">

        <div className="flex-grow p-4 mt-14 lg:mt-5  sm:ml-0">
          <center className="text-2xl text-center mt-8 font-medium">
            Assigned Employee Leads
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>

          {/* Button to create a new lead */}
          <div className="grid max-sm:grid-cols-2 sm:grid-cols-3  lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label htmlFor="">Search</label>
                <input
                  type="text"
                    placeholder=" Name,Lead Source,Assigned To,Phone No"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border  rounded-2xl p-2 w-full"
                />
              </div>

              <div>
                <label htmlFor="">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border   rounded-2xl p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="">Lead Source Filter</label>
                <select
                  value={leadSourceFilter}
                  onChange={(e) => setLeadSourceFilter(e.target.value)}
                  
                  className={`border rounded-2xl p-2 w-full ${
                    leadSourceFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                   <option value="">Select Lead Source</option>
                     <option value="Facebook">Facebook</option>
                    <option value="One Realty Website">
                      One Realty Website
                    </option>
                    <option value="99 Acres">
                    99 Acres
                    </option>
                    <option value="Referrals">Referrals</option>
                    <option value="Cold Calling">Cold Calling</option>
                    <option value="Email Campaigns">Email Campaigns</option>
                    <option value="Networking Events">Networking Events</option>
                    <option value="Paid Advertising">Paid Advertising</option>
                    <option value="Content Marketing">Content Marketing</option>
                    <option value="SEO">Search Engine Optimization</option>
                    <option value="Trade Shows">Trade Shows</option>
                   
                    <option value="Affiliate Marketing">
                      Affiliate Marketing
                    </option>
                    <option value="Direct Mail">Direct Mail</option>
                    <option value="Online Directories">
                      Online Directories
                    </option>
                </select>
              </div>

           
        
             <div>
                <label htmlFor="">Deal Filter</label>
                <select
                  value={dealFilter}
                  onChange={(e) => setDealFilter(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                    dealFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  <option value="">All Deal</option>
                  <option value="pending">Pending</option>
                  <option value="close">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label htmlFor="">Lead Status</label>
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                    leadStatusFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  <option value="">All Lead Status</option>
                  <option value="pending">Pending</option>
                  <option value="active lead">Active Lead</option>
                  <option value="calling done">Calling Done</option>
                  <option value="site visit done">Site Visit Done</option>
                  <option value="interested">Interested</option>
                  <option value="not-interested">Not-Interested</option>
        
                 
                  <option value="completed">Completed</option>
                </select>
              </div>
              {leadStatusFilter === "not-interested" && (
  <div>
  <label htmlFor="">Not Interested</label>
  <select
    value={leadnotInterestedStatusFilter}
    onChange={(e) => setLeadnotInterestedStatusFilter(e.target.value)}
    className={`border rounded-2xl p-2 w-full ${
      leadnotInterestedStatusFilter ? "bg-blue-500 text-white" : "bg-white"
    }`}
  >
    <option value="">All Not Interested</option>
    <option value="price">Price</option>
    <option value="budget">Budget</option>
    <option value="distance">Distance</option>
       <option value="other">Other</option>
   
   

  </select>
</div>


              )}

{leadStatusFilter === "site visit done" && (
                    <div>
                <label htmlFor="">Visit Filter</label>
                <select
                  value={visitFilter}
                  onChange={(e) => setVisitFilter(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                    visitFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  <option value="">All visit</option>
                  <option value="fresh">Fresh Visit</option>
                  <option value="re-visit">Re-Visit</option>
                  <option value="associative">Associative Visit</option>
                  <option value="self">Self Visit</option>
                </select>
              </div>
                )}
              <div>
                <label htmlFor="">Meeting Status</label>
                <select
                  value={meetingStatusFilter}
                  onChange={(e) => setMeetingStatusFilter(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                   meetingStatusFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  <option value="">All Meeting Status</option>
                  <option value="pending">Pending</option>
                  <option value="done by director">Done By Director</option>
                  <option value="done by manager">Done By Manager</option>
                 
                </select>
              </div>


              <div>
  <label htmlFor="">Month Filter</label>
  <select
    value={monthFilter}
    onChange={(e) => setMonthFilter(e.target.value)}
    className={`border rounded-2xl p-2 w-full ${
     monthFilter ? "bg-blue-500 text-white" : "bg-white"
    }`}
  >
    <option value="">All Months</option>
    <option value="01">January</option>
    <option value="02">February</option>
    <option value="03">March</option>
    <option value="04">April</option>
    <option value="05">May</option>
    <option value="06">June</option>
    <option value="07">July</option>
    <option value="08">August</option>
    <option value="09">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>
  </select>
</div>

            
            </div>
          <div className="flex gap-10 text-xl font-semibold my-3 mt-5">
  {/* Total Lead Count */}
  <div>
    Total Lead:{" "}
    {
     totalLeads
    }
  </div>

  {/* Total Lead Visits */}
  <div>
    Total Site Visit:{" "}
    {
      totalVisits
    }
  </div>

  {/* Total Closed Leads */}
  <div>
    Total Closed Lead:{" "}
    {
     totalClosedLeads
    }
  </div>
  <select
            onChange={handleLeadsPerPageChange}
            className="border rounded-2xl w-1/4"
          
          >
                   <option value={10}>Number of rows: 10</option>
           
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value="All">All</option>
          </select>
</div>

          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              
            <thead>
                <tr>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    S.no
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Lead Id
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Name
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Phone
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Lead Source
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Assigned To
                  </th>
               
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Lead Status
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Visit
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Reason
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Deal Status
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Meeting Status
                  </th>
                 
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Remark Status
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Answer Remark
                  </th>
                
                  <th
  className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left cursor-pointer"
  onClick={toggleSortOrder}
>
  Assigned Date
  <span>{sortOrder === "desce" ? "▲" : "▼" }</span>
</th>
            <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Action
                  </th>      
               
                </tr>
              </thead>

              <tbody>
  {currentLeads.length > 0 ? (
    currentLeads.map((lead, index) => (

      <tr
        key={lead.id}
        className={index % 2 === 0 ? "bg-gray-100" : ""}
      >
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
        {leadsPerPage === Infinity ? index + 1 : index + 1 + currentPage * leadsPerPage}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 underline font-semibold text-[blue]">
          <Link to={`/admin-lead-single-data/${lead.lead_id}`}>
            {lead.lead_id}
          </Link>
        </td>
         <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                        {lead.phone}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                        {lead.leadSource}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                        {lead.assignedTo}
                      </td>
                    
                    
                        <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                          {lead.lead_status}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                          {lead.visit}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                          {lead.reason}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                          {lead.deal_status}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                          {lead.meeting_status}
                        </td>
                    
                     
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                        {lead.remark_status}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold  text-wrap" >
                        {lead.answer_remark}
                        
                                       
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                        {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
                      </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
        {lead.lead_status === "active lead" || lead.lead_status === "calling done" || lead.lead_status === "site visit done" || lead.lead_status === "interested" || lead.lead_status === "not-interested"  ?  (
  <button
    className="text-[green] font-semibold hover:text-blue-700"
    onClick={() => handleUpdate(lead)}
  >
    Started Work
  </button>
) : lead.lead_status === "pending" ? (
  <button
    className="text-blue-500 font-semibold hover:text-blue-700"
    onClick={() => handleUpdate(lead)}
  >
   Not Start Work
  </button>
) : lead.lead_status === "completed" ? (
  <button
    className="text-gray-400 font-semibold cursor-not-allowed"
    disabled
  >
    Work Completed
  </button>
) : null}

        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="12"
        className="text-center py-4 text-gray-500"
      >
        No Data Available
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>
          <div className="mt-4 flex justify-center">
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
        </div>

      </div>
      {/* </div> */}
    </>
  );
}

export default AssignedAdminLeads;


