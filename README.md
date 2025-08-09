# Student/Supervisor Management API

## Overview

This project is a FastAPI-based REST API for managing students and supervisors, including their relationships. It provides endpoints for creating, retrieving, updating, and deleting student and supervisor records, with a many-to-many relationship implemented using SQLAlchemy.  A SQLite database is used for persistence. A basic HTML/CSS/Javascript front end is also provided to consume the API.

## Features

*   **Student Management:**
    *   Create new students.
    *   Retrieve lists of students.
    *   Update existing student information.
    *   Delete student records.
    *   Associate supervisors with students.

*   **Supervisor Management:**
    *   Create new supervisors.
    *   Retrieve lists of supervisors.
    *   Update existing supervisor information.
    *   Delete supervisor records.

*   **Relationships:**
    *   Students can have multiple supervisors.
    *   Supervisors can supervise multiple students.

*   **API Endpoints:**  A full set of CRUD operations are exposed via a REST API.

*   **Database:** Uses SQLite for data persistence.

*   **Frontend:** A basic HTML/CSS/JavaScript frontend is included to demonstrate API usage.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Python 3.7+:**  Download from [https://www.python.org/downloads/](https://www.python.org/downloads/)
*   **pip:** Python package installer (usually included with Python).
*   **(Optional) A virtual environment manager:**  `venv`, `virtualenv`, or `conda`.
*   **(Optional) SQLite browser:**  DB Browser for SQLite ([https://sqlitebrowser.org/](https://sqlitebrowser.org/)) or similar for viewing the database.

## Setup Instructions

Follow these steps to set up the project:

1.  **Clone the Repository:**

2.  **Create a Virtual Environment (Optional but Recommended):**

    ```bash
    python3 -m venv .venv  # Or python -m venv .venv if python3 is not the default
    ```

3.  **Activate the Virtual Environment:**
    *   **Windows:**

        ```bash
        .venv\Scripts\activate
        ```

4.  **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

5.  **Run the Application:**

    ```bash
    python -m uvicorn main:app --reload
    ```

    This will start the FastAPI application on `http://127.0.0.1:8000`. The `--reload` flag enables automatic reloading of the server whenever you make changes to the code.

## API Endpoints

The following API endpoints are available:

**Students:**

*   **`POST /students/`:** Create a new student.

    *   Request body:

        ```json
        {
            "name": "Ahmed Ali",
            "registration_no": "212007571",
            "mobile_number": "01277370828",
            "id": 1,
            "supervisor": [
                {
                    "name": "Yousef Ahmed-Mehanna",
                    "employee_id": "123456789",
                    "mobile_number": "01234567890",
                    "id": 1
                }
          ]
        }
        ```

    *   Response:  The created student object.

*   **`GET /students/`:** List all students.

    *   Response:  A list of student objects.

*   **`GET /students/{student_id}`:** Get a specific student by ID.

    *   Response:  The student object with the given ID.

*   **`PUT /students/{student_id}`:** Update a student.

*   **`DELETE /students/{student_id}`:** Delete a student.

    *   Response: `{"ok": true}` on success.

**Supervisors:**

*   **`POST /supervisors/`:** Create a new supervisor.

*   **`GET /supervisors/`:** List all supervisors.

    *   Response:  A list of supervisor objects.

*   **`GET /supervisors/{supervisor_id}`:** Get a specific supervisor by ID.

    *   Response:  The supervisor object with the given ID.

*   **`PUT /supervisors/{supervisor_id}`:** Update a supervisor.

*   **`DELETE /supervisors/{supervisor_id}`:** Delete a supervisor.

    *   Response: `{"ok": true}` on success.

## Frontend Usage

1.  **Open `index.html` in your browser.** This file provides a basic HTML interface to interact with the API.
2.  **Ensure the FastAPI backend is running** as described in the Setup Instructions.
3.  **Use the forms and tables** to create, read, update, and delete student and supervisor records.  The frontend consumes the API endpoints documented above.

## Database

The application uses a SQLite database named `students.db`. The database file is created automatically when the application starts if it doesn't exist. You can use a SQLite browser (e.g., DB Browser for SQLite) to view and manage the database contents.

## Configuration

*   **Database File:** The database file path is defined in `student.py`. You can change this value if needed.
*   **CORS:** Cross-Origin Resource Sharing (CORS) is enabled in `main.py` to allow requests from the frontend.  In a production environment, you should restrict the allowed origins to your frontend's domain.