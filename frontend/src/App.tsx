import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import jsPDF from "jspdf";

// --- Types ---
type ResultType = {
  filename?: string;
  score?: number;
  keywords?: string[];
  summary?: string;
  size?: number;
  timestamp?: number;
  suggestions?: string[];
  contact?: string; // Optional: for future contact extraction
};

type HistoryItem = {
  result: ResultType;
  uploadedAt: number;
};

type Theme = "light" | "dark";

// --- Helper: File icon ---
const getFileIcon = (filename?: string) => {
  if (!filename) return null;
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf")
    return (
      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900">
        <svg className="h-6 w-6 text-red-500 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  return (
    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900">
      <svg className="h-6 w-6 text-blue-500 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
};

// --- Helper: Progress bar color ---
const getScoreColor = (score: number) => {
  if (score < 50) return "from-red-500 to-red-300";
  if (score < 76) return "from-yellow-400 to-yellow-200";
  return "from-green-500 to-green-300";
};

// --- Helper: Score emoji ---
const getScoreEmoji = (score: number) => {
  if (score < 50) return "😟";
  if (score < 76) return "🙂";
  return "🚀";
};

// --- Helper: Tooltip text for score ---
const getScoreTooltip = (score: number) => {
  if (score < 50) return "Needs improvement. Try adding more relevant skills and experience.";
  if (score < 76) return "Average match. Consider tailoring your resume further.";
  return "Excellent! Your resume is highly relevant.";
};

// --- Helper: File type check ---
function isSupportedFile(file: File | null): boolean {
  if (!file) return false;
  const allowedTypes = ["application/pdf", "text/plain"];
  const allowedExts = [".pdf", ".txt"];
  if (allowedTypes.includes(file.type)) return true;
  return allowedExts.some((ext) => file.name.toLowerCase().endsWith(ext));
}

// --- Helper: Format bytes ---
const formatBytes = (bytes?: number) =>
  bytes ? `${(bytes / 1024).toFixed(2)} KB` : "N/A";

// --- Helper: Format timestamp ---
const formatTimestamp = (ts?: number) =>
  ts ? new Date(ts).toLocaleString() : "N/A";

// --- Helper: Download TXT ---
const downloadTxt = (filename: string, text: string) => {
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

// --- Helper: Download PDF (improved, professional, bluish theme, logo, contact, QR) ---
const downloadPdf = (filename: string, text: string, result?: ResultType) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // --- Colors ---
  const blue = "#2563eb";
  const lightBlue = "#e0e7ff";
  const green = "#22c55e";
  const yellow = "#facc15";
  const red = "#ef4444";
  const gray = "#64748b";
  const divider = "#e5e7eb";

  // --- Header ---
  doc.setFillColor(blue);
  doc.rect(0, 0, 210, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("AI Resume Analysis Report", 15, 13);

  // App icon (circle + "IE")
  doc.setFillColor(lightBlue);
  doc.circle(195, 12, 6, "F");
  doc.setTextColor(blue);
  doc.setFontSize(12);
  doc.text("IE", 192, 15);

  // --- Main Card Shadow/Border ---
  doc.setDrawColor(divider);
  doc.setLineWidth(0.5);
  doc.roundedRect(10, 25, 190, 250, 6, 6);

  // --- Date & Filename & Contact ---
  doc.setFontSize(11);
  doc.setTextColor(gray);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${formatTimestamp(result?.timestamp)}`, 20, 32);
  doc.text(`Filename: ${result?.filename || "N/A"}`, 20, 38);
  if (result?.contact) {
    doc.text(`Contact: ${result.contact}`, 20, 44);
  }

  // --- Divider ---
  doc.setDrawColor(divider);
  doc.line(20, result?.contact ? 48 : 42, 200, result?.contact ? 48 : 42);

  // --- Overall Score ---
  const score = result?.score ?? 0;
  let scoreColor = green;
  let scoreLabel = "Excellent";
  if (score < 50) {
    scoreColor = red;
    scoreLabel = "Needs Improvement";
  } else if (score < 76) {
    scoreColor = yellow;
    scoreLabel = "Moderate";
  }
  const scoreY = result?.contact ? 58 : 54;
  doc.setFontSize(17);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(scoreColor);
  doc.text(`Score: ${score}%`, 20, scoreY);
  doc.setFontSize(12);
  doc.setTextColor(gray);
  doc.setFont("helvetica", "normal");
  doc.text(scoreLabel, 20, scoreY + 6);

  // --- Score Bar ---
  doc.setDrawColor(divider);
  doc.setFillColor(lightBlue);
  doc.roundedRect(20, scoreY + 10, 180, 8, 4, 4, "F");
  doc.setFillColor(scoreColor);
  doc.roundedRect(20, scoreY + 10, (score / 100) * 180, 8, 4, 4, "F");

  // --- Divider ---
  doc.setDrawColor(divider);
  doc.line(20, scoreY + 21, 200, scoreY + 21);

  // --- Keywords Section ---
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(blue);
  doc.text("Top Keywords", 20, scoreY + 31);

  let kwY = scoreY + 38;
  if (result?.keywords && result.keywords.length > 0) {
    result.keywords.slice(0, 10).forEach((kw, i) => {
      // Pill badge
      const x = 20 + (i % 5) * 36;
      const y = kwY + Math.floor(i / 5) * 10;
      doc.setFillColor(lightBlue);
      doc.roundedRect(x, y, 34, 8, 4, 4, "F");
      doc.setFontSize(11);
      doc.setTextColor(blue);
      doc.setFont("helvetica", "bold");
      doc.text(kw, x + 3, y + 6);
    });
    kwY += Math.ceil(result.keywords.length / 5) * 10 + 2;
  } else {
    doc.setFontSize(11);
    doc.setTextColor(gray);
    doc.setFont("helvetica", "normal");
    doc.text("None detected", 20, kwY);
    kwY += 10;
  }

  // --- Divider ---
  doc.setDrawColor(divider);
  doc.line(20, kwY + 4, 200, kwY + 4);

  // --- Summary Section ---
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(blue);
  doc.text("Summary / Insights", 20, kwY + 14);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(gray);
  const summaryText = result?.summary && result.summary.trim().length > 0
    ? result.summary
    : "No summary available.";
  const summaryLines = doc.splitTextToSize(summaryText, 170);
  doc.text(summaryLines, 20, kwY + 21);

  // --- Divider ---
  let summaryEndY = kwY + 21 + summaryLines.length * 6 + 2;
  doc.setDrawColor(divider);
  doc.line(20, summaryEndY, 200, summaryEndY);

  // --- Actionable Points ---
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(blue);
  doc.text("Actionable Points", 20, summaryEndY + 10);

  // Colored box for actionable points
  let sugY = summaryEndY + 14;
  if (result?.suggestions && result.suggestions.length > 0) {
    result.suggestions.forEach((s, i) => {
      doc.setFillColor(yellow);
      doc.roundedRect(20, sugY + i * 9, 170, 8, 2, 2, "F");
      doc.setFontSize(11);
      doc.setTextColor(gray);
      doc.setFont("helvetica", "bold");
      doc.text(`• ${s}`, 23, sugY + 6 + i * 9);
    });
    sugY += result.suggestions.length * 9;
  } else {
    doc.setFontSize(11);
    doc.setTextColor(gray);
    doc.setFont("helvetica", "normal");
    doc.text("No suggestions available.", 23, sugY + 6);
    sugY += 15;
  }

  // --- Footer ---
  doc.setFontSize(10);
  doc.setTextColor(gray);
  doc.text(
    `Generated by InsightEyes Resume Analyzer • https://insighteyes.ai`,
    105,
    290,
    { align: "center" }
  );

  // --- Optional: QR code (future enhancement) ---
  // import jsPDFQRCode from 'jspdf-qrcode' and use:
  // jsPDFQRCode(doc, "https://insighteyes.ai", { x: 180, y: 275, size: 15 });

  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
};

// --- Helper: Copy to clipboard ---
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

// --- Toast Notification Component ---
const Toast: React.FC<{ message: string; type: "error" | "success"; onClose: () => void }> = ({
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg transition-all
        ${type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}
        animate-fade-in`}
      role="alert"
    >
      {message}
    </div>
  );
};

// --- Main App ---
const InsightEyes: React.FC = () => {
  // --- State ---
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showSummary, setShowSummary] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareFiles, setCompareFiles] = useState<(HistoryItem | null)[]>([null, null]);
  const [theme, setTheme] = useState<Theme>("light");
  const [scoreAnim, setScoreAnim] = useState(0);

  const dropRef = useRef<HTMLDivElement>(null);

  // --- Animate score bar ---
  useEffect(() => {
    if (result?.score !== undefined) {
      let start = 0;
      const end = result.score;
      const duration = 800;
      const step = Math.max(1, Math.floor(end / (duration / 16)));
      const animate = () => {
        setScoreAnim((prev) => {
          if (prev < end) return Math.min(prev + step, end);
          return end;
        });
      };
      setScoreAnim(0);
      const interval = setInterval(animate, 16);
      setTimeout(() => clearInterval(interval), duration + 100);
      return () => clearInterval(interval);
    }
  }, [result?.score]);

  // --- Toast logic ---
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
  useEffect(() => {
    if (error) setToast({ message: error, type: "error" });
    if (success) setToast({ message: success, type: "success" });
  }, [error, success]);

  // --- File upload handler ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (!isSupportedFile(selected)) {
      setError("Only PDF and TXT files are allowed.");
      setFile(null);
      setResult(null);
      setSuccess("");
      return;
    }
    setFile(selected);
    setResult(null);
    setError("");
    setSuccess("");
  };

  // --- Drag-and-drop handler ---
  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      dropArea.classList.add("ring-2", "ring-blue-400");
    };
    const handleDragLeave = () => {
      dropArea.classList.remove("ring-2", "ring-blue-400");
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dropArea.classList.remove("ring-2", "ring-blue-400");
      const droppedFile = e.dataTransfer?.files?.[0];
      if (droppedFile && isSupportedFile(droppedFile)) {
        setFile(droppedFile);
        setResult(null);
        setError("");
        setSuccess("");
      } else {
        setError("Only PDF and TXT files are allowed.");
      }
    };
    dropArea.addEventListener("dragover", handleDragOver);
    dropArea.addEventListener("dragleave", handleDragLeave);
    dropArea.addEventListener("drop", handleDrop);
    return () => {
      dropArea.removeEventListener("dragover", handleDragOver);
      dropArea.removeEventListener("dragleave", handleDragLeave);
      dropArea.removeEventListener("drop", handleDrop);
    };
  }, []);

  // --- Upload & Analyze handler ---
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF or TXT file.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setSuccess("");
    setShowSummary(false);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        setLoading(false);
        return;
      }
      const now = Date.now();
      const newResult: ResultType = {
        ...data,
        size: file.size,
        timestamp: now,
        suggestions: data.summary
          ? data.summary.split(/[\n\r]+/).filter((s: string) => s.trim().length > 0)
          : [],
      };
      setResult(newResult);
      setSuccess("Resume analyzed successfully!");
      setHistory((prev) => [
        { result: newResult, uploadedAt: now },
        ...prev.slice(0, 4),
      ]);
    } catch (err) {
      setError("Network or CORS error. Is the backend running?");
    }
    setLoading(false);
  };

  // --- Theme toggle ---
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // --- Compare feature ---
  const handleCompareSelect = (idx: number, item: HistoryItem) => {
    setCompareFiles((prev) => {
      const arr = [...prev];
      arr[idx] = item;
      return arr;
    });
  };

  // --- Download report ---
  const handleDownloadReport = (type: "txt" | "pdf") => {
    if (!result) return;
    const report = [
      `Filename: ${result.filename}`,
      `Size: ${formatBytes(result.size)}`,
      `Uploaded: ${formatTimestamp(result.timestamp)}`,
      `Score: ${result.score}`,
      `Keywords: ${(result.keywords || []).join(", ")}`,
      `Summary: ${result.summary}`,
      `Suggestions:\n${(result.suggestions || []).map((s) => `- ${s}`).join("\n")}`,
    ].join("\n");
    if (type === "txt") downloadTxt(`${result.filename || "resume"}.txt`, report);
    else downloadPdf(`${result.filename || "resume"}.pdf`, report, result);
  };

  // --- Main UI ---
  return (
    <>
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-gray-100"} flex items-center justify-center px-2 transition-colors duration-500`}>
        {/* --- Toast Notifications --- */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => { setToast(null); setError(""); setSuccess(""); }} />}

        <div className="w-full max-w-3xl">
          {/* --- Header & Theme Toggle --- */}
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-4xl font-extrabold tracking-tight ${theme === "dark" ? "text-blue-200" : "text-blue-700"}`}>InsightEyes Resume Analyzer</h1>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow hover:scale-105 transition"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          </div>
          <p className={`text-center mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Upload your resume and get instant, AI-powered feedback to impress recruiters.</p>

          {/* --- Tabs: Analyze / History / Compare --- */}
          <div className="flex gap-2 mb-6">
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition ${!showHistory && !compareMode ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
              onClick={() => { setShowHistory(false); setCompareMode(false); }}
            >
              Analyze
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition ${showHistory ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
              onClick={() => { setShowHistory(true); setCompareMode(false); }}
            >
              History
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition ${compareMode ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
              onClick={() => { setShowHistory(false); setCompareMode(true); }}
            >
              Compare
            </button>
          </div>

          {/* --- Analyze Tab --- */}
          {!showHistory && !compareMode && (
            <div>
              {/* --- File Card & Drag-and-Drop --- */}
              <div
                ref={dropRef}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl flex flex-col items-center`}
              >
                <div className="w-full flex flex-col items-center">
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                    className="mb-2 block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={loading}
                  />
                  <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">Or drag and drop your file here</div>
                  {/* --- Uploaded File Card --- */}
                  {file && (
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-xl shadow px-4 py-3 w-full max-w-xs mt-2 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
                      {getFileIcon(file.name)}
                      <div className="flex flex-col">
                        <span className="text-gray-700 dark:text-gray-200 font-medium truncate">{file.name}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-400">{formatBytes(file.size)}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-400">{formatTimestamp(Date.now())}</span>
                      </div>
                    </div>
                  )}
                </div>
                {/* --- Upload & Analyze Button --- */}
                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className={`w-full py-3 mt-6 rounded-xl font-semibold text-white transition-all duration-300
                    ${loading
                      ? "bg-blue-400 cursor-not-allowed animate-pulse"
                      : "bg-blue-600 hover:bg-blue-700 active:scale-95"}
                  `}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "Upload & Analyze"
                  )}
                </button>
              </div>

              {/* --- Results Section --- */}
              {result && (
                <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mt-2 border border-gray-200 dark:border-gray-700`}>
                  {/* --- File Card --- */}
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-xl shadow px-4 py-3 w-full max-w-xs mb-6 border border-gray-200 dark:border-gray-700 mx-auto hover:shadow-lg transition">
                    {getFileIcon(result.filename)}
                    <div className="flex flex-col">
                      <span className="text-gray-700 dark:text-gray-200 font-medium truncate">{result.filename || "N/A"}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-400">{formatBytes(result.size)}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-400">{formatTimestamp(result.timestamp)}</span>
                    </div>
                  </div>
                  {/* --- AI Score Progress Bar --- */}
                  <div className="mb-6 group relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">AI Score</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {scoreAnim}/100 <span className="text-2xl">{getScoreEmoji(scoreAnim)}</span>
                      </span>
                    </div>
                    <div className="w-full h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(scoreAnim)} transition-all duration-700`}
                        style={{ width: `${scoreAnim}%` }}
                      ></div>
                    </div>
                    <div className="absolute right-0 top-0 mt-8 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition">
                      {getScoreTooltip(scoreAnim)}
                    </div>
                  </div>
                  {/* --- Top Keywords as Badges --- */}
                  <div className="mb-6">
                    <span className="font-semibold text-gray-700 dark:text-gray-200 block mb-2">Top Keywords</span>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords && result.keywords.length > 0 ? (
                        <>
                          {result.keywords.slice(0, 7).map((kw, i) => (
                            <span
                              key={kw}
                              className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium text-sm shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition cursor-pointer relative group"
                            >
                              {kw}
                              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                {`Keyword: ${kw}`}
                              </span>
                            </span>
                          ))}
                          {result.keywords.length > 7 && (
                            <button
                              className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                              onClick={() => setShowSummary(true)}
                            >
                              +{result.keywords.length - 7} more
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400">None detected</span>
                      )}
                    </div>
                  </div>
                  {/* --- Collapsible Summary Panel --- */}
                  <div className="mb-2">
                    <button
                      onClick={() => setShowSummary((v) => !v)}
                      className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold transition-all duration-200 shadow"
                    >
                      {showSummary ? "Hide Summary" : "View Summary"}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ${showSummary ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"}`}
                    >
                      {showSummary && (
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-inner animate-fade-in">
                          <div className="mb-2 font-semibold">Summary:</div>
                          <div className="mb-4">{result.summary || "No summary available."}</div>
                          <div className="mb-2 font-semibold">Actionable Points:</div>
                          <ul className="mb-4 list-none pl-0">
                            {(result.suggestions || []).map((s, i) => (
                              <li key={i} className="flex items-start gap-2 mb-2">
                                <span className="text-lg">{["💡", "✅", "🔍", "📈", "📝", "⭐", "🚀"][i % 7]}</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                              onClick={() => copyToClipboard(result.summary || "")}
                            >
                              Copy Summary
                            </button>
                            <button
                              className="px-3 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                              onClick={() => downloadTxt("summary.txt", result.summary || "")}
                            >
                              Download TXT
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* --- Download Report --- */}
                  <div className="flex gap-2 mt-4">
                    <button
                      className="px-3 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                      onClick={() => handleDownloadReport("txt")}
                    >
                      Download Report (TXT)
                    </button>
                    <button
                      className="px-3 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                      onClick={() => handleDownloadReport("pdf")}
                    >
                      Download Report (PDF)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- History Tab --- */}
          {showHistory && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-200">Upload History</h2>
              {history.length === 0 && <div className="text-gray-400">No history yet.</div>}
              <div className="flex flex-col gap-4">
                {history.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-xl shadow px-4 py-3 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
                    {getFileIcon(item.result.filename)}
                    <div className="flex flex-col flex-1">
                      <span className="text-gray-700 dark:text-gray-200 font-medium truncate">{item.result.filename || "N/A"}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-400">{formatBytes(item.result.size)}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-400">{formatTimestamp(item.uploadedAt)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {item.result.score}/100 <span className="text-2xl">{getScoreEmoji(item.result.score ?? 0)}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Compare Tab --- */}
          {compareMode && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-200">Compare Resumes</h2>
              <div className="flex flex-col md:flex-row gap-6">
                {[0, 1].map((idx) => (
                  <div key={idx} className="flex-1">
                    <div className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Select Resume {idx + 1}</div>
                    <select
                      className="w-full mb-4 px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      value={compareFiles[idx]?.result.filename || ""}
                      onChange={(e) => {
                        const selected = history.find((h) => h.result.filename === e.target.value);
                        if (selected) handleCompareSelect(idx, selected);
                      }}
                    >
                      <option value="">Select...</option>
                      {history.map((item, i) => (
                        <option key={i} value={item.result.filename}>
                          {item.result.filename}
                        </option>
                      ))}
                    </select>
                    {compareFiles[idx] && (
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-xl shadow px-4 py-3 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
                        {getFileIcon(compareFiles[idx]?.result.filename)}
                        <div className="flex flex-col">
                          <span className="text-gray-700 dark:text-gray-200 font-medium truncate">{compareFiles[idx]?.result.filename || "N/A"}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-400">{formatBytes(compareFiles[idx]?.result.size)}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-400">{formatTimestamp(compareFiles[idx]?.result.timestamp)}</span>
                          <span className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            {compareFiles[idx]?.result.score}/100 <span className="text-2xl">{getScoreEmoji(compareFiles[idx]?.result.score ?? 0)}</span>
                          </span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {compareFiles[idx]?.result.keywords?.slice(0, 5).map((kw) => (
                              <span key={kw} className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium text-sm shadow">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Footer --- */}
          <div className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8">
            &copy; {new Date().getFullYear()} InsightEyes Resume Analyzer. Impress recruiters with AI!
          </div>
        </div>
      </div>
    </>
  );
};

export default InsightEyes;
