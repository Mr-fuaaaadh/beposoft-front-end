import React, { useState } from "react";
import { Row, Col, Card, Form, CardBody, CardTitle, CardSubtitle, Container, Alert, Spinner } from "reactstrap";
import Dropzone from "react-dropzone";
import * as XLSX from "xlsx"; // Import the XLSX library
import axios from "axios"; // Import axios

// Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";

const FormUpload = () => {
    // meta title
    document.title = "Form File Upload | Skote - Vite React Admin & Dashboard Template";

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [excelData, setExcelData] = useState(null); // State to hold parsed data
    const [isLoading, setIsLoading] = useState(false); // State for loading
    const [successMessage, setSuccessMessage] = useState(""); // State for success message
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    const token = localStorage.getItem('token');

    function handleAcceptedFiles(files) {
        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        );
        setSelectedFiles(files);

        // Process Excel file if it's of xlsx type
        const file = files[0];
        if (file && file.name.endsWith(".xlsx")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const binaryString = e.target.result;
                const workbook = XLSX.read(binaryString, { type: "binary" });
                const sheetName = workbook.SheetNames[0]; // Use the first sheet
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                setExcelData(jsonData); // Store the parsed data in state
            };
            reader.readAsBinaryString(file);
        }
    }

    /**
     * Formats the size
     */
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    // Function to send file to Django backend
    const sendFilesToBackend = () => {
        const formData = new FormData();

        // Check if files are selected
        if (selectedFiles.length === 0) {
            setErrorMessage("No files selected.");
            return;
        }

        // Append the files to the FormData
        selectedFiles.forEach(file => {
            formData.append("file", file);
        });

        setIsLoading(true); // Set loading state

        // Send the files using axios
        axios
            .post(`${import.meta.env.VITE_APP_APIKEY}bulk/upload/products/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(response => {
                setIsLoading(false); // Stop loading
                setSuccessMessage("Files uploaded successfully!");
                setErrorMessage(""); // Clear any previous error messages
            })
            .catch(error => {
                setIsLoading(false); // Stop loading
                setErrorMessage("Error uploading files. Please try again.");
                setSuccessMessage(""); // Clear any previous success messages
            });
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Forms" breadcrumbItem="Form File Upload" />

                    <Row>
                        <Col className="col-12">
                            <Card>
                                <CardBody>
                                    <CardTitle>Dropzone</CardTitle>
                                    <CardSubtitle className="mb-3">
                                        DropzoneJS is an open source library that provides drag’n’drop file uploads with image previews.
                                    </CardSubtitle>
                                    <Form>
                                        <Dropzone
                                            onDrop={acceptedFiles => {
                                                handleAcceptedFiles(acceptedFiles);
                                            }}
                                        >
                                            {({ getRootProps, getInputProps }) => (
                                                <div className="dropzone">
                                                    <div className="dz-message needsclick mt-2" {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <div className="mb-3">
                                                            <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                        </div>
                                                        <h4>Drop files here or click to upload.</h4>
                                                    </div>
                                                </div>
                                            )}
                                        </Dropzone>
                                        <div className="dropzone-previews mt-3" id="file-previews">
                                            {selectedFiles.map((f, i) => (
                                                <Card
                                                    className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                    key={i + "-file"}
                                                >
                                                    <div className="p-2">
                                                        <Row className="align-items-center">
                                                            <Col className="col-auto">
                                                                <img
                                                                    data-dz-thumbnail=""
                                                                    height="80"
                                                                    className="avatar-sm rounded bg-light"
                                                                    alt={f.name}
                                                                    src={f.preview}
                                                                />
                                                            </Col>
                                                            <Col>
                                                                <Link to="#" className="text-muted font-weight-bold">
                                                                    {f.name}
                                                                </Link>
                                                                <p className="mb-0">
                                                                    <strong>{f.formattedSize}</strong>
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </Form>

                                    {/* Display parsed Excel data in a table */}
                                    {excelData && (
                                        <div className="mt-4">
                                            <h5>Excel Data</h5>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        {Object.keys(excelData[0]).map((key) => (
                                                            <th key={key}>{key}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {excelData.map((row, index) => (
                                                        <tr key={index}>
                                                            {Object.values(row).map((value, i) => (
                                                                <td key={i}>{value}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Display Success and Error Messages */}
                                    {successMessage && (
                                        <Alert color="success">
                                            {successMessage}
                                        </Alert>
                                    )}
                                    {errorMessage && (
                                        <Alert color="danger">
                                            {errorMessage}
                                        </Alert>
                                    )}

                                    {/* Loading Spinner */}
                                    {isLoading && (
                                        <div className="text-center">
                                            <Spinner color="primary" /> Uploading...
                                        </div>
                                    )}

                                    <div className="text-center mt-4">
                                        <button type="button" className="btn btn-primary" onClick={sendFilesToBackend} disabled={isLoading}>
                                            {isLoading ? "Uploading..." : "Send Files"}
                                        </button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default FormUpload;
