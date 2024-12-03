import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/MainHeader";
import Sider from "../components/Sider";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import ToDoList from "./../adiComponent/Todo";
import styled from "styled-components";
import ReactPaginate from "react-paginate";

function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentLead, setCurrentLead] = useState({
    lead_no: "",
    assignedTo: "",
    employeeId: "",
    employeephone: "",
    createdTime: "", // Added here
    name: "",
    phone: "",
    leadSource: "",
    subject: "",
    address: "",
    actual_date: "",
  });
  const [customLeadSource, setCustomLeadSource] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage] = useState(10);
  const [leadSourceFilter, setLeadSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("");
  const [dealFilter, setDealFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [visit, setVisit] = useState([]);
  const [loading , setLoading] = useState(false)

  // Fetch leads and employees from the API
  useEffect(() => {
    fetchLeads();
    fetchEmployees();
    // fetchVisit();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        "https://crmdemo.vimubds5.a2hosted.com/api/leads"
      );
      setLeads(response.data);
      console.log(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/employee");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  // const fetchVisit = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://crmdemo.vimubds5.a2hosted.com/api/employe-all-visit`
  //     );
  //     console.log(response.data);
  //     setVisit(response.data);
  //     // Ensure proper comparison with 'Created', trim any spaces and normalize the case
  //   } catch (error) {
  //     console.error("Error fetching quotations:", error);
  //   }
  // };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!currentLead.lead_no) {
      formErrors.lead_no = "Lead number is required";
      isValid = false;
    }

    if (!currentLead.assignedTo) {
      formErrors.assignedTo = "Assigned To field is required";
      isValid = false;
    }

    if (!currentLead.name) {
      formErrors.name = "Name is required";
      isValid = false;
    }
    if (!currentLead.createdTime) {
      formErrors.createdTime = "Date is required";
      isValid = false;
    }

    if (!currentLead.phone) {
      formErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(currentLead.phone)) {
      formErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!currentLead.leadSource) {
      formErrors.leadSource = "Lead Source is required";
      isValid = false;
    }
    if (!currentLead.subject) {
      formErrors.subject = "Subject is required";
      isValid = false;
    }
    if (!currentLead.address) {
      formErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevLead) => {
      const updatedLead = { ...prevLead, [name]: value };

      // If createdTime changes, update actual_date accordingly
      if (name === "createdTime") {
        updatedLead.actual_date = value; // Copy createdTime to actual_date
      }

      // If assignedTo changes, update employeeId and employeephone accordingly
      if (name === "assignedTo") {
        const selectedEmployee = employees.find(
          (employee) => employee.name === value
        );
        if (selectedEmployee) {
          updatedLead.employeeId = selectedEmployee.employeeId;
          updatedLead.employeephone = selectedEmployee.phone; // Store employee's phone number in employeephone
        } else {
          updatedLead.employeeId = ""; // Reset if no match
          updatedLead.employeephone = ""; // Reset employeephone if no match
        }
      }

      return updatedLead;
    });
  };

  const handleCreateClick = () => {
    setIsEditing(false);
    setCurrentLead({
      lead_no: "",
      assignedTo: "",
      employeeId: "",
      employeephone: "",
      name: "",
      phone: "",
      leadSource: "",
      createdTime: "", // Clear out createdTime for new lead
      subject: "",
      address: "",
      actual_date: "",
    });
    setShowPopup(true);
  };

  const handleEditClick = (lead) => {
    setIsEditing(true);
    setCurrentLead({
      ...lead,
      createdTime: moment(lead.createdTime).format("YYYY-MM-DD"), // Format the createdTime
      actual_date: moment(lead.createdTime).format("YYYY-MM-DD"), // Format the createdTime
    });
    setShowPopup(true);
  };

  const handleLeadSourceChange = (e) => {
    const { value } = e.target;
    setCurrentLead((prevLead) => ({ ...prevLead, leadSource: value }));

    // Reset custom lead source if the selected value is not "Other"
    if (value !== "Other") {
      setCustomLeadSource("");
    }
  };

  const handleCustomLeadSourceChange = (e) => {
    setCustomLeadSource(e.target.value);
  };


  // const saveChanges = async () => {
  //   if (validateForm()) {
  //     // Use custom lead source if "Other" is selected
  //     const leadData = {
  //       ...currentLead,
  //       leadSource:
  //         currentLead.leadSource === "Other"
  //           ? customLeadSource
  //           : currentLead.leadSource,
  //     };

  //     try {
  //       if (isEditing) {
  //         await axios.put(
  //           `https://crmdemo.vimubds5.a2hosted.com/api/leads/${currentLead.lead_id}`,
  //           leadData
  //         );
  //         fetchLeads(); // Refresh the list
  //         closePopup();
  //       } catch (error) {
  //         console.error("Error updating lead:", error);
  //       }
  //     }

  //        else {
  //         try {

  //         await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/leads", leadData);
  //         const whatsappLink = `https://wa.me/${currentLead.employeephone}?text=Hi%20${currentLead.assignedTo},%20you%20have%20been%20assigned%20a%20new%20lead%20with%20the%20following%20details:%0A%0A1)%20Lead%20No.%20${currentLead.lead_no}%0A2)%20Name:%20${currentLead.name}%0A3)%20Phone%20Number:%20${currentLead.phone}%0A4)%20Lead%20Source:%20${currentLead.leadSource}%0A5)%20Address:%20${currentLead.address}%0A6)%20Subject:%20${currentLead.subject}%0A%0APlease%20check%20your%20dashboard%20for%20details.`;

  //         // Open WhatsApp link
  //         window.open(whatsappLink, "_blank");
  //         fetchLeads(); // Refresh the list
  //         closePopup();
        
  

  //     } catch (error) {
  //       console.error("Error saving lead:", error);
  //     }
  //   }
  // };

  const saveChanges = async () => {
    if (validateForm()) {
      // Use custom lead source if "Other" is selected
      const leadData = {
        ...currentLead,
        leadSource:
          currentLead.leadSource === "Other"
            ? customLeadSource
            : currentLead.leadSource,
             assignedBy: "Admin"
      };
  
      try {
        setLoading(true)
        if (isEditing) {
          // Update existing lead
          await axios.put(
            `https://crmdemo.vimubds5.a2hosted.com/api/leads/${currentLead.lead_id}`,
            leadData
          );
          fetchLeads(); // Refresh the list
          closePopup();
        } else {
          // Create new lead
          await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/leads", leadData);
  
          // Construct WhatsApp message link with encoded parameters
          const whatsappLink = `https://wa.me/${currentLead.employeephone}?text=Hi%20${currentLead.assignedTo},%20you%20have%20been%20assigned%20a%20new%20lead%20with%20the%20following%20details:%0A%0A1)%20Lead%20No.%20${currentLead.lead_no}%0A2)%20Name:%20${currentLead.name}%0A3)%20Phone%20Number:%20${currentLead.phone}%0A4)%20Lead%20Source:%20${currentLead.leadSource}%0A5)%20Address:%20${currentLead.address}%0A6)%20Subject:%20${currentLead.subject}%0A%0APlease%20check%20your%20dashboard%20for%20details.`;
  
          // Open WhatsApp link in a new tab
          window.open(whatsappLink, "_blank");
          fetchLeads(); // Refresh the list
          closePopup();
        }
        setLoading(false)
      } 
      catch (error) {
        setLoading(false)
        console.error("Error saving lead:", error);
      }
    }
  };
  


  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`https://crmdemo.vimubds5.a2hosted.com/api/leads/${id}`);
        fetchLeads(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting lead:", error);
      }
    }
  };

 
  useEffect(() => {
    let filtered = leads;
    console.log(filtered);
   
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
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    // Filter by visit
    if (visitFilter) {
      filtered = filtered.filter((visit) => visit.visit === visitFilter);
    }

    // Filter by Deak
    if (dealFilter) {
      filtered = filtered.filter((deal) => deal.deal_status === dealFilter);
    }
    if (employeeFilter) {
      filtered = filtered.filter(
        (employee) => employee.assignedTo === employeeFilter
      );
    }

    console.log(filtered);
    setFilteredLeads(filtered);
    setCurrentPage(0); // Reset to first page on filter change
  }, [
    searchTerm,
    startDate,
    endDate,
    leads,
    leadSourceFilter,
    statusFilter,
    visitFilter,
    dealFilter,
    employeeFilter,
  ]);

  const closePopup = () => {
    setShowPopup(false);
    setErrors({});
  };

  // const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);
  // const currentLeads = filteredLeads.slice(
  //   currentPage * leadsPerPage,
  //   (currentPage + 1) * leadsPerPage
  // );

  // const handlePageClick = (data) => {
  //   setCurrentPage(data.selected);
  // };

  // Calculate total number of pages
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
      <Header />
      <Sider />
      <>
        <div className="container  2xl:ml-40">
          <div className="main 2xl:w-[89%]">
            <h1 className="text-2xl text-center mt-[5rem] font-medium">
              Leads Management
            </h1>
            <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

            {/* Button to create a new lead */}
            <div className="mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                onClick={handleCreateClick}
              >
                Add Lead
              </button>
            </div>
          
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
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All Lead Sources</option>
                  <option value="Facebook">Facebook</option>
                  <option value="One Realty Website">One Realty Website</option>
                  <option value="99 Acres">99 Acres</option>
                  <option value="Referrals">Referrals</option>
                  <option value="Trade Shows">Trade Shows</option>
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
                  <option value="Online Directories">Online Directories</option>
                </select>
              </div>

              <div>
                <label htmlFor="">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All Status</option>
                       <option default value="pending">
                    Pending
                  </option>
                  <option value="interested">Interested</option>
                  <option value="not-interested">Non-Interested</option>
                </select>
              </div>
              <div>
                <label htmlFor="">Visit Filter</label>
                <select
                  value={visitFilter}
                  onChange={(e) => setVisitFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All visit</option>
                  <option value="fresh">Fresh Visit</option>
                  <option value="re-visit">Re-Visit</option>
                  <option value="associative">Associative Visit</option>
                  <option value="self">Self Visit</option>
                </select>
              </div>
              <div>
                <label htmlFor="">Deal Filter</label>
                <select
                  value={dealFilter}
                  onChange={(e) => setDealFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All Deal</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="close">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label htmlFor="">Employee Filter</label>
                <select
                  name="assignedTo"
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  className={`border rounded-2xl p-2 w-full`}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.employee_id} value={employee.name}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
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
            (!employeeFilter || lead.assignedTo === employeeFilter) &&
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
            (!employeeFilter || lead.assignedTo === employeeFilter) &&
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
            (!employeeFilter || lead.assignedTo === employeeFilter) &&
            (!leadSourceFilter || lead.leadSource === leadSourceFilter)
        )
        .filter((lead) => lead.deal_status === "close").length
    }
  </div>
