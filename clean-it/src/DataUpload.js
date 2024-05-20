import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import xlsx library
import { Container, Form, Button, Alert, Card, Table, Spinner } from 'react-bootstrap';

function DataUpload() {
    const [file, setFile] = useState(null);
    const [threshold, setThreshold] = useState(50);
    const [cleanedData, setCleanedData] = useState([]);
    const [initialRowCount, setInitialRowCount] = useState(0);
    const [cleanedRowCount, setCleanedRowCount] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleThresholdChange = (e) => {
        setThreshold(parseInt(e.target.value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file) {
            setLoading(true);
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                console.log('Parsed Excel data:', jsonData); // Debugging line
                setInitialRowCount(jsonData.length);
                try {
                    const response = await axios.post('http://127.0.0.1:5000/clean', {
                        data: jsonData,
                        threshold: threshold
                    });
                    console.log('Cleaned data response:', response.data); // Debugging line
                    if (response.data.error) {
                        throw new Error(response.data.error);
                    }
                    setCleanedData(response.data.cleanedData);
                    setCleanedRowCount(response.data.cleanedRowCount);
                    setError('');
                } catch (error) {
                    console.error('Error cleaning data', error);
                    setError(`Failed to clean data: ${error.message}`);
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            setError('Please upload a file.');
        }
    };

    const exportData = (format) => {
        if (cleanedData.length === 0) {
            setError('No cleaned data available to export.');
            return;
        }

        if (format === 'csv') {
            // Convert cleaned data to CSV format
            const csvContent = 'data:text/csv;charset=utf-8,' + cleanedData.map(row => Object.values(row).join(',')).join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'cleaned_data.csv');
            document.body.appendChild(link);
            link.click();
        } else if (format === 'json') {
            // Convert cleaned data to JSON format
            const jsonContent = JSON.stringify(cleanedData, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'cleaned_data.json');
            document.body.appendChild(link);
            link.click();
        }
    };

    return (
        <Container>
            <Card className="my-4">
                <Card.Body>
                    <Card.Title><strong className='bold text-muted'>Automated Data Cleaning Tool</strong></Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload your data file (CSV or Excel)</Form.Label>
                            <Form.Control type="file" accept=".csv,.xlsx" onChange={handleFileChange} />
                        </Form.Group>
                        <Form.Group controlId="formThreshold" className="mb-3">
                            <Form.Label>Threshold for removing rows with missing values (%)</Form.Label>
                            <Form.Control as="select" value={threshold} onChange={handleThresholdChange}>
                                <option value={20}>20%</option>
                                <option value={40}>40%</option>
                                <option value={50}>50%</option>
                                <option value={60}>60%</option>
                                <option value={80}>80%</option>
                                <option value={100}>100%</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" /> Processing...
                                </>
                            ) : (
                                'Upload and Clean Data'
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {loading && (
                <div className="d-flex justify-content-center my-4">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Processing...</span>
                    </Spinner>
                </div>
            )}

            {cleanedData.length > 0 && (
                <Card className="my-4">
                    <Card.Body>
                        <Card.Title><strong className='bold text-muted'>Cleaned Data</strong></Card.Title>
                        <p><strong className='text-muted'>Initial Row Count: {initialRowCount}</strong></p>
                        <p><strong className='text-muted'>Cleaned Row Count: {cleanedRowCount}</strong></p>
                        <Button variant="success" onClick={() => exportData('csv')}>Export as CSV</Button>
                        <Button variant="secondary mx-3" onClick={() => exportData('json')}>Export as JSON</Button>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {Object.keys(cleanedData[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {cleanedData.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((value, idx) => (
                                            <td key={idx}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default DataUpload;
