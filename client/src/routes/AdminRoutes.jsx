import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Registration from "../components/Registration";

import Leads from "../pages/Leads";
import QuotationForm1 from "../pages/Quotation/QuotationForm1";
import CreateCompanyProfile from "../pages/Quotation/CreateCompanyProfile";

import UpdateCompanyData from "../pages/Quotation/UpdateCompanyData";
import DeleteCompanydata from "../pages/Quotation/DeleteCompanydata";

import Invoicelist from "../components/Invoice/Invoicelist";

import DataExport from "../pages/DataExport";
import LeadData from "../components/DataExport/LeadData";
import QuotationData from "../components/DataExport/QuotationData";
import InvoiceData from "../components/DataExport/InvoiceData";
import Dashboard from "../adiComponent/Dashboard";
import Overview from "../adiComponent/Overview";
import UserProfile from "../adiComponent/userProfile";
import EmployeeManagement from "../adiComponent/EmployManagement";
import EmployeeSingle from "../adiComponent/EmployeSingle";
import SingleOrganization from "../adiComponent/SingleOrganizaton";
import Reporting from "../adiComponent/Reporting";
import Single_Lead_Profile from "../components/Leads/Single_Lead_Profile";
import ServicenameList from "../pages/Quotation/ServicenameList";
import CreateServicelist from "../pages/Quotation/CreateServicelist";
import DeleteServiceName from "../pages/Quotation/DeleteServiceName";
import UpdateServiceList from "../pages/Quotation/UpdateServiceList";

import QuotationList from "../pages/Quotation/QuotationList";
import AdminQuotationVIew from "../pages/Quotation/AdminQuotationVIew";
import AdminInvoiceView from "../components/Invoice/AdminInvoiceView";
import TotalLead from "../components/AdminDashBoardCards/TotalLead";
import TotalEmployee from "../components/AdminDashBoardCards/TotalEmployee";
import TotalQuotation from "../components/AdminDashBoardCards/TotalQuotation";
import TotalInvoice from "../components/AdminDashBoardCards/TotalInvoice";
import MainSocialLeads from "../components/SocialMediaLeads/MainSocialLeads";
import TotalVisit from "../components/AdminDashBoardCards/ToatalVisit";
import QuotationlistAdmin from "../components/AdminDashBoardCards/AdminQuotationlist/QuotationlistAdmin";
import AdminTotalClosedDeal from "../components/AdminDashBoardCards/AdminTotalClosedDeal";
import AdminReport from "../adiComponent/AdminReport";
import Admin_view_visit from "../components/Leads/Admin_view_visit";
import Admin_view_quotations from "../components/Leads/Admin_view_quotations";
import Admin_QuotationView from "../components/Leads/Admin_QuotationView";
import Admin_FollowUpView from "../components/Leads/Admin_FollowUpView";
import AdminProfile from "../components/AdminProfile";
import Admin_RemarksView from "../components/Leads/Admin_RemarksView";
import AssignedAdminLeads from "../components/Leads/AssignedAdminLeads";
import LeadSingleProfileByAdmin from "../components/Leads/LeadSingleProfileByAdmin";
import ImportLeadsAdmin from "../components/AdminDashBoardCards/ImportLeadsAdmin";

function AdminRoutes() {
  const user = useSelector((state) => state.auth.user);
  return (
    <>
      <Routes>
        {/* Admin routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/admincrmonerealty" element={<Registration />} />

        {/* <Route path="/" element={user? <Dashboard/> :<Landingpage/>} /> */}
        {/* <Route path="/admin-login" element={<AdminLogin/>} /> */}

        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/admin-total-leads" element={<TotalLead />} />
        <Route path="/admin-total-closed" element={<AdminTotalClosedDeal />} />
        <Route path="/admin-total-employees" element={<TotalEmployee />} />
        {/* <Route path="/admin-total-quotations" element={<TotalQuotation />} />
        <Route path="/admin-total-invoices" element={<TotalInvoice />} /> */}
        <Route path="/admin-total-visit" element={<TotalVisit />} />

        <Route path="/leads" element={<Leads />} />
        <Route path="/admin-leads" element={<AssignedAdminLeads />} />
        <Route path="/admin-lead-single-data/:id" element={<LeadSingleProfileByAdmin />} />
        <Route path="/social-media-leads" element={<MainSocialLeads />} />
        <Route path="/quotation-form" element={<QuotationForm1 />} />
        <Route path="/quotation-section" element={<CreateCompanyProfile />} />
        <Route path="/data-export" element={<DataExport />} />

        <Route
          path="/admin-view-quotation/:id"
          element={<AdminQuotationVIew />}
        />
        {/* <Route
          path="/admin-view-quotation/:id"
          element={<AdminQuotationVIew />}
        /> */}
        <Route
          path="/admin_quotationview/:id"
          element={<Admin_QuotationView />}
        />
        <Route path="/admin-view-invoice/:id" element={<AdminInvoiceView />} />

        <Route path="/updatecompanydata" element={<UpdateCompanyData />} />
        <Route path="/deletecompanydata" element={<DeleteCompanydata />} />

        <Route path="/servicenamelist" element={<ServicenameList />} />
        <Route path="/create-servicelist" element={<CreateServicelist />} />
        <Route path="/delete-servicename" element={<DeleteServiceName />} />
        <Route path="/update-servicename" element={<UpdateServiceList />} />

        <Route path="/invoicelist" element={<Invoicelist />} />
        <Route path="/quotationlist" element={<QuotationList />} />

        <Route path="/lead-data" element={<LeadData />} />
        <Route path="/lead-single-data/:id" element={<Single_Lead_Profile />} />
        <Route path="/quotation-data" element={<QuotationData />} />
        <Route path="/invoice-data" element={<InvoiceData />} />

        {/* aditya routes */}

        <Route path="/overview" element={<Overview />} />

        <Route path="/edit-profile" element={<UserProfile />} />
        <Route path="/employee-management" element={<EmployeeManagement />} />
        <Route
          path="/employee-single/:employeeId"
          element={<EmployeeSingle />}
        />
         <Route
          path="/admin_view_visit/:id"
          element={<Admin_view_visit />}
        />
         <Route
          path="/admin_view_follow_up/:id"
          element={<Admin_FollowUpView />}
        />
         <Route
          path="/admin_view_remark/:id"
          element={<Admin_RemarksView />}   
        />
        <Route
          path="/admin_view_quotations/:id"
          element={<Admin_view_quotations/>}
        />
        <Route
          path="/singleOrganization/:id"
          element={<SingleOrganization />}
        />
        <Route path="/reporting" element={<Reporting />} />
        <Route path="/admin-report" element={<AdminReport />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
         <Route path="/admin-import-data" element={<ImportLeadsAdmin/>} />


      </Routes>
    </>
  );
}

export default AdminRoutes;
