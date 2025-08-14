import { Student } from '../App';
import { Link } from 'react-router-dom'; // Import Link

interface StudentTableProps {
    students: Student[];
    onEdit: (student: Student) => void;
    onDelete: (id: number) => void;
}

export default function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-4">
                <thead>
                    <tr className="bg-gray-100 text-left text-gray-600 font-bold uppercase text-sm">
                        {/* <th className="py-3 px-4 border-b border-gray-200">ID</th> */}
                        <th className="py-3 px-4 border-b border-gray-200">Name</th>
                        <th className="py-3 px-4 border-b border-gray-200">Registration No</th>
                        <th className="py-3 px-4 border-b border-gray-200">Mobile</th>
                        <th className="py-3 px-4 border-b border-gray-200">Supervisors</th>
                        <th className="py-3 px-4 border-b border-gray-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                            {/* <td className="py-3 px-4">{student.id}</td> */}
                            <td className="py-3 px-4">{student.name}</td>
                            <td className="py-3 px-4">{student.registration_no}</td>
                            <td className="py-3 px-4">{student.mobile_number}</td>
                            <td className="py-3 px-4">
                                {(student.supervisors || []).map(sup => sup.name).join(', ') || 'No supervisors'}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap flex gap-2">
                                <button
                                    onClick={() => onEdit(student)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg transition-colors duration-200"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(student.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition-colors duration-200"
                                >
                                    Delete
                                </button>
                                {/* Add Details Button */}
                                <Link
                                    to={`/students/${student.id}`} // Link to student details page
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg transition-colors duration-200"
                                >
                                    Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}