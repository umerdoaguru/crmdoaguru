// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// import moment from 'moment';

// import cogoToast from 'cogo-toast';
// import { Link, useNavigate } from 'react-router-dom';
// import MainHeader from '../MainHeader';
// import EmployeeSider from './EmployeeSider';
// import UpdateLeadField from './updateLeadField';
// import { useSelector } from 'react-redux';

// function EmployeeLead() {
//     const [leads, setLeads] = useState([]);
//     const navigate = useNavigate();
//     const [currentLead, setCurrentLead] = useState({

//         lead_status: 'in progress',
//         quotation_status: '',
//         invoice_status: '',
//         deal_status: '',
//         reason: '',

//         follow_up_status: ''
//     });

//     // Fetch leads from the API
//     useEffect(() => {
//         fetchLeads();
//     }, []);
//     const EmpId = useSelector(state => state.auth.user.id);

//     const fetchLeads = async () => {
//         try {
//           const response = await axios.get(
//             `https://crmdemo.vimubds5.a2hosted.com/api/employe-leads/${EmpId}`);
//           const data = response.data;
//           setLeads(data);
//         } catch (error) {
//           console.error("Error fetching leads:", error);
//         }
//       };

//     const handleUpdate = async (lead) =>  {

//         setCurrentLead(lead);
//         console.log(lead);

//         try {
//           // Send updated data to the backend using Axios
//           const response = await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/updateLeadStatus/${currentLead.lead_id}`, currentLead);

//           if (response.status === 200) {
//             console.log('Updated successfully:', response.data);
//             cogoToast.success("Lead status updated successfully");

//             navigate(`/employee-lead-single-data/${currentLead.lead_id}`)
//           } else {
//             console.error('Error updating:', response.data);
//             cogoToast.error({ general: 'Failed to update the lead status.' });
//           }
//         } catch (error) {
//           console.error('Request failed:', error);
//           cogoToast.error('Failed to update the lead status.');
//         }

//     };

//     useEffect(() => {
//       fetchLeads();
//     }, [])

//     return (
//         <>
//             <MainHeader />
//             <EmployeeSider />
//             <div className="container mt-16">
//                 <h1 className="text-2xl text-center mt-[2rem]">Assigned Employee Leads</h1>
//                 <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

//                 {/* Button to create a new lead */}
//                 {/* <div className="mb-4">
//                     <button
//                         className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
//                         onClick={handleCreateClick}
//                     >
//                         Add Lead
//                     </button>
//                 </div> */}

//                 <div className="overflow-x-auto mt-4">
//                     <table className="min-w-full bg-white border">
//                         <thead>
//                             <tr>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">S.no</th>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Lead Number</th>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Assigned To</th>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Created Time</th>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Name</th>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Phone</th>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Lead Source</th>
//                                 <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {leads.map((lead, index) => (
//                                 <tr key={lead.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{index + 1}</td>
//                                     <Link to={`/employee-lead-single-data/${lead.lead_id}`}>
//                                     <td className="px-6 py-4 border-b border-gray-200  underline text-[blue]">{lead.lead_no}</td>
//                                     </Link>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.assignedTo}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{moment(lead.createdTime).format('DD/MM/YYYY')}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.name}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.phone}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.leadSource}</td>
//                                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
//                                         <button
//                                             className="text-blue-500 hover:text-blue-700"
//                                             onClick={() => handleUpdate(lead)}>
//                                             Start Work
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//             </div>
//         </>
//     );
// }

// export default EmployeeLead;

import React, { useState, useEffect } from "react";
import moment from "moment";

import cogoToast from "cogo-toast";
import { Link, useNavigate } from "react-router-dom";
import MainHeader from "../MainHeader";
import EmployeeSider from "./EmployeeSider";
import UpdateLeadField from "./updateLeadField";
import { useSelector } from "react-redux";
import axios from "axios";
import ReactPaginate from "react-paginate";
import styled from "styled-components";

