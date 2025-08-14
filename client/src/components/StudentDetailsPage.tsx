import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Student } from '../App'; // Import the Student type
import { fetchStudents } from '../api/api';

const StudentDetailsPage = () => {
    const { id } = useParams(); // Get the student ID from the URL
    const [student, setStudent] = useState<Student | null>(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const students = await fetchStudents();
                // Find the student with the matching ID
                const foundStudent = students.find((s) => s.id === parseInt(id || "", 10));
                if (foundStudent) {
                    setStudent(foundStudent);
                } else {
                    // Handle the case where the student is not found
                    console.log(`Student with ID ${id} not found`);
                }
            } catch (error) {
                console.error('Error fetching student:', error);
            }
        };

        fetchStudent();
    }, [id]);

    if (!student) {
        return <div>Loading...</div>; // Or a "Student not found" message
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Student Details</h1>
            <div className="bg-white shadow rounded p-4">
                <h2 className="text-xl font-semibold mb-2">Name: {student.name}</h2>
                <p>Registration No: {student.registration_no}</p>
                <p>Mobile Number: {student.mobile_number}</p>
                <h3 className="text-lg font-semibold mt-2">Supervisors:</h3>
                <ul>
                    {student.supervisors.map((supervisor) => (
                        <li key={supervisor.id}>{supervisor.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default StudentDetailsPage;