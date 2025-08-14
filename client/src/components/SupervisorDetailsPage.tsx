import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Supervisor } from '../App'; // Import the Supervisor type
import { fetchSupervisors } from '../api/api';

const SupervisorDetailsPage = () => {
  const { id } = useParams(); // Get the supervisor ID from the URL
  const [supervisor, setSupervisor] = useState<Supervisor | null>(null);

  useEffect(() => {
    const fetchSupervisor = async () => {
      try {
        const supervisors = await fetchSupervisors();
        // Find the supervisor with the matching ID
        const foundSupervisor = supervisors.find((s) => s.id === parseInt(id || "", 10));
        if (foundSupervisor) {
          setSupervisor(foundSupervisor);
        } else {
          // Handle the case where the supervisor is not found
          console.log(`Supervisor with ID ${id} not found`);
        }
      } catch (error) {
        console.error('Error fetching supervisor:', error);
      }
    };

    fetchSupervisor();
  }, [id]);

  if (!supervisor) {
    return <div>Loading...</div>; // Or a "Supervisor not found" message
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Supervisor Details</h1>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Name: {supervisor.name}</h2>
        <p>Employee ID: {supervisor.employee_id}</p>
        <p>Mobile Number: {supervisor.mobile_number}</p>
        {/* Add a list of assigned students here if the API provides that info */}
      </div>
    </div>
  );
};

export default SupervisorDetailsPage;