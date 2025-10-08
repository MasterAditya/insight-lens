# 🧠 InsightEyes – AI-Powered Resume Analyzer

> Upload your resume and get **instant, AI-powered feedback** to impress recruiters.  
> Built with React, Tailwind CSS, and FastAPI.

![Demo Screenshot](./assets/demo-1.png)

---

## ✨ Features

- 📄 **Resume Upload** – Drag & drop or select PDF/TXT files.  
- ⚡ **AI Analysis** – Keyword extraction, score calculation, and actionable insights.  
- 📊 **Downloadable Reports** – Generate TXT or PDF reports in one click.  
- 🕒 **History Tab** – Access previous analyses instantly.  
- 🌀 **Spinner / Progress UI** – Smooth UX while processing resumes.  
- 🔍 **Keyword Matching** – Highlights strengths and missing skills.

---

## 🧰 Tech Stack

**Frontend**
- React  
- Tailwind CSS  
- Vite / CRA (depending on your setup)  
- Deployed on [Vercel](https://vercel.com)

**Backend**
- FastAPI (Python)  
- Uvicorn server  
- Basic keyword & AI analysis logic

---

## 🚀 Live Demo

👉 [https://insighteyes.vercel.app](https://insighteyes.vercel.app) *(replace with your actual URL after deployment)*

---

## 🛠️ Local Setup

### Frontend

```bash
git clone https://github.com/MasterAditya/ai-resume-analyzer.git
cd ai-resume-analyzer/frontend
npm install
npm start
Visit http://localhost:3000 to run the app.

Backend
bash
Copy code
cd ai-resume-analyzer/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
The API will be live at http://127.0.0.1:8000.

📂 File Structure
css
Copy code
frontend/
 └─ src/
     ├─ components/
     │   └─ FileUpload.tsx
     ├─ pages/
     │   └─ Home.tsx
     ├─ App.tsx
     └─ index.tsx

backend/
 └─ app/
     └─ main.py
🤝 Contributing
Pull requests are welcome!
For major changes, please open an issue first to discuss what you'd like to change.

📄 License
This project is licensed under the MIT License.
See the LICENSE file for details.

👤 Author
Aditya Sharma
🌐 LinkedIn • 💻 GitHub