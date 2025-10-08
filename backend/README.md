# AI-Powered Resume Analyzer Backend Setup

## Overview
This is the backend for the AI-Powered Resume Analyzer web application. It is built using FastAPI and provides an API for uploading resumes and evaluating them using AI.

## Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ai-resume-analyzer/backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

## Running the Application

To start the FastAPI server, run the following command:
```
uvicorn app.main:app --reload
```

The application will be available at `http://127.0.0.1:8000`.

## API Endpoints

- **POST /upload**: Upload a resume file (PDF or TXT) for analysis.

## Testing the API

You can test the API using tools like Postman or curl. Make sure to send a POST request to the `/upload` endpoint with the resume file.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.