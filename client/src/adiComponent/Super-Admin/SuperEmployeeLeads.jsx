import React, { useState, useEffect } from "react";
import moment from "moment";

import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import MainHeader from "./../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";
import cogoToast from "cogo-toast";
import Super_Single_Lead_Profile from "./Super_Single_Lead_Profile";
import { useSelector } from "react-redux";
import { BsTrash } from "react-icons/bs";

function SuperEmployeeLeads() {  
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(10);
  const [leadSourceFilter, setLeadSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("");
  const [dealFilter, setDealFilter] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("");
  const [leadnotInterestedStatusFilter, setLeadnotInterestedStatusFilter] = useState("");
  const [meetingStatusFilter, setMeetingStatusFilter] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [isModalOpenLeadProfile, setIsModalOpenLeadProfile] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [monthFilter, setMonthFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desce"); 

  const [activeDropdown, setActiveDropdown] = useState("");
 const [admins, setAdmins] = useState([]);
  


  const [currentLead, setCurrentLead] = useState({

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
    email_id:"NULL"
   
  });

  const [showPopup, setShowPopup] = useState(false);
  const [loading , setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [customLeadSource, setCustomLeadSource] = useState("");
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  


  const navigate = useNavigate();

  const { id } = useParams();

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
    fetchEmployees();
    fetchAdmins();
    // fetchVisit();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(

          //  `https://crm.dentalguru.software/api/employe-leads/${id}`
            "https://crm.dentalguru.software/api/leads-super-admin",
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }}
      );
      const data = response.data;
      console.log(data);
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
 
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://crm.dentalguru.software/api/employee-super-admin",
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
    // Fetch all admins from the backend
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          "https://crm.dentalguru.software/api/getAllAdmins",
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

  const handleInputChange = (e) => {
    setModalData({
      ...modalData,
      [e.target.name]: e.target.value,
    });
  };

  const updateAnswerRemark = async () => {
    try {
      const response = await axios.put(`https://crm.dentalguru.software/api/updateOnlyAnswerRemark`, modalData);
      if (response.status === 200) {
        cogoToast.success("AnswerRemark updated successfully!");
       fetchLeads();
        closeModal(); // Close the modal
      }
    } catch (error) {
      console.error("Error updating AnswerRemark:", error);
    }
  };

  

  const handleSearch = (value) =>{
    if(value === ' '){
      return;
    }
    setSearchTerm(value);
  }

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
  
    // Filter by employee
    if (employeeFilter) {
      filtered = filtered.filter((lead) => lead.assignedTo === employeeFilter);
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
    employeeFilter,
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


  // const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const currentLeads = leadsPerPage === Infinity ? filteredLeads : filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

const validateForm = () => {
  let formErrors = {};
  let isValid = true;


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

const handleInputChangelead = (e) => {
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
  
  setCurrentLead({
  
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
    email_id:"",
   
  });
  setShowPopup(true);
};

const handleCustomLeadSourceChange = (e) => {
  setCustomLeadSource(e.target.value);
};


const saveChanges = async () => {
  if (validateForm()) {
    // Use custom lead source if "Other" is selected
    const leadData = {
      ...currentLead,
      leadSource:
        currentLead.leadSource === "Other"
          ? customLeadSource
          : currentLead.leadSource,
           assignedBy: "Super Admin"
    };

    try {
      setLoading(true)
    
     
        // Create new lead
        await axios.post("https://crm.dentalguru.software/api/leads", leadData);

        // Construct WhatsApp message link with encoded parameters
        const whatsappLink = `https://wa.me/${currentLead.employeephone}?text=Hi%20${currentLead.assignedTo},%20you%20have%20been%20assigned%20a%20new%20lead%20with%20the%20following%20details:%0A%0A1)%20Name:%20${currentLead.name}%0A3)%20Phone%20Number:%20${currentLead.phone}%0A4)%20Lead%20Source:%20${currentLead.leadSource}%0A5)%20Address:%20${currentLead.address}%0A6)%20Project:%20${currentLead.subject}%0A%0APlease%20check%20your%20dashboard%20for%20details.`;

        // Open WhatsApp link in a new tab
        window.open(whatsappLink, "_blank");
      
        closePopup();
     
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Error saving lead:", error);
    }
  }
};

const closePopup = () => {
  setShowPopup(false);
  setErrors({});
};
const handleDeleteClick = async (id) => {
  const isConfirmed = window.confirm(
    "Are you sure you want to delete this data?"
  );
  if (isConfirmed) {
    try {
      await axios.delete(`https://crm.dentalguru.software/api/leads/${id}`);
      fetchLeads(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  }
};





const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleLeadsPerPageChange = (e) => {
    const value = e.target.value;
    setLeadsPerPage(value === "All" ? Infinity : parseInt(value, 10));
    setCurrentPage(0); // Reset to the first page
  };
  

  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  // Function to open modal and set lead_id
const handleRowClick = (leadId) => {
  setSelectedLeadId(leadId);
  setIsModalOpenLeadProfile(true);
};

// Function to close the modal
const closeModalLead = () => {
  setIsModalOpenLeadProfile(false);
  setSelectedLeadId(null);
};

  // Toggle sort order
  const toggleSortOrder = () => {
  setSortOrder((prevOrder) => (prevOrder === "desce" ? "asce" : "desce"));
};

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <Wrapper>
        <div className="container mt-28 2xl:ml-40">
          <div className="main 2xl:w-[89%] ">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors max-2xl:ml-[4rem]"
              >
                Back
              </button>
              <h1 className="text-xl sm:text-2xl text-center">
                Leads Management{" "}
              </h1>
            </div>
            <div className="mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                onClick={handleCreateClick}
              >
                Add Lead
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-4"></div>

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
                     <option value="Scrap">Scrap</option>
                     <option value="Organic">Organic</option>

                    <option value="Referrals">Referrals</option>
                    <option value="Cold Calling">Cold Calling</option>
                    <option value="Email Campaigns">Email Campaigns</option>
                     <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
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
                  <option value="duplicate lead">Duplicate Lead</option>
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
<div>
                <label htmlFor="">Employee Filter</label>
                <select
                  name="assignedTo"
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                   employeeFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.employee_id} value={employee.name}>
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

          <div className="overflow-x-auto mt-2 3xl:w-[90%] 2xl:w-[100%]">
        

            <table className="tt min-w-full bg-white border whitespace-nowrap">
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
                    Assigned By 
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Deal Status
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Meeting Status
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
        key={index}
        className={index % 2 === 0 ? "bg-gray-100" : ""}
      >
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 ">
        {leadsPerPage === Infinity ? index + 1 : index + 1 + currentPage * leadsPerPage}
        </td>
        <td
  className="px-6 py-4 border-b border-gray-200 underline text-[blue] cursor-pointer font-semibold"
  onClick={() => handleRowClick(lead.lead_id)}
>
  {lead.lead_id}
</td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 text-wrap font-semibold">
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
            {lead.assignedBy}
          </td>
          <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                          {lead.deal_status}
                        </td>
          <td className="px-6 py-4 border-b border-gray-200 font-semibold">
            {lead.meeting_status}
          </td>
      
       
      
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
          {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
        <button
                          className="text-red-500 hover:text-red-700 mx-2"
                          onClick={() => handleDeleteClick(lead.lead_id)}
                        >
                          <BsTrash size={20} />
                        </button>

        </td>
      
      
       
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={15} className="py-4 text-center">
        No data found
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>

          {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
      <h2 className="text-xl mb-4 font-bold">Edit Visit</h2>
      <form>
    
        
        <div className="mb-4">
          <label className="block text-gray-700">Remark Status:</label>
          <input
            type="text"
            name="remark_status"
            value={modalData.remark_status || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Answer Remarks</label>
          <input
            type="text"
            name="answer_remark"
            value={modalData.answer_remark || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>


        <div className="flex justify-end">
          <button
            type="button"
            onClick={updateAnswerRemark}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            Update
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

<div className="mt-4 flex mb-4 justify-center 2xl:w-[89%]">
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
                  {"Add Lead"}
                </h2>


                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentLead.name}
                    onChange={handleInputChangelead}
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
                    onChange={handleInputChangelead}
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
                    onChange={handleInputChangelead}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Lead Source</option>

                    <option value="Referrals">Referrals</option>
                    <option value="Cold Calling">Cold Calling</option>
                    <option value="Email Campaigns">Email Campaigns</option>
                     <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
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
                  <label className="block text-gray-700">Email Id (Optional)</label>
                  <input
                    type="email"
                    name="email_id"
                    value={currentLead.email_id}
                    onChange={handleInputChangelead}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                  
                </div>
                     
                <div className="mb-4">
                  <label className="block text-gray-700">Assigned To</label>
                  <select
                    name="assignedTo"
                    value={currentLead.assignedTo}
                    onChange={handleInputChangelead}
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
                    onChange={handleInputChangelead}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  />
                  {errors.createdTime && (
                    <span className="text-red-500">{errors.createdTime}</span>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Project</label>
                  <input
                    type="text"
                    name="subject"
                    value={currentLead.subject}
                    onChange={handleInputChangelead}
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
                    onChange={handleInputChangelead}
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
                    onClick={saveChanges} disabled = {loading}
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
{isModalOpenLeadProfile && selectedLeadId && (
       <div className=" fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[1055]">
              <div className="w-75 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto mx-4 my-5">
     
              <Super_Single_Lead_Profile id={selectedLeadId} closeModalLead={closeModalLead} />
            
    </div>
  </div>
)}
      </Wrapper>
    </>
  );
}

export default SuperEmployeeLeads;

const Wrapper = styled.div`

`;
