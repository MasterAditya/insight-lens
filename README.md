# 🚀 InsightLens — AI-Powered Resume Analyzer

InsightLens is a full-stack AI-powered application that helps users **analyze their resumes intelligently**.  
It provides meaningful feedback, keyword insights, and improvement suggestions using modern AI models.

---

## 🧩 Tech Stack

**Frontend**
- ⚛️ React (Vite)
- 💨 Tailwind CSS
- 🔄 Axios for API calls
- 🌀 Spinner-based progress indicator
- 🧠 Interactive results history

**Backend**
- 🐍 FastAPI (Python)
- 🤖 AI-based evaluation logic
- 📄 File handling (PDF, TXT)
- 🧪 Modular endpoints for upload & analysis

---

## 📁 Project Structure

ai-resume-analyzer/
│
├── frontend/ # React + Tailwind UI
│ ├── src/
│ │ ├── components/
│ │ │ └── FileUpload.tsx
│ │ ├── pages/
│ │ │ └── Home.tsx
│ │ ├── App.tsx
│ │ └── index.tsx
│ └── tailwind.config.js
│
├── backend/ # FastAPI backend
│ ├── app/
│ │ ├── main.py
│ │ └── routes/
│ │ └── upload.py
│ ├── requirements.txt
│ └── README.md
│
├── package-lock.json
├── README.md # (this file)
└── .gitignore

yaml
Copy code

---

## 🧠 Features

- 📝 Upload resumes (`.pdf` / `.txt`)
- ⚡ AI-based scoring and evaluation
- 📊 Dynamic keyword insights
- 🌀 Spinner progress feedback
- 🧾 Downloadable detailed report
- 🕒 History tracking for multiple uploads

---

## 🛠️ Local Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/MasterAditya/insight-lens.git
cd insight-lens
2️⃣ Setup the Backend (FastAPI)
bash
Copy code
cd backend
python -m venv venv
venv\Scripts\activate       # (Windows)
pip install -r requirements.txt
uvicorn app.main:app --reload
👉 Server runs on http://127.0.0.1:8000

3️⃣ Setup the Frontend (React + Tailwind)
Open a new terminal tab:

bash
Copy code
cd frontend
npm install
npm start
👉 App runs on http://localhost:3000

⚙️ Environment Variables (optional)
For local or cloud integration:

ini
Copy code
BACKEND_URL=http://127.0.0.1:8000
🌍 Deployment
🧱 GitHub
Push the entire repo:

bash
Copy code
git add .
git commit -m "🚀 Initial commit: InsightLens AI Resume Analyzer v1"
git branch -M main
git remote add origin https://github.com/MasterAditya/insight-lens.git
git push -u origin main
☁️ Vercel (Frontend)
Login at vercel.com

Import your GitHub repo

Set build command → npm run build

Set output directory → dist or build

Add environment variable:
VITE_API_URL = https://your-backend-url

⚡ Backend Hosting
Use Render, Railway, or Vercel Functions for your FastAPI backend.

🧪 API Endpoints
Method	Endpoint	Description
POST	/upload	Upload and analyze a resume

Example:

bash
Copy code
curl -X POST -F "file=@resume.pdf" http://127.0.0.1:8000/upload
🧰 Contributing
Fork the repository

Create a new branch:

bash
Copy code
git checkout -b feature/your-feature
Commit and push your changes

Open a Pull Request 🚀

🪪 License
This project is licensed under the MIT License — see the LICENSE file for details.

👨‍💻 Author
Aditya Sharma (@MasterAditya)
AI & ML Developer | Full-stack Engineer | Open Source Builder
