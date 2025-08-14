document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://localhost:8000';

    // Global variables to store all students and supervisors for efficient lookup
    let allStudents = [];
    let allSupervisors = [];

    // --- Helper Functions ---

    /**
     * Replaces alert() with a custom modal.
     * @param {string} message The message to display.
     */
    function showMessage(message) {
        const modal = document.getElementById('messageModal');
        const messageText = document.getElementById('messageText');
        const confirmButtons = document.getElementById('confirmButtons');
        const alertClose = document.getElementById('alertClose');

        messageText.textContent = message;
        confirmButtons.style.display = 'none';
        alertClose.style.display = 'block';
        modal.style.display = 'block';

        return new Promise(resolve => {
            alertClose.onclick = () => {
                modal.style.display = 'none';
                resolve(true);
            };
        });
    }

    /**
     * Replaces confirm() with a custom modal.
     * @param {string} message The message to display.
     * @returns {Promise<boolean>} A promise that resolves with true if 'Yes' is clicked, false otherwise.
     */
    function showConfirm(message) {
        const modal = document.getElementById('messageModal');
        const messageText = document.getElementById('messageText');
        const confirmButtons = document.getElementById('confirmButtons');
        const alertClose = document.getElementById('alertClose');
        const confirmYes = document.getElementById('confirmYes');
        const confirmNo = document.getElementById('confirmNo');

        messageText.textContent = message;
        confirmButtons.style.display = 'flex';
        alertClose.style.display = 'none';
        modal.style.display = 'block';

        return new Promise(resolve => {
            confirmYes.onclick = () => {
                modal.style.display = 'none';
                resolve(true);
            };
            confirmNo.onclick = () => {
                modal.style.display = 'none';
                resolve(false);
            };
        });
    }

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async function postData(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server responded with an error:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Post error:', error);
            throw error;
        }
    }

    async function putData(url, data) {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Put error:', error);
            throw error;
        }
    }

    async function deleteData(url) {
        try {
            const response = await fetch(url, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            return response.ok;
        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    }

    // --- DOM Manipulation Functions ---

    /**
     * Populates the student table, including supervisor names.
     * @param {Array} students The list of student objects.
     * @param {Array} supervisors The list of supervisor objects for name lookup.
     */
    function displayStudents(students, supervisors) {
        const tableBody = document.getElementById('studentTable').querySelector('tbody');
        tableBody.innerHTML = '';

        students.forEach(student => {
            const supervisorNames = (student.supervisors || [])
                .map(supervisor => {
                    return supervisor ? supervisor.name : 'Unknown';
                })
                .join(', ');

            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.registration_no}</td>
            <td>${student.mobile_number}</td>
            <td>${supervisorNames || 'No supervisors'}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editStudent(${student.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;
            tableBody.appendChild(row);
        });
    }



    /**
     * Populates the supervisor table.
     * @param {Array} supervisors The list of supervisor objects.
     */
    function displaySupervisors(supervisors) {
        const tableBody = document.getElementById('supervisorTable').querySelector('tbody');
        tableBody.innerHTML = '';
        supervisors.forEach(supervisor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${supervisor.id}</td>
                        <td>${supervisor.name}</td>
                        <td>${supervisor.employee_id}</td>
                        <td>${supervisor.mobile_number}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editSupervisor(${supervisor.id})">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteSupervisor(${supervisor.id})">Delete</button>
                        </td>
                    `;
            tableBody.appendChild(row);
        });
    }

    /**
     * Fetches all students and supervisors and refreshes both tables.
     * This function is now the single source of truth for reloading data.
     */
    async function refreshAllData() {
        try {
            // Use Promise.all to fetch both datasets concurrently
            const [students, supervisors] = await Promise.all([
                fetchData(`${API_BASE_URL}/students/`),
                fetchData(`${API_BASE_URL}/supervisors/`)
            ]);

            // Update global variables
            allStudents = students;
            allSupervisors = supervisors;

            // Display both tables with the fresh data
            displaySupervisors(allSupervisors);
            displayStudents(allStudents, allSupervisors);
        } catch (error) {
            console.error('Error during data refresh:', error);
            await showMessage('Failed to refresh data. Please check the server connection.');
        }
    }
    window.refreshAllData = refreshAllData;

    // --- Student Functions ---
    document.getElementById('addStudentForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const select = document.getElementById('supervisorSelect');
        const selectedOptions = Array.from(select.selectedOptions).map(option => parseInt(option.value));

        const studentData = {
            name: formData.get('name'),
            registration_no: formData.get('registration_no'),
            mobile_number: formData.get('mobile_number'),
            supervisor_ids: selectedOptions
        };

        try {
            await postData(`${API_BASE_URL}/students/`, studentData);
            await showMessage('Student created successfully!');
            document.getElementById('AddStudentModal').style.display = 'none';
            event.target.reset();
            await refreshAllData(); // Refresh all data after a successful operation
        } catch (error) {
            console.error('Error creating student:', error);
            await showMessage('Failed to create student.');
        }
    });

    window.editStudent = async function (studentId) {
        try {
            const student = allStudents.find(s => s.id === studentId);
            if (!student) throw new Error('Student not found in local data.');
            const form = document.getElementById('updateStudentForm');
            form.querySelector('[name="id"]').value = student.id;
            form.querySelector('[name="name"]').value = student.name;
            form.querySelector('[name="registration_no"]').value = student.registration_no;
            form.querySelector('[name="mobile_number"]').value = student.mobile_number;
            form.querySelector('[name="supervisor_ids"]').value = (student.supervisor_ids || []).join(', ');
            document.getElementById('UpdateStudentModal').style.display = 'block';
        } catch (error) {
            console.error('Error fetching student:', error);
            await showMessage('Failed to load student data.');
        }
    };

    document.getElementById('updateStudentForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const supervisorIdsString = formData.get('supervisor_ids');
        const studentData = {
            name: formData.get('name'),
            registration_no: formData.get('registration_no'),
            mobile_number: formData.get('mobile_number'),
            supervisor_ids: supervisorIdsString
                ? supervisorIdsString.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
                : []
        };
        const studentId = formData.get('id');

        try {
            await putData(`${API_BASE_URL}/students/${studentId}`, studentData);
            await showMessage('Student updated successfully!');
            document.getElementById('UpdateStudentModal').style.display = 'none';
            await refreshAllData(); // Refresh all data after a successful operation
        } catch (error) {
            console.error('Error updating student:', error);
            await showMessage('Failed to update student.');
        }
    });

    window.deleteStudent = async function (studentId) {
        const confirmed = await showConfirm('Are you sure you want to delete this student?');
        if (confirmed) {
            try {
                await deleteData(`${API_BASE_URL}/students/${studentId}`);
                await showMessage('Student deleted successfully!');
                await refreshAllData(); // Refresh all data after a successful operation
            } catch (error) {
                console.error('Error deleting student:', error);
                await showMessage('Failed to delete student.');
            }
        }
    };

    // --- Supervisor Functions ---
    document.getElementById('addSupervisorForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const supervisorData = {
            name: formData.get('name'),
            employee_id: formData.get('employee_id'),
            mobile_number: formData.get('mobile_number')
        };

        try {
            await postData(`${API_BASE_URL}/supervisors/`, supervisorData);
            await showMessage('Supervisor created successfully!');
            document.getElementById('AddSupervisorModal').style.display = 'none';
            event.target.reset();
            await refreshAllData(); // Refresh all data after a successful operation
        } catch (error) {
            console.error('Error creating supervisor:', error.message);
            await showMessage('Failed to create supervisor.');
        }
    });

    window.editSupervisor = async function (supervisorId) {
        try {
            const supervisor = allSupervisors.find(s => s.id === supervisorId);
            if (!supervisor) throw new Error('Supervisor not found in local data.');
            const form = document.getElementById('updateSupervisorForm');
            form.querySelector('[name="id"]').value = supervisor.id;
            form.querySelector('[name="name"]').value = supervisor.name;
            form.querySelector('[name="employee_id"]').value = supervisor.employee_id;
            form.querySelector('[name="mobile_number"]').value = supervisor.mobile_number;
            document.getElementById('UpdateSupervisorModal').style.display = 'block';
        } catch (error) {
            console.error('Error fetching supervisor:', error);
            await showMessage('Failed to load supervisor data.');
        }
    };

    document.getElementById('updateSupervisorForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const supervisorData = {
            name: formData.get('name'),
            employee_id: formData.get('employee_id'),
            mobile_number: formData.get('mobile_number')
        };
        const supervisorId = formData.get('id');

        try {
            await putData(`${API_BASE_URL}/supervisors/${supervisorId}`, supervisorData);
            await showMessage('Supervisor updated successfully!');
            document.getElementById('UpdateSupervisorModal').style.display = 'none';
            await refreshAllData(); // Refresh all data after a successful operation
        } catch (error) {
            console.error('Error updating supervisor:', error);
            await showMessage('Failed to update supervisor.');
        }
    });

    window.deleteSupervisor = async function (supervisorId) {
        const confirmed = await showConfirm('Are you sure you want to delete this supervisor?');
        if (confirmed) {
            try {
                await deleteData(`${API_BASE_URL}/supervisors/${supervisorId}`);
                await showMessage('Supervisor deleted successfully!');
                await refreshAllData(); // Refresh all data after a successful operation
            } catch (error) {
                console.error('Error deleting supervisor:', error);
                await showMessage('Failed to delete supervisor.');
            }
        }
    };

    // --- Modal Handling and Initial Load ---
    document.getElementById('openAddStudentModal').addEventListener('click', async () => {
        document.getElementById('AddStudentModal').style.display = 'block';
        populateSupervisorDropdown();
    });

    document.getElementById('openAddSupervisorModal').addEventListener('click', () => {
        document.getElementById('AddSupervisorModal').style.display = 'block';
    });

    document.querySelectorAll('.close-modal').forEach(span => {
        span.addEventListener('click', function () {
            document.getElementById(this.dataset.close).style.display = 'none';
        });
    });

    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    function populateSupervisorDropdown() {
        const select = document.getElementById('supervisorSelect');
        select.innerHTML = '';
        // Use the global array, which is now guaranteed to be fresh
        allSupervisors.forEach(supervisor => {
            const option = document.createElement('option');
            option.value = supervisor.id;
            option.textContent = `${supervisor.name} (ID: ${supervisor.id})`;
            select.appendChild(option);
        });
    }

    // Initial data load on page load
    refreshAllData();
});