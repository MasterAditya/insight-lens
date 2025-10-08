# AI-Powered Resume Analyzer Frontend

This is the frontend part of the AI-Powered Resume Analyzer application built with React and Tailwind CSS. This application allows users to upload their resumes and receive AI-powered evaluations.

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Getting Started

Follow these steps to set up and run the frontend application locally:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd ai-resume-analyzer/frontend
   ```

2. **Install dependencies:**

   Run the following command to install the required packages:

   ```bash
   npm install
   ```

3. **Configure Tailwind CSS:**

   Ensure that Tailwind CSS is properly configured. You can refer to the `tailwind.config.js` file for the setup.

4. **Run the application:**

   Start the development server with the following command:

   ```bash
   npm start
   ```

   This will start the application on `http://localhost:3000`.

## File Structure

- `src/components/FileUpload.tsx`: Component for uploading resumes.
- `src/pages/Home.tsx`: Main page that includes the FileUpload component and displays analysis results.
- `src/App.tsx`: Main application component that sets up routing.
- `src/index.tsx`: Entry point of the React application.
- `public/index.html`: Main HTML file for the React application.

## Usage

Once the application is running, navigate to `http://localhost:3000` in your web browser. You will be able to upload PDF or TXT resumes and view the AI evaluation results.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.