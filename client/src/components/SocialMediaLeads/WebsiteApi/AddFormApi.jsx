import { useState } from 'react';
import axios from 'axios';

const AddFormApi = ({ setShowForm,onFormSubmit }) => {
  const [api, setApi] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make POST request to save form ID and form name
      const response = await axios.post('https://crmdemo.vimubds5.a2hosted.com/api/website-api', {
        api,
      
      });

      if (response.status === 200) {
        setSuccess('Website Api saved successfully!');
        setError('');
        setApi('');
        setShowForm(false);  // Hide form on successful submit
          // Trigger LeadsTable refresh
          onFormSubmit();
      }
    } catch (err) {
      console.error('Error saving form:', err);
      setError('Failed to save form');
      setSuccess('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Website Api</h1>

      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            API URL 
          </label>
          <input
            type="text"
            value={api}
            onChange={(e) => setApi(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
            placeholder="Enter API URL"
          />
        </div>

     

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save API
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}  // Hide form on cancel
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFormApi;
