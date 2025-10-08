🚀 InsightLens — AI-Powered Resume Analyzer
📝 Description
InsightLens is a full-stack AI-powered application designed to help users intelligently analyze their resumes. By leveraging modern AI models, it provides meaningful feedback, specific keyword insights, and actionable suggestions for improvement, helping users land their next job.

✨ Key Features
📝 Resume Upload: Supports uploads for standard documents (.pdf / .txt).

⚡ AI Evaluation: Provides an AI-based scoring and comprehensive evaluation report.

📊 Dynamic Insights: Delivers dynamic keyword insights relevant to target roles.

🌀 User Feedback: Includes spinner progress indicators for long-running analysis jobs.

🧾 Reporting: Generates a downloadable detailed report of the analysis.

🕒 History Tracking: Automatically tracks the history of multiple resume uploads and results.

🧩 Tech Stack
InsightLens is built as a robust, scalable full-stack application.

Frontend
⚛️ React (Vite): Modern, fast development environment.

💨 Tailwind CSS: Utility-first framework for rapid and responsive styling.

🔄 Axios: Promise-based HTTP client for API calls.

🧠 Interactive UI: Features spinner progress and interactive results history.

Backend
🐍 FastAPI (Python): High-performance, async framework for the API server.

🤖 AI Logic: Houses the core AI-based evaluation algorithms.

📄 File Handling: Securely processes uploaded files (PDF, TXT).

🧪 Modular Endpoints: Cleanly organized structure for upload and analysis logic.

📁 Project Structure
ai-resume-analyzer/
│
├── frontend/             # React + Tailwind UI
│ ├── src/
│ │ ├── components/
│ │ └── pages/
│ │ └── App.tsx
│ └── ...
│
├── backend/              # FastAPI backend
│ ├── app/
│ │ ├── main.py
│ │ └── routes/
│ └── requirements.txt
│
├── package-lock.json
├── README.md             # (This file)
└── .gitignore

🛠️ Local Setup
Follow these steps to get a local copy of the project running.

1️⃣ Clone the Repository
git clone [https://github.com/MasterAditya/insight-lens.git](https://github.com/MasterAditya/insight-lens.git)
cd insight-lens

2️⃣ Setup the Backend (FastAPI)
cd backend
python -m venv venv
# Activate the environment
source venv/bin/activate    # (Linux/macOS)
venv\Scripts\activate      # (Windows)

# Install dependencies and run the server
pip install -r requirements.txt
uvicorn app.main:app --reload

👉 Server runs on: http://127.0.0.1:8000

3️⃣ Setup the Frontend (React + Tailwind)
Open a new terminal tab:

cd frontend
npm install
npm start

👉 App runs on: http://localhost:3000

⚙️ Environment Variables (Optional)
Configure your backend URL for the frontend by setting it in a configuration file or environment variable (e.g., in your React project's environment setup):

# .env file or build configuration
VITE_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)

🧪 API Endpoints
The primary endpoint for interaction:

Method

Endpoint

Description

POST

/upload

Upload a resume file for AI analysis and scoring.

Example Upload (using curl):

curl -X POST -F "file=@resume.pdf" [http://127.0.0.1:8000/upload](http://127.0.0.1:8000/upload)

🌍 Deployment
🧱 GitHub
Push the entire repository to your remote:

git add .
git commit -m "🚀 Initial commit: InsightLens AI Resume Analyzer v1"
git branch -M main
git remote add origin [https://github.com/MasterAditya/insight-lens.git](https://github.com/MasterAditya/insight-lens.git)
git push -u origin main

☁️ Hosting Suggestions
Frontend (Vercel/Netlify):

Set build command → npm run build

Set output directory → dist or build

Add environment variable: VITE_API_URL = https://your-backend-url (using the live backend URL)

Backend (Render/Railway/Vercel Functions): Use a service optimized for Python/FastAPI hosting.

🧰 Contributing
Contributions are essential to making InsightLens better! We welcome any suggestions, feature requests, or bug reports.

Fork the repository.

Create a new branch: git checkout -b feature/your-feature.

Commit your changes.

Push to the branch and open a Pull Request.

🪪 License
This project is licensed under the MIT License—see the LICENSE file for details.

👨‍💻 Author
Aditya Sharma - @MasterAditya
AI & ML Developer | Full-stack Engineer | Open Source Builder

Project Link: https://github.com/MasterAditya/insight-lens  

Email: aditya.828777@gmail.com
