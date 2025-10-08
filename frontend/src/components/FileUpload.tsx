import React, { useState } from 'react';

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        setUploading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setMessage(`Upload successful: ${data.message}`);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="mb-4"
            />
            <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                {uploading ? 'Uploading...' : 'Upload Resume'}
            </button>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
};

export default FileUpload;