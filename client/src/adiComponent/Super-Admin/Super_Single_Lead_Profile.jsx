import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../images/lead_profile.png";
import MainHeader from "../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";

function Super_Single_Lead_Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [visit, setVisit] = useState([]);
  const [quotationCreated, setQuotationCreated] = useState(false);
  const [visitCreated, setVisitCreated] = useState(false);
  const [followCreated, setFollowCreated] = useState(false);




   
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
  
  const fetchFollowUp = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-follow-up/${id}`
      );
      console.log(response.data);
    
      // Ensure proper comparison with 'Created', trim any spaces and normalize the case
      setFollowCreated(response.data[0]);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  
  

  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
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
  const handleViewQuotation = (lead) => {
    console.log("Lead Object:", lead); // Log the lead object
    const name = lead.name;
    console.log("Lead Name:", name); // Log the name
    navigate(`/super_view_quotations/${lead.lead_id}`);


    
    // navigate("/View_quotations");
  };
  const handleViewVisit = () => {
    navigate(`/super_view_visit/${leads[0].lead_id}`);
  };
  const handleViewFollowUp = () => {
    navigate(`/super_view_follow_up/${leads[0].lead_id}`);
  };

  useEffect(() => {
    fetchLeads();
fetchFollowUp();
    fetchVisit();
  }, [id]);

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="container mt-5 px-2 mx-auto p-4">
        <button
          onClick={handleBackClick}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
        <h1 className="text-2xl text-center mt-[2rem]">Leads Profile</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
        <div className="flex flex-wrap mb-4 2xl:ml-44 mt-2">
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
                  <label className="text-info">Created Date</label>
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

        <div className="2xl:ml-44 mt-2">
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
                    className="bg-green-500 text-white px-4 py-2 mx-1 rounded"
                  >
                    View Visit
                  </button>
                ) : (
                  <p className="text-white bg-red-400 text-center px-4 py-2 rounded">
                    Visit not yet created
                  </p>
                )}
                {followCreated ? (
  <button
    onClick={handleViewFollowUp}
    className="bg-yellow-500 text-white px-4 py-2 mx-1 rounded"
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

   
        <div className="overflow-x-auto mt-5 2xl:ml-44">
            <table className="min-w-full whitespace-nowrap bg-white border">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Assigned To
                  </th>
                 
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Visit
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

                    <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[black]">
                      {lead.visit}
                    </td>
                   
                    <td className="px-6 py-4  border-b border-gray-200 text-gray-800">
                      {lead.quotation}
                    </td>

                  

                    <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[black]">
                      {lead.status}
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
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </>
  );
}

export default Super_Single_Lead_Profile;
