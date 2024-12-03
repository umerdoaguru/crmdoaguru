import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";

import cogoToast from "cogo-toast";

const UpdateFormApi = () => {
  const [websiteApi, setWebsiteApi] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [render, setRender] = useState(false);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApiData();
  }, [id, render]);

  const fetchApiData = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/get-website-api`
      );
      setWebsiteApi(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching form:", error);
    }
  };


  const handleDelete = async (api) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Api?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `https://crmdemo.vimubds5.a2hosted.com/api/delete-website-api/${api.id}`
        );
        if (response.status === 200) {
          console.log("Website Api deleted successfully");
          window.location.reload();

        }
       
        console.log(response);
        setRender(!render);
      } catch (error) {
        console.error("Error deleting Website:", error);
      }
    }
  };
 // Function to send the PUT request to update the Website Api data
 const openModal = (data) => {
    setModalData(data);
    console.log(data);
    
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  // Handle updating field values in modalData
  const handleInputChange = (e) => {
    setModalData({
      ...modalData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to send the PUT request to update the Website Api data
  const updateWebsiteApi = async () => {
    try {
      const response = await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/update-website-api`, modalData);
      if (response.status === 200) {
        cogoToast.success("Website Api updated successfully!");
        setRender(!render); // Refresh the list after updating
        window.location.reload();
        closeModal(); // Close the modal
      }
    } catch (error) {
      console.error("Error updating Website Api:", error);
    }
  };





 

  return (
    <>
    
      <div className="container  2xl:w-[91%] 2xl:ml-36">
   
        <div className="w-full px-2 mx-auto p-4">
          <div className="w-full px-2">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Website Api Table
            </h2>
            <div className="">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.no
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Api Url
                    </th>
                   
                 
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {websiteApi && websiteApi.length > 0 ? (
  websiteApi.map((api, index) => (
    <tr key={api.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        {index + 1}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {api.api}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded m-1"
          onClick={() => openModal(api)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded m-1"
          onClick={() => handleDelete(api)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="3" className="px-6 py-4 text-center">
      Data not found
    </td>
  </tr>
)}

                </tbody>
              </table>




         
                


                    {/* Modal for Editing Visit Data */}
                    {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
      <h2 className="text-xl mb-4 font-bold">Edit Api Url</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Api Url:</label>
          <input
            type="text"
            name="api"
            value={modalData.api || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        
        

     

        <div className="flex justify-end">
          <button
            type="button"
            onClick={updateWebsiteApi}
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

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateFormApi;
