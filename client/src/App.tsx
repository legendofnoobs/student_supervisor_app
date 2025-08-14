import { useState, useEffect } from 'react';
import { fetchStudents, fetchSupervisors, createStudent, updateStudent, deleteStudent, createSupervisor, updateSupervisor, deleteSupervisor } from './api/api';
import StudentTable from './components/StudentTable';
import SupervisorTable from './components/SupervisorTable';
import { AddStudentModal, UpdateStudentModal, AddSupervisorModal, UpdateSupervisorModal, MessageModal } from './components/Modals';

// Define the types for our data structures
export interface Student {
  id: number;
  name: string;
  registration_no: string;
  mobile_number: string;
  supervisor_ids: number[];
  supervisors?: Supervisor[]; // Optional, will be populated on fetch
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
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    try {
      const studentsData = await fetchStudents();
      const supervisorsData = await fetchSupervisors();

      const studentsWithSupervisors = studentsData.map((student: Student) => ({
        ...student,
        supervisors: student.supervisors || [], // Use the supervisors array from the API
      }));

      setSupervisors(supervisorsData);
      setStudents(studentsWithSupervisors);
    } catch (error) {
      console.error('Error during data refresh:', error);
      showMessage('Failed to refresh data. Please check the server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []); // The empty array ensures this runs only once on initial render

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

  return (
    <div className="font-sans bg-gray-50 text-gray-800 antialiased leading-normal tracking-wide min-h-screen p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Student & Supervisor Management System</h1>
      </header>
      <main className="container mx-auto flex flex-col gap-8">
        {loading ? (
          <div className="w-full text-center p-10 text-gray-500">Loading data...</div>
        ) : (
          <>
            <section className="flex-1 bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-4 text-gray-700">Students</h2>
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
            </section>

            <section className="flex-1 bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-4 text-gray-700">Supervisors</h2>
              <button
                onClick={() => setIsAddSupervisorModalOpen(true)}
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 mb-6"
              >
                + Add Supervisor
              </button>
              <SupervisorTable
                supervisors={supervisors}
                onEdit={(supervisor) => {
                  setCurrentSupervisor(supervisor);
                  setIsUpdateSupervisorModalOpen(true);
                }}
                onDelete={handleDeleteSupervisor}
              />
            </section>
          </>
        )}
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
  );
}