</div>

          <div className=" overflow-x-auto mt-4 whitespace-nowrap  2xl:w-[89%]">
         

            <table className="min-w-full bg-white border">
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
                    Phone
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Lead Source
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Assigned To
                  </th>
                 
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Lead Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Deal Status
                  </th>
                  
                 
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.length === 0 ? (
                  <tr>
                    <td
                      colSpan="11"
                      className="px-6 py-4 border-b border-gray-200 text-center text-gray-500"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  currentLeads.map((lead, index) => {
                      console.log(lead, "fdfsdfsdfsdfds");
                      
                    return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : ""}
                    >
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 underline text-[blue]">
                        <Link to={`/lead-single-data/${lead.lead_id}`}>
                          {lead.lead_no}
                        </Link>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.phone}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.leadSource}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.assignedTo}
                      </td>
                     
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.address}
                      </td>

                      {/* Lead Status */}
                      <td
                        className={`px-6 py-4 border-b border-gray-200 font-semibold ${
                          lead.lead_status === "pending"
                            ? "text-[red]"
                            : lead.lead_status === "in progress"
                            ? "text-[orange]"
                            : "text-[green]"
                        }`}
                      >
                        {lead.lead_status}
                      </td>

                      {/* Status */}
                      <td
                        className={`px-6 py-4 border-b border-gray-200 font-semibold ${
                          lead.status === "pending"
                            ? "text-[red]"
                            : lead.status === "in progress"
                            ? "text-[orange]"
                            : "text-[black]"
                        }`}
                      >
                        {lead.status}
                      </td>

                      {/* Visit Status */}
                      

                  

                      {/* Created Time */}
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditClick(lead)}
                        >
                          <BsPencilSquare size={20} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 mx-2"
                          onClick={() => handleDeleteClick(lead.lead_id)}
                        >
                          <BsTrash size={20} />
                        </button>
                      </td>
                    </tr>
                  )})
                )}
              </tbody>
            </table>
          </div>
            <div className="2xl:w-[89%] mt-4 mb-3 flex justify-center">
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

          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md p-6 mx-2 bg-white rounded-lg shadow-lg h-[95%] overflow-y-auto">
                <h2 className="text-xl mb-4">
                  {isEditing ? "Edit Lead" : "Add Lead"}
                </h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Number</label>
                  <input
                    type="number"
                    name="lead_no"
                    value={currentLead.lead_no}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.lead_no ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.lead_no && (
                    <span className="text-red-500">{errors.lead_no}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Assigned To</label>
                  <select
                    name="assignedTo"
                    value={currentLead.assignedTo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.assignedTo ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.employee_id} value={employee.name}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                  {errors.assignedTo && (
                    <span className="text-red-500">{errors.assignedTo}</span>
                  )}
                </div>

                {/* Hidden employeeId field */}
                <input
                  type="hidden"
                  id="employeeId"
                  name="employeeId"
                  value={currentLead.employeeId}
                />

                <div className="mb-4">
                  <label className="block text-gray-700">Assign Date</label>
                  <input
                    type="date"
                    name="createdTime"
                    value={currentLead.createdTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  />
                  {errors.createdTime && (
                    <span className="text-red-500">{errors.createdTime}</span>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentLead.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={currentLead.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.phone && (
                    <span className="text-red-500">{errors.phone}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Source</label>
                  <select
                    name="leadSource"
                    id="leadSource"
                    value={currentLead.leadSource}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Lead Source</option>

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
                    <option value="Other">Other</option>
                  </select>
                  {currentLead.leadSource === "Other" && (
                    <input
                      type="text"
                      value={customLeadSource}
                      onChange={handleCustomLeadSourceChange}
                      placeholder="Enter custom lead source"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  )}
                  {errors.leadSource && (
                    <p className="text-red-500 text-xs">{errors.leadSource}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={currentLead.subject}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.subject ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.subject && (
                    <span className="text-red-500">{errors.subject}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={currentLead.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.address && (
                    <span className="text-red-500">{errors.address}</span>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveChanges}  disabled = {loading}
                  >
                     {loading ? 'Save...' : 'Save'}
                  </button>

                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={closePopup}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
           
        </div>
      </>
    </>
  );
}

export default Leads;
