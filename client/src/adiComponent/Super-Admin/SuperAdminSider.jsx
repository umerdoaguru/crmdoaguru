import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsHouse, BsFileEarmarkPerson } from "react-icons/bs";
import { FaFileImport, FaHistory, FaUserCircle } from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
import { MdOutlineManageAccounts } from "react-icons/md";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const SuperAdminSider = () => { 
  const location = useLocation(); // To get the current route
  const [isOpen, setIsOpen] = useState(false);

  // Function to get active class for the sidebar links
  const getSidebarClass = (path) => {
    return location.pathname === path ? "bg-blue-800 shadow-lg" : "";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Button - Hidden on large screens */}
      <button
        className="fixed top-16 md:top-20 left-4 z-50 text-black "
        onClick={toggleSidebar}
      >
        <AiOutlineMenu size={25} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed mt-16 md:mt-[70px] lg:mt-[60px] inset-y-0 bg-[#01060c] overflow-hidden 2xl:translate-x-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-20 md:w-[150px] z-50`}
      >
        {/* Close (Cross) Button - Hidden on large screens */}
        <button
          className="absolute left-14 md:left-32 lg-left-32 text-gray-400 2xl:hidden" // Hidden on large screens (lg)
          onClick={toggleSidebar}
        >
          <AiOutlineClose size={25} />
        </button>

        <div className="flex flex-col items-center max-h-screen overflow-auto	p-4 xl:w-[10rem]">
          <ul className="flex flex-col items-center space-y-4 w-full pb-16">
            <li
              className={`xl:w-full ${getSidebarClass("/super-admin-dashboard")}`}
            >
              <Link
                to="/super-admin-dashboard"
                className="flex flex-col items-center py-3"
              >
                <BsHouse className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Dashboard
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />

            <li className={`xl:w-full ${getSidebarClass("/super-admin-employee-leads")}`}>
              <Link to="/super-admin-employee-leads" className="flex flex-col items-center py-3">
                <FaHistory className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Leads
                </h3>
              </Link>
            </li>


              <hr className="w-full border-gray-400" />
              <li className={`xl:w-full ${getSidebarClass("/social-media-leads")}`}>
                <Link
                  to="/social-media-super-admin-leads"
                  className="flex flex-col items-center py-3"
                >
                  <FaHistory className="text-white text-2xl md:text-3xl" />
                  <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                   Social Media <br /> <span>Leads</span>
                  </h3>
                </Link>
              </li>


            <hr className="w-full border-gray-400" />
            
                <li className={`xl:w-full ${getSidebarClass("/super-admin-import-data")}`}>
              <Link to="/super-admin-import-data" className="flex flex-col items-center py-3">
                <FaFileImport  className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                Import  Data 
                </h3>
              </Link>
            </li>
            <hr className="w-full border-gray-400" />

            <li className={`xl:w-full ${getSidebarClass("/super-admin-reporting")}`}>
              <Link to="/super-admin-reporting" className="flex flex-col items-center py-3">
                <RiSecurePaymentLine className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Reports
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />
            <li className={`xl:w-full ${getSidebarClass("/super-admin-data-export")}`}>
              <Link
                to="/super-admin-data-export"
                className="flex flex-col items-center py-3"
              >
                <BsFileEarmarkPerson className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Data Export
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" /> 

            <li className={`xl:w-full ${getSidebarClass("/super-admin-quotationlist")}`}>
              <Link
                to="/super-admin-quotationlist"
                className="flex flex-col items-center py-3"
              >
                <BsFileEarmarkPerson className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                  All Quotations
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />

            <li className={`xl:w-full ${getSidebarClass("/super-admin-employee-management")}`}>
              <Link
                to="/super-admin-employee-management"
                className="flex flex-col items-center py-3"
              >
                <MdOutlineManageAccounts className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                  Employees Management
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />
            <li className={`xl:w-full ${getSidebarClass("/super-admin-AdminManagement")}`}>
              <Link
                to="/super-admin-AdminManagement"
                className="flex flex-col items-center py-3"
              >
                <MdOutlineManageAccounts className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                  Admin Management
                </h3>
              </Link>
            </li>
            <hr className="w-full border-gray-400" />
            <li className={`xl:w-full ${getSidebarClass("/super-admin-profile")}`}>
              <Link
                to="/super-admin-profile"
                className="flex flex-col items-center py-3"
              >
                <FaUserCircle className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                  Super Admin Profile
                </h3>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SuperAdminSider;