function EmployeeLead() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [leadSourceFilter, setLeadSourceFilter] = useState("");

  const [endDate, setEndDate] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage] = useState(10);

  const navigate = useNavigate();

  const EmpId = useSelector((state) => state.auth.user.id);

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
  }, []);
  
  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-leads/${EmpId}`
      );
      const data = response.data;
      console.log(data);
      setLeads(data.reverse()); // Reverse the data here
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  

  const handleUpdate = async (lead) => {
    try {
      // Send updated data to the backend using Axios
      const response = await axios.put(
        `https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyLeadStatus/${lead.lead_id}`,
        { lead_status: "in progress" }
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
  useEffect(() => {
    let filtered = leads;

    // Filter by search term
    if (searchTerm) {
      const trimmedSearchTerm = searchTerm.toLowerCase().trim(); // Normalize the search term
      filtered = filtered.filter((lead) =>
        ["name", "lead_no", "leadSource","phone"].some((key) =>
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
  filtered = filtered.filter(
    (lead) => lead.leadSource === leadSourceFilter
  );
}




    if (filterDate) {
      filtered = filtered.filter((lead) => {
        const leadDate = moment(lead.createdTime).format("YYYY-MM-DD");
        return leadDate === filterDate;
      });
    }

    setFilteredLeads(filtered);
  }, [searchTerm, startDate, endDate, leads,filterDate,leadSourceFilter]);

  // Use filteredLeads for pagination
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);


  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
      <MainHeader />
      <EmployeeSider />
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
                 placeholder=" Name,Lead No,Lead Source,Phone No"
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
                <label htmlFor="">Lead Source Filter</label>
                <select
                  value={leadSourceFilter}
                  onChange={(e) => setLeadSourceFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
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
                <label htmlFor="">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border   rounded-2xl p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="">Date</label>
                <input
                  type="date"
                  value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
                  className="border   rounded-2xl p-2 w-full"
                />
              </div>
        
          </div>
          <div className="flex gap-10 text-xl font-semibold my-3 mt-5">
  {/* Total Lead Count */}
  <div>
    Total Lead:{" "}
    {
      leads
        .filter(
          (lead) =>
          
            (!leadSourceFilter || lead.leadSource === leadSourceFilter)
        ).length
    }
  </div>

  {/* Total Lead Visits */}
  <div>
    Total Lead Visit:{" "}
    {
      leads
        .filter(
          (lead) =>
           
            (!leadSourceFilter || lead.leadSource === leadSourceFilter)
        )
        .filter(
          (lead) =>
            ["fresh", "repeated", "self", "associative"].includes(lead.visit)
        ).length
    }
  </div>

  {/* Total Closed Leads */}
  <div>
    Total Closed Lead:{" "}
    {
      leads
        .filter(
          (lead) =>
           
            (!leadSourceFilter || lead.leadSource === leadSourceFilter)
        )
        .filter((lead) => lead.deal_status === "close").length
    }
  </div>
</div>

          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    S.no
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Lead Number
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                   Date
                  </th>
                
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Lead Source
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
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
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {index + 1}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 underline text-[blue]">
          <Link to={`/employee-lead-single-data/${lead.lead_id}`}>
            {lead.lead_no}
          </Link>
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.name}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.status}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
        </td>
     
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.phone}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.leadSource}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {lead.lead_status === "in progress" ? (
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
              Start Work
            </button>
          ) : (
            <button
              className="text-gray-400 font-semibold cursor-not-allowed"
              disabled
            >
              Work Completed
            </button>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="8"
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

export default EmployeeLead;

const Wrapper = styled.div`
  // .tt {
  //   white-space: nowrap;
  //   @media screen and (min-width: 1500px) and (max-width: 1700px) {
  //     width: 89%;
  //     margin-left: 10rem;
  //     white-space: nowrap;
  //   }
  // }
  // .main {
  //   @media screen and (min-width: 1500px) and (max-width: 1700px) {
  //     margin-left: 10rem;
  //   }
  // }
`;
