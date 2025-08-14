import { useState, useEffect } from 'react';
import { Student, Supervisor } from '../App';

// Modal component to replace alert() and confirm()
interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    isConfirm: boolean;
    onConfirm?: () => void;
}

export function MessageModal({ isOpen, onClose, message, isConfirm, onConfirm }: MessageModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                    <h3 className="text-xl font-bold">{isConfirm ? 'Confirm Action' : 'Notification'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>
                <p className="text-gray-700">{message}</p>
                <div className="mt-4 flex justify-end gap-2">
                    {isConfirm ? (
                        <>
                            <button
                                onClick={() => {
                                    if (onConfirm) onConfirm();
                                    onClose();
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Yes
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                No
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Student Modals
interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Student, 'id' | 'supervisors'>) => void;
    supervisors: Supervisor[];
}

export function AddStudentModal({ isOpen, onClose, onSubmit, supervisors }: StudentModalProps) {
    const [name, setName] = useState('');
    const [registration_no, setRegistrationNo] = useState('');
    const [mobile_number, setMobileNumber] = useState('');
    const [supervisor_ids, setSupervisorIds] = useState<number[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, registration_no, mobile_number, supervisor_ids });
        setName('');
        setRegistrationNo('');
        setMobileNumber('');
        setSupervisorIds([]);
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                    <h2 className="text-2xl font-bold">Add New Student</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="flex flex-col">
                        Name:
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 p-2 border border-gray-300 rounded-lg" />
                    </label>
                    <label className="flex flex-col">
                        Registration No:
                        <input type="text" value={registration_no} onChange={e => setRegistrationNo(e.target.value)} required className="mt-1 p-2 border border-gray-300 rounded-lg" />
                    </label>
                    <label className="flex flex-col">
                        Mobile:
                        <input type="text" value={mobile_number} onChange={e => setMobileNumber(e.target.value)} required className="mt-1 p-2 border border-gray-300 rounded-lg" />
                    </label>
                    <label className="flex flex-col">
                        Supervisor(s):
                        <select
                            multiple
                            value={supervisor_ids.map(String)}
                            onChange={e => setSupervisorIds(Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded-lg"
                        >
                            {supervisors.map(supervisor => (
                                <option key={supervisor.id} value={supervisor.id}>
                                    {`${supervisor.name} (ID: ${supervisor.id})`}
                                </option>
                            ))}
                        </select>
                        <small className="text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple supervisors</small>
                    </label>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-4">Create</button>
                </form>
            </div>
        </div>
    );
}

interface UpdateStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Student) => void;
    student: Student;
    supervisors: Supervisor[];
}

export function UpdateStudentModal({ isOpen, onClose, onSubmit, student, supervisors }: UpdateStudentModalProps) {
    const [name, setName] = useState(student.name);
    const [registration_no, setRegistrationNo] = useState(student.registration_no);
    const [mobile_number, setMobileNumber] = useState(student.mobile_number);
    const [supervisor_ids, setSupervisorIds] = useState(student.supervisor_ids);

    useEffect(() => {
        if (student) {
            setName(student.name);
            setRegistrationNo(student.registration_no);
            setMobileNumber(student.mobile_number);
            setSupervisorIds(student.supervisor_ids);
        }
    }, [student]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...student, name, registration_no, mobile_number, supervisor_ids });
    };

    if (!isOpen || !student) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                    <h2 className="text-2xl font-bold">Update Student</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="flex flex-col">
                        Name:
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-lg" />
                    </label>
                    <label className="flex flex-col">
                        Registration No:
                        <input type="text" value={registration_no} onChange={e => setRegistrationNo(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-lg" />
                    </label>
                    <label className="flex flex-col">
                        Mobile:
                        <input type="text" value={mobile_number} onChange={e => setMobileNumber(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-lg" />
                    </label>
                    <label className="flex flex-col">
                        Supervisor(s):
                        <select
                            multiple
                            value={((supervisor_ids ?? []).map(String))}
                            onChange={e => setSupervisorIds(Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                            className="mt-1 p-2 border border-gray-300 rounded-lg"
                        >
                            {supervisors.map(supervisor => (
                                <option key={supervisor.id} value={supervisor.id}>
                                    {`${supervisor.name} (ID: ${supervisor.id})`}
                                </option>
                            ))}
                        </select>
                        <small className="text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple supervisors</small>
                    </label>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-4">Update</button>
                </form>
            </div>
        </div>
    );
}

// Supervisor Modals
interface SupervisorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Supervisor, 'id'>) => void;
}

export function AddSupervisorModal({ isOpen, onClose, onSubmit }: SupervisorModalProps) {
    const [name, setName] = useState('');
    const [employee_id, setEmployeeId] = useState('');
    const [mobile_number, setMobileNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, employee_id, mobile_number });
        setName('');
        setEmployeeId('');
        setMobileNumber('');
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                    <h2 className="text-2xl font-bold">Add New Supervisor</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="flex flex-col">
                        Name:
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 p-2 border border-gray-300 rounded-lg" />
                    </label>
                    <label className="flex flex-col">
                        Employee ID:
                        <input type="text" value={employee_id} onChange={e => setEmployeeId(e.target.value)} required className="mt-1 p-2 border border-gray-300 rounded-lg" />
                    </label>
                    <label className="flex flex-col">
                        Mobile:
                        <input type="text" value={mobile_number} onChange={e => setMobileNumber(e.target.value)} required className="mt-1 p-2 border border-gray-300 rounded-lg" />
                    </label>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-4">Create</button>
                </form>
            </div>
        </div>
    );
}

interface UpdateSupervisorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Supervisor) => void;
    supervisor: Supervisor;
}

export function UpdateSupervisorModal({ isOpen, onClose, onSubmit, supervisor }: UpdateSupervisorModalProps) {
    const [name, setName] = useState(supervisor.name);
    const [employee_id, setEmployeeId] = useState(supervisor.employee_id);
    const [mobile_number, setMobileNumber] = useState(supervisor.mobile_number);

    useEffect(() => {
        if (supervisor) {
            setName(supervisor.name);
            setEmployeeId(supervisor.employee_id);
            setMobileNumber(supervisor.mobile_number);
        }
    }, [supervisor]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...supervisor, name, employee_id, mobile_number });
    };

    if (!isOpen || !supervisor) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                    <h2 className="text-2xl font-bold">Update Supervisor</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="flex flex-col">
                        Name:
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-lg" />
                    </label>
                    <label className="flex flex-col">
                        Employee ID:
                        <input type="text" value={employee_id} onChange={e => setEmployeeId(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-lg" />
                    </label>
                    <label className="flex flex-col">
                        Mobile:
                        <input type="text" value={mobile_number} onChange={e => setMobileNumber(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-lg" />
                    </label>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-4">Update</button>
                </form>
            </div>
        </div>
    );
}
