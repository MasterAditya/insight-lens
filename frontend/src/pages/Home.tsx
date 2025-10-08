import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';

const Home = () => {
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleAnalysisResult = (result) => {
        setAnalysisResult(result);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">AI-Powered Resume Analyzer</h1>
            <FileUpload onAnalysisResult={handleAnalysisResult} />
            {analysisResult && (
                <div className="mt-4 p-4 border rounded bg-white shadow">
                    <h2 className="text-xl font-semibold">Analysis Result:</h2>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(analysisResult, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Home;