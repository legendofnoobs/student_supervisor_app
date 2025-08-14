import { Student, Supervisor } from '../App';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Helper function for making a fetch call with retry logic.
 * This function is now more robust, checking for JSON content-type
 * and handling DELETE requests without expecting a body.
 */
async function apiCallWithRetry<T>(url: string, options: RequestInit = {}, retries = 3): Promise<T | void> {
    let attempt = 0;
    while (attempt < retries) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            // Check if there is a body to parse
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                // If no JSON content, return successfully without parsing
                return;
            }
        } catch (error) {
            if (attempt === retries - 1) {
                throw error; // Throw after the last retry
            }
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(res => setTimeout(res, delay));
            attempt++;
        }
    }
    throw new Error('Maximum retries exceeded');
}

// --- Student API Functions ---
export const fetchStudents = async (): Promise<Student[]> => {
    const data = await apiCallWithRetry<Student[]>(`${API_BASE_URL}/students/`);
    return data as Student[] || [];
};

export const createStudent = async (student: Omit<Student, 'id' | 'supervisors'>) => {
    return apiCallWithRetry(`${API_BASE_URL}/students/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
    });
};

export const updateStudent = async (id: number, student: Student) => {
    return apiCallWithRetry(`${API_BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
    });
};

export const deleteStudent = async (id: number) => {
    return apiCallWithRetry(`${API_BASE_URL}/students/${id}`, { method: 'DELETE' });
};

// --- Supervisor API Functions ---
export const fetchSupervisors = async (): Promise<Supervisor[]> => {
    const data = await apiCallWithRetry<Supervisor[]>(`${API_BASE_URL}/supervisors/`);
    return data as Supervisor[] || [];
};

export const createSupervisor = async (supervisor: Omit<Supervisor, 'id'>) => {
    return apiCallWithRetry(`${API_BASE_URL}/supervisors/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supervisor),
    });
};

export const updateSupervisor = async (id: number, supervisor: Supervisor) => {
    return apiCallWithRetry(`${API_BASE_URL}/supervisors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supervisor),
    });
};

export const deleteSupervisor = async (id: number) => {
    return apiCallWithRetry(`${API_BASE_URL}/supervisors/${id}`, { method: 'DELETE' });
};
