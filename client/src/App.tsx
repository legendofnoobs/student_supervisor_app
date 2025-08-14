import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { fetchStudents, fetchSupervisors, createStudent, updateStudent, deleteStudent, createSupervisor, updateSupervisor, deleteSupervisor } from './api/api';
import StudentTable from './components/StudentTable';
import SupervisorTable from './components/SupervisorTable';
import { AddStudentModal, UpdateStudentModal, AddSupervisorModal, UpdateSupervisorModal, MessageModal } from './components/Modals';
import StudentDetailsPage from './components/StudentDetailsPage';
import SupervisorDetailsPage from './components/SupervisorDetailsPage';

// Define the types for our data structures
export interface Student {
  id: number;
  name: string;
  registration_no: string;
  mobile_number: string;
  supervisors: Supervisor[];
}

export interface Supervisor {
  id: number;
  name: string;
  employee_id: string;
  mobile_number: string;
}

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);

  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isUpdateStudentModalOpen, setIsUpdateStudentModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  const [isAddSupervisorModalOpen, setIsAddSupervisorModalOpen] = useState(false);
  const [isUpdateSupervisorModalOpen, setIsUpdateSupervisorModalOpen] = useState(false);
  const [currentSupervisor, setCurrentSupervisor] = useState<Supervisor | null>(null);

  // Custom function to replace window.alert
  const showMessage = (msg: string) => {
    setMessage(msg);
    setIsMessageModalOpen(true);
  };

  // Custom function to replace window.confirm
  const showConfirm = (msg: string, callback: () => void) => {
    setMessage(msg);
    setConfirmCallback(() => callback);
    setIsConfirmModalOpen(true);
  };

  // Fetch all data from the API
  const refreshAllData = async () => {
    try {
      const studentsData = await fetchStudents();
      const supervisorsData = await fetchSupervisors();
      setSupervisors(supervisorsData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error during data refresh:', error);
      showMessage('Failed to refresh data. Please check the server connection.');
    }
  };

  useEffect(() => {
    refreshAllData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Student Handlers ---
  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'supervisors'>) => {
    try {
      await createStudent(studentData);
      showMessage('Student created successfully!');
      setIsAddStudentModalOpen(false);
      refreshAllData();
    } catch (error) {
      console.error('Error creating student:', error);
      showMessage('Failed to create student.');
    }
  };

  const handleUpdateStudent = async (studentData: Student) => {
    try {
      await updateStudent(studentData.id, studentData);
      showMessage('Student updated successfully!');
      setIsUpdateStudentModalOpen(false);
      refreshAllData();
    } catch (error) {
      console.error('Error updating student:', error);
      showMessage('Failed to update student.');
    }
  };

  const handleDeleteStudent = (studentId: number) => {
    showConfirm('Are you sure you want to delete this student?', async () => {
      try {
        await deleteStudent(studentId);
        showMessage('Student deleted successfully!');
        refreshAllData();
      } catch (error) {
        console.error('Error deleting student:', error);
        showMessage('Failed to delete student.');
      }
    });
  };

  // --- Supervisor Handlers ---
  const handleAddSupervisor = async (supervisorData: Omit<Supervisor, 'id'>) => {
    try {
      await createSupervisor(supervisorData);
      showMessage('Supervisor created successfully!');
      setIsAddSupervisorModalOpen(false);
      refreshAllData();
    } catch (error) {
      console.error('Error creating supervisor:', error);
      showMessage('Failed to create supervisor.');
    }
  };

  const handleUpdateSupervisor = async (supervisorData: Supervisor) => {
    try {
      await updateSupervisor(supervisorData.id, supervisorData);
      showMessage('Supervisor updated successfully!');
      setIsUpdateSupervisorModalOpen(false);
      refreshAllData();
    } catch (error) {
      console.error('Error updating supervisor:', error);
      showMessage('Failed to update supervisor.');
    }
  };

  const handleDeleteSupervisor = (supervisorId: number) => {
    showConfirm('Are you sure you want to delete this supervisor?', async () => {
      try {
        await deleteSupervisor(supervisorId);
        showMessage('Supervisor deleted successfully!');
        refreshAllData();
      } catch (error) {
        console.error('Error deleting supervisor:', error);
        showMessage('Failed to delete supervisor.');
      }
    });
  };

  // New component for the Dashboard
  const Dashboard = () => {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Total Students</h2>
            <p className="text-2xl">{students.length}</p>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Total Supervisors</h2>
            <p className="text-2xl">{supervisors.length}</p>
          </div>
        </div>
      </div>
    );
  };

  // New component for the Student List Page
  const StudentListPage = () => {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Student List</h1>
        <button
          onClick={() => {
            setIsAddStudentModalOpen(true);
          }}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 mb-6"
        >
          + Add Student
        </button>
        <StudentTable
          students={students}
          onEdit={(student) => {
            setCurrentStudent(student);
            setIsUpdateStudentModalOpen(true);
          }}
          onDelete={handleDeleteStudent}
        />
      </div>
    );
  };

  // New component for the Supervisor List Page
  const SupervisorListPage = () => {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Supervisor List</h1>
        <button
          onClick={() => setIsAddSupervisorModalOpen(true)}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 mb-6"
        >
          + Add Supervisor
        </button>
        <SupervisorTable
          supervisors={supervisors}
          onEdit={(supervisor) => {
            setCurrentSupervisor(supervisor); // Set the supervisor to be edited
            setIsUpdateSupervisorModalOpen(true);
          }}
          onDelete={handleDeleteSupervisor}
        />
      </div>
    );
  };

  return (
    <Router>
      <div className="font-sans bg-gray-50 text-gray-800 antialiased leading-normal tracking-wide min-h-screen p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Student & Supervisor Management System</h1>
          <nav className="mt-4">
            <ul className="flex justify-center space-x-4">
              <li><Link to="/" className="text-blue-500 hover:text-blue-700">Dashboard</Link></li>
              <li><Link to="/students" className="text-blue-500 hover:text-blue-700">Students</Link></li>
              <li><Link to="/supervisors" className="text-blue-500 hover:text-blue-700">Supervisors</Link></li>
            </ul>
          </nav>
        </header>
        <main className="container mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/supervisors" element={<SupervisorListPage />} />
            <Route path="/students/:id" element={<StudentDetailsPage />} />
            <Route path="/supervisors/:id" element={<SupervisorDetailsPage />} />
          </Routes>
        </main>

        {/* Modals */}
        <MessageModal
          isOpen={isMessageModalOpen || isConfirmModalOpen}
          onClose={() => {
            setIsMessageModalOpen(false);
            setIsConfirmModalOpen(false);
            setConfirmCallback(null);
          }}
          message={message}
          isConfirm={isConfirmModalOpen}
          onConfirm={() => {
            if (confirmCallback) {
              confirmCallback();
            }
            setIsConfirmModalOpen(false);
            setConfirmCallback(null);
          }}
        />
        <AddStudentModal
          isOpen={isAddStudentModalOpen}
          onClose={() => setIsAddStudentModalOpen(false)}
          onSubmit={handleAddStudent}
          supervisors={supervisors}
        />
        {currentStudent && (
          <UpdateStudentModal
            isOpen={isUpdateStudentModalOpen}
            onClose={() => setIsUpdateStudentModalOpen(false)}
            onSubmit={handleUpdateStudent}
            student={currentStudent}
            supervisors={supervisors}
          />
        )}
        <AddSupervisorModal
          isOpen={isAddSupervisorModalOpen}
          onClose={() => setIsAddSupervisorModalOpen(false)}
          onSubmit={handleAddSupervisor}
        />
        {currentSupervisor && (
          <UpdateSupervisorModal
            isOpen={isUpdateSupervisorModalOpen}
            onClose={() => setIsUpdateSupervisorModalOpen(false)}
            onSubmit={handleUpdateSupervisor}
            supervisor={currentSupervisor}
          />
        )}
      </div>
    </Router>
  );
}