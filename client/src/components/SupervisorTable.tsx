import { Supervisor } from '../App';

interface SupervisorTableProps {
    supervisors: Supervisor[];
    onEdit: (supervisor: Supervisor) => void;
    onDelete: (id: number) => void;
}

export default function SupervisorTable({ supervisors, onEdit, onDelete }: SupervisorTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-4">
                <thead>
                    <tr className="bg-gray-100 text-left text-gray-600 font-bold uppercase text-sm">
                        <th className="py-3 px-4 border-b border-gray-200">ID</th>
                        <th className="py-3 px-4 border-b border-gray-200">Name</th>
                        <th className="py-3 px-4 border-b border-gray-200">Employee ID</th>
                        <th className="py-3 px-4 border-b border-gray-200">Mobile</th>
                        <th className="py-3 px-4 border-b border-gray-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {supervisors.map(supervisor => (
                        <tr key={supervisor.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                            <td className="py-3 px-4">{supervisor.id}</td>
                            <td className="py-3 px-4">{supervisor.name}</td>
                            <td className="py-3 px-4">{supervisor.employee_id}</td>
                            <td className="py-3 px-4">{supervisor.mobile_number}</td>
                            <td className="py-3 px-4 whitespace-nowrap">
                                <button
                                    onClick={() => onEdit(supervisor)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg mr-2 transition-colors duration-200"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(supervisor.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition-colors duration-200"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
