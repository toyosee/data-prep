CLEAN IT - An Automated Data Cleaning Application

Overview

The Automated Data Cleaning Application is a web-based tool designed to help users clean and normalize their data files (CSV and Excel formats) by removing rows with excessive missing values, filling in missing values, and normalizing numerical columns. The application features an easy-to-use interface for uploading files, setting cleaning parameters, and exporting cleaned data.

Functionality

    File Upload: Supports CSV and Excel files.
    Threshold Setting: Users can specify the percentage threshold for removing rows with missing values.
    Data Cleaning: Removes rows with excessive missing values, fills in missing values, and normalizes numerical columns.
    Export: Cleaned data can be exported in CSV and JSON formats.

Libraries and Components
Frontend

    React: JavaScript library for building user interfaces.
    Axios: Promise-based HTTP client for making API requests.
    XLSX: Library for parsing Excel files.
    React-Bootstrap: UI framework for responsive design.

Backend

    Flask: Micro web framework for Python.
    Pandas: Data manipulation and analysis library.
    Flask-CORS: Extension for handling Cross-Origin Resource Sharing (CORS).
    io: Core library for handling various I/O operations.

Installation
Prerequisites

    Node.js and npm
    Python 3.x
    pip (Python package installer)

Setup

    Clone the repository

git clone https://github.com/toyosee/data-prep
cd cleanit

Frontend Setup

cd frontend
npm install
npm start

This will start the frontend development server on http://localhost:3000.

Backend Setup

cd backend
pip install -r requirements.txt
python app.py

This will start the backend server on http://127.0.0.1:5000.

Usage

    Upload a Data File
        Go to the application homepage. - http://localhost:3000.
        Click on the "Upload your data file" button and select a CSV or Excel file from your computer.

    Set Cleaning Threshold
        Select the threshold percentage for removing rows with missing values from the dropdown menu.

    Upload and Clean Data
        Click the "Upload and Clean Data" button.
        Wait for the cleaning process to complete.
        View the cleaned data in the table displayed below.

    Export Cleaned Data
        Click on the "Export as CSV" or "Export as JSON" button to download the cleaned data in the desired format.


Logic for Cleaning, Normalizing, and Updating Data

    Removing Rows with Missing Values
        Rows with missing values exceeding the specified threshold are removed.
        The threshold is calculated as a percentage of the total columns.

    Filling Missing Values
        Numerical columns: Missing values are filled with the column mean.
        Non-numerical columns: Missing values are filled with the column mode (most frequent value).

    Normalizing Numerical Columns
        Numerical columns are normalized by subtracting the mean and dividing by the standard deviation of the column.

    Dropping Remaining Rows with Missing Values
        Any rows with remaining missing values after the above steps are dropped.
        Empty strings are replaced with pd.NA and dropped.


Deployment
Local Deployment

    Frontend

    cd clean-it
    npm start

    This will start the frontend.

    Backend

    Make sure the backend server is running as described in the setup section.

Cloud Deployment

    Choose a Cloud Provider
        AWS, Heroku, Google Cloud, etc.

    Deploy Backend
        Create a Python application server (e.g., using AWS Elastic Beanstalk, Heroku).

    Deploy Frontend
        Host the static files (e.g., AWS S3 with CloudFront, Netlify).

    Set Up CORS and Environment Variables
        Ensure CORS is properly configured in the Flask backend.
        Set environment variables for configuration as needed.

Export Functionality

    CSV Export: Converts cleaned data to CSV format and initiates a download.
    JSON Export: Converts cleaned data to JSON format and initiates a download.

Conclusion

This application provides a robust and user-friendly solution for cleaning and normalizing data files, making it easier for users to prepare their data for analysis and other purposes. With an intuitive interface and efficient backend processing, the Automated Data Cleaning Application is a valuable tool for anyone working with data sets (Large or small).

Feel free to contribute to the project by submitting issues or pull requests on the GitHub repository (https://github.com/toyosee/data-prep).

Author:
Elijah Abolaji