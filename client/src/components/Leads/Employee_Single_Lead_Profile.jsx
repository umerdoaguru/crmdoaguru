import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../images/lead_profile.png";
import MainHeader from "../MainHeader";
import EmployeeeSider from "../EmployeeModule/EmployeeSider";
import Sider from "../Sider";
import cogoToast from "cogo-toast";
import UpdateLeadField from "../EmployeeModule/updateLeadField";
function Employee_Single_Lead_Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [visit, setVisit] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupVisit, setShowPopupVisit] = useState(false);
  const [showPopupFollowUp, setShowPopupFollowUp] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [render, setRender] = useState(false);

  const [visitLead, setVisitLead] = useState({
    
    lead_id: "",
    name: "",
    employeeId: "",
    employee_name: "",
    visit: "",
    visit_date: "", 

  });
  const [follow_up, setFollow_Up] = useState({
    
    lead_id: "",
    name: "",
    employeeId: "",
    employee_name: "",
    follow_up_type: "",
    follow_up_date: "", 
    report:""

  });

  const [quotationCreated, setQuotationCreated] = useState(false);
  const [visitCreated, setVisitCreated] = useState(false);
  const [followCreated, setFollowCreated] = useState(false);

  // const leads = [{ /* lead data */ }];

  const fieldConfig = [
    {
      name: "lead_status",
      label: "Lead Status",
      type: "select",
      options: [
        { value: "", label: "Select Lead Status" },
        { value: "pending", label: "Pending" },
        { value: "in progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
      ],
    },

    {
      name: "deal_status",
      label: "Deal Status",
      type: "select",
      options: [
        { value: "", label: "Select Deal Status" },
        { value: "pending", label: "pending" },
        { value: "close", label: "close" },
        { value: "cancelled", label: "cancelled" },
      
      ],
    },
    {
      name: "d_closeDate",
      label: "Deal Close Date",
      type: "date", // Changed to "date" for consistency
    },
    {
      name: "reason",
      label: "Reason",
      type: "textarea",
    },
   

    {
      name: "follow_up_status",
      label: "Follow Up Status",
      type: "select",
      options: [
        { value: "", label: "Select Follow Up Status" },
        { value: "pending", label: "Pending" },
        { value: "in progress", label: "In Progress" },
        { value: "done", label: "Done" },
      ],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "", label: "Status" },
        { value: "pending", label: "Pending" },
        { value: "interested", label: "Interested" },
        { value: "not-interested", label: "Not-Interested" },
      ],
    },
    {
      name: "booking_amount",
      label: "Booking Amount",
      type: "text", 
    },
  
   
      {
        name: "payment_mode",
        label: "Payment Mode",
        type: "select",
        options: [
          { value: "", label: "Select Payment Mode" },
          { value: "credit-card", label: "Credit Card" },
          { value: "debit-card", label: "Debit Card" },
          { value: "net-banking", label: "Net Banking" },
          { value: "upi", label: "UPI" },
          { value: "cash", label: "Cash" },
        ],
      },
   
      {
        name: "registry",
        label: "Registry",
        type: "select",
        options: [
          { value: "", label: "Select Payment Mode" },
          { value: "in progress", label: "In Progress" },
          { value: "done", label: "Done" },
         
        ],
      },
  ];

  const [currentLead, setCurrentLead] = useState({
    lead_status: "",
    visit_date: "",
    visit: "",
    quotation_status: "",
    // invoice_status: "",
    deal_status: "",
    booking_amount:"",
      payment_mode:"",
      registry:"",
    reason: "",
    status: "",

    follow_up_status: "",
  });

  useEffect(() => {
    fetchLeads();

    fetchVisit();
    fetchFollowUp();
  }, [id]);
  // const fetchLeads = async () => {
  //   try {
  //     const response = await axios.get(https://crmdemo.vimubds5.a2hosted.com/api/leads/${id});
  //     setLeads(response.data);
  //     console.log(response);
  //   } catch (error) {
  //     console.error("Error fetching quotations:", error);
  //   }
  // };

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/leads/${id}`);
      console.log(response.data);
      setLeads(response.data);

      // Debugging: Log the exact value of the quotation field
      response.data.forEach((lead) => {
        console.log("Lead Quotation Status (raw):", lead.quotation);
      });

      // Ensure proper comparison with 'Created', trim any spaces and normalize the case
      const hasCreatedQuotation = response.data.some(
        (lead) =>
          lead.quotation && lead.quotation.trim().toLowerCase() === "created"
      );

      console.log(
        "Has created quotation (normalized check)?",
        hasCreatedQuotation
      ); // Debugging
      setQuotationCreated(hasCreatedQuotation);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchVisit = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-visit/${id}`
      );
      console.log(response.data);
      setVisit(response.data);
      // Ensure proper comparison with 'Created', trim any spaces and normalize the case
      const hasCreatedvisit = response.data.some(
        (lead) =>
          (lead.visit && lead.visit.trim().toLowerCase() === "fresh") ||
          "repeated"
      );
      setVisitCreated(hasCreatedvisit);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  const fetchFollowUp = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-follow-up/${id}`
      );
      console.log(response.data);
      setFollow_Up(response.data);
      // Ensure proper comparison with 'Created', trim any spaces and normalize the case
      setFollowCreated(response.data[0]);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };
  const handleQuotation = async (lead) => {
    const name = lead.name;
    navigate(`/quotation-by-lead/${lead.lead_id}`, { state: { name } });
  };

  const handleViewQuotation = (lead) => {
    console.log("Lead Object:", lead); // Log the lead object
    const name = lead.name;
    console.log("Lead Name:", name); // Log the name
    navigate(`/View_quotations/${lead.lead_id}`);
    // navigate("/View_quotations");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };
  const handleInputChangeVisit = (e) => {
    const { name, value } = e.target;
    setVisitLead((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };
  const handleInputChangeFollowUp = (e) => {
    const { name, value } = e.target;
    setFollow_Up((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const handleUpdate = (lead) => {
    setIsEditing(true);
    setCurrentLead(lead);
    setShowPopup(true);
  };

  const handleCreateClick = () => {
    setVisitLead({
      lead_id: "",
      name: "",
      employeeId: "",
      employee_name: "",
      visit: "",
      visit_date: "",
    

    });
    setShowPopupVisit(true);
  };
  const handleCreateClickFollowUp = () => {
    setFollow_Up({
      lead_id: "",
      name: "",
      employeeId: "",
      employee_name: "",
      follow_up_type: "",
      follow_up_date: "", 
      report:""

    });
    setShowPopupFollowUp(true);
  };
  const handleViewVisit = () => {
    navigate(`/view_visit/${leads[0].lead_id}`);
  };
  const handleViewFollowUp = () => {
    navigate(`/view_follow_up/${leads[0].lead_id}`);
  };

  const saveChanges = async () => {
    console.log(currentLead);
    if (currentLead.deal_status !== leads[0].deal_status) {
      if (currentLead.d_closeDate === "pending") {
        alert("Please update the deal close date as well");
        return;
      }
    }

    if (currentLead.visit !== leads[0].visit) {
      if (currentLead.visit_date === "pending") {
        alert("Please update the visit date as well");
        return;
      }
    }
    try {
      // Send updated data to the backend using Axios
      const response = await axios.put(
        `https://crmdemo.vimubds5.a2hosted.com/api/updateLeadStatus/${currentLead.lead_id}`,
        currentLead
      );

      if (response.status === 200) {
        console.log("Updated successfully:", response.data);
        cogoToast.success("Lead status updated successfully");
        setRender(!render);
        closePopup(); // Close the popup on success
        fetchLeads();
      } else {
        console.error("Error updating:", response.data);
        cogoToast.error({ general: "Failed to update the lead status." });
      }
    } catch (error) {
      console.error("Request failed:", error);
      cogoToast.error("Failed to update the lead status.");
    }
  };
  
  const saveVisit = async () => {
    // Validate required fields
    if (!visitLead.visit) {
      cogoToast.error("Please select a visit type.");
      return;
    }
    if (!visitLead.visit_date) {
      cogoToast.error("Please select a visit date.");
      return;
    }
   
  
    console.log(visitLead);
  
    try {
      // Send updated data to the backend using Axios
      const response = await axios.post(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-visit`,
        {
          lead_id: leads[0].lead_id,
          name: leads[0].name,
          employeeId: leads[0].employeeId,
          employee_name: leads[0].assignedTo,
          visit: visitLead.visit,
          visit_date: visitLead.visit_date,
         
        }
      );
  
      if (response.status === 201) {
        console.log("Updated successfully:", response.data);
        cogoToast.success("Visit created successfully");
  
        // Update the visit status after saving the visit
        const updateResponse = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/updateVisitStatus/${leads[0].lead_id}`,
          { visit: visitLead.visit }
        );
  
        if (updateResponse.status === 200) {
          console.log("Visit status updated successfully:", updateResponse.data);
          cogoToast.success("Visit status updated successfully");
        } else {
          console.error("Error updating visit status:", updateResponse.data);
          cogoToast.error("Failed to update visit status.");
        }
  
        closePopupVisit(); // Close the popup on success
        fetchVisit();
        fetchLeads();
      } else {
        console.error("Error updating visit:", response.data);
        cogoToast.error("Failed to create visit.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      cogoToast.error("Failed to create visit.");
    }
  };
  // Validate required fields
  // if (!follow_up.follow_up_type) {
  //   cogoToast.error("Please select a follow up type.");
  //   return;
  // }
  // if (!follow_up.follow_up_date) {
  //   cogoToast.error("Please select a follow up date.");
  //   return;
  // }
 
  const saveFollowUp = async () => {
    console.log(follow_up);
    if (!follow_up.follow_up_type) {
      cogoToast.error("Please select a follow up type.");
      return;
    }
    if (!follow_up.follow_up_date) {
      cogoToast.error("Please select a folllow up date.");
      return;
    }
    if (!follow_up.report) {
      cogoToast.error("Please Enter a report.");
      return;
    }
  
    try {
      // Send updated data to the backend using Axios
      const postResponse = await axios.post(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-follow-up`,
        {
          lead_id: leads[0].lead_id,
          name: leads[0].name,
          employeeId: leads[0].employeeId,
          employee_name: leads[0].assignedTo,
          follow_up_type: follow_up.follow_up_type,
          follow_up_date: follow_up.follow_up_date,
          report: follow_up.report
        }
      );
  
      if (postResponse.status === 201) {
        console.log("Follow-up created successfully:", postResponse.data);
        cogoToast.success("Follow-up created successfully");
  
        // Update the Follow Up status after saving the Follow Up
        const putResponse = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyFollowUpStatus/${leads[0].lead_id}`,
          { follow_up_status: "in progress" }
        );
  
        if (putResponse.status === 200) {
          console.log("Status updated successfully:", putResponse.data);
        } else {
          console.error("Error updating status:", putResponse.data);
          cogoToast.error("Failed to update the lead status.");
        }
  
        // Close the popup on success
        closePopupFollowUp();
        fetchFollowUp();
        fetchLeads();
      } else {
        console.error("Error creating follow-up:", postResponse.data);
        cogoToast.error("Failed to create follow-up.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      cogoToast.error("Failed to create follow-up.");
    }
  };
  
  


  const closePopup = () => {
    setShowPopup(false);
  };
  const closePopupVisit = () => {
    setShowPopupVisit(false);
  };
  const closePopupFollowUp = () => {
    setShowPopupFollowUp(false);
  };
  
  const totalVisit = visit.length;
console.log(totalVisit);

  return (
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="flex flex-col 2xl:ml-44 mt-2">
        <div className="container mt-5 px-2 mx-auto p-4">
          <h1 className="text-2xl text-center mt-[2rem]">Leads Profile</h1>
          <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
          <div className="flex flex-wrap mb-4">
            <div className="w-full lg:w-1/3">
              <img src={img} alt="doctor-profile" className=" rounded-lg" />
            </div>
            {leads.map((lead, index) => (
              <div className="w-full lg:w-2/3 ">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-info">Lead Number</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.lead_no}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info">Name</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0 break-words">{lead.name}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info">Assigned To</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.assignedTo}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info">Mobile Number</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.phone}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info">Lead Source</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.leadSource}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-info">Subject</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.subject}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-info">Lead Status</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.lead_status}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info"> Date</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">
                     
                        {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className=" flex justify-between">
            <div className="">
              <button
                onClick={() => handleQuotation(leads[0])}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Quotation Creation
              </button>
              <button
                className="bg-orange-500 text-white px-4 py-2 mx-2 rounded"
                onClick={handleCreateClick}
              >
                Visit Creation
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2  rounded"
                onClick={handleCreateClickFollowUp}
              >
                Follow Up Creation
              </button>
            </div>
            <div className="">
              {/* Conditionally render the View Quotation button */}
              <div className="flex">
                {quotationCreated ? (
                  <button
                    onClick={() => handleViewQuotation(leads[0])}
                    className="bg-blue-500 text-white px-4 py-2 mx-2 rounded"
                  >
                    View Quotation
                  </button>
                ) : (
                  <p className="text-white bg-red-400 text-center px-4 py-2 mx-2 rounded">
                    Quotation not yet created
                  </p>
                )}

                {/* Conditionally render the View Quotation button */}
                {visitCreated ? (
                  <button
                    onClick={handleViewVisit}
                    className="bg-green-500 text-white px-4 py-2 mx-2 rounded"
                  >
                    View Visit
                  </button>
                ) : (
                  <p className="text-white bg-red-400 text-center px-4 py-2  rounded">
                    Visit not yet created
                  </p>
                )}

{followCreated ? (
  <button
    onClick={handleViewFollowUp}
    className="bg-yellow-500 text-white px-4 py-2 mx-2 rounded"
  >
    View Follow Up
  </button>
) : (
  <p className="text-white bg-red-400 text-center px-4 py-2 mx-2 rounded">
    Follow Up not yet created
  </p>
)}

              </div>
            </div>
          </div>

          <div className="overflow-x-auto mt-5">
            <table className="min-w-full whitespace-nowrap bg-white border">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Assigned To
                  </th>
                 
              
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Quotation
                  </th>
                
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Visit
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Deal Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Deal Close Date
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Booking Amount
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                   Payment Mode 
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                   Registry
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Reason
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Follow Up Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Lead Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    {" "}
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.assignedTo}
                    </td>

                   
                
              
                    <td className="px-6 py-4  border-b border-gray-200 text-gray-800">
                      {lead.quotation}
                    </td>

                  

                    <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[black]">
                      {lead.status}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[black]">
                      {lead.visit}
                    </td>

                    {lead.deal_status === "pending" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[red]">
                        {lead.deal_status}
                      </td>
                    )}

                    {lead.deal_status === "close" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[green]">
                        {lead.deal_status}
                      </td>
                    )}
                    {lead.deal_status === "cancelled" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[blue]">
                        {lead.deal_status}
                      </td>
                    )}
                    {lead.deal_status === "in-progress" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[blue]">
                        {lead.deal_status}
                      </td>
                    )}

                    <td className="px-6 py-4  border-b border-gray-200 text-gray-800">
                      {lead.d_closeDate}
                    </td>
                    <td className="px-6 py-4  border-b border-gray-200 text-gray-800">
                      {lead.booking_amount}
                    </td>
                    <td className="px-6 py-4  border-b border-gray-200 text-gray-800">
                      {lead.payment_mode}
                    </td>
                    <td className="px-6 py-4  border-b border-gray-200 text-gray-800">
                      {lead.registry}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-800">
                      {lead.reason}
                    </td>

                    {lead.lead_working_status === "pending" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[red]">
                        {lead.lead_working_status}
                      </td>
                    )}
                    {lead.lead_working_status === "in progress" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[yellow]">
                        {lead.lead_working_status}
                      </td>
                    )}
                    {lead.lead_working_status === "completed" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[green]">
                        {lead.lead_working_status}
                      </td>
                    )}

                    {lead.follow_up_status === "pending" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[red]">
                        {lead.follow_up_status}
                      </td>
                    )}

                    {lead.follow_up_status === "in progress" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-amber-600">
                        {lead.follow_up_status}
                      </td>
                    )}
                    {lead.follow_up_status === "done" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[green]">
                        {lead.follow_up_status}
                      </td>
                    )}
                    {lead.lead_status === "pending" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[red]">
                        {lead.lead_status}
                      </td>
                    )}

                    {lead.lead_status === "in progress" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[orange]">
                        {lead.lead_status}
                      </td>
                    )}
                    {lead.lead_status === "completed" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[green]">
                        {lead.lead_status}
                      </td>
                    )}
                    <td className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-800">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleUpdate(lead)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showPopup && (
            <div className=" fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="w-75 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto mx-4 my-5">
                <h2 className="text-xl font-semibold mb-4">
                  {isEditing ? "Update Status" : ""}
                </h2>

                {/* Render Form Fields */}
                {fieldConfig.map((field) => (
                  <UpdateLeadField
                    key={field.name}
                    field={field}
                    value={currentLead[field.name]}
                    onChange={handleInputChange}
                  />
                ))}

                {/* Save and Cancel Buttons */}
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveChanges}
                  >
                    Save
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

          {showPopupVisit && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-xl mb-4">{"Add Site Visit"}</h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Number</label>
                  <input
                    type="number"
                    name="lead_no"
                    value={leads[0].lead_no}
                    onChange={handleInputChangeVisit}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={leads[0].name}
                    onChange={handleInputChangeVisit}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
            
                <div className="mb-4">
                  <label className="block text-gray-700">Visit</label>
                  <select
                    name="visit"
                    value={visitLead.visit}
                    onChange={handleInputChangeVisit}
                    className="border rounded-2xl p-2 w-full"
                  >
                    <option value="">Select Visit Type</option>
                    <option value="fresh">Fresh</option>
                    <option value="re-visit">Re-Visit</option>
                    <option value="self">Self</option>
                    <option value="associative">Associative</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Visit Date</label>
                  <input
                    type="date"
                    name="visit_date"
                    value={visitLead.visit_date}
                    onChange={handleInputChangeVisit}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>

               

                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveVisit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={closePopupVisit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {showPopupFollowUp && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-xl mb-4">{"Add Follow Up"}</h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Number</label>
                  <input
                    type="number"
                    name="lead_no"
                    value={leads[0].lead_no}
                    onChange={handleInputChangeFollowUp}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={leads[0].name}
                    onChange={handleInputChangeFollowUp}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
            
                <div className="mb-4">
                  <label className="block text-gray-700">Follow Up Type</label>
                  <select
                    name="follow_up_type"
                    value={follow_up.follow_up_type}
                    onChange={handleInputChangeFollowUp}
                    className="border rounded-2xl p-2 w-full"
                  >
                    <option value="">Select Follow Type</option>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="in-person">In Person</option>
                    <option value="whatsapp-chat">Whatsapp Chat</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Follow Up Date</label>
                  <input
                    type="date"
                    name="follow_up_date"
                    value={follow_up.follow_up_date}
                    onChange={handleInputChangeFollowUp}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Report</label>
                  <input
                    type="text"
                    name="report"
                    value={follow_up.report}
                    onChange={handleInputChangeFollowUp}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>

               

                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveFollowUp}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={closePopupFollowUp}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Employee_Single_Lead_Profile;
