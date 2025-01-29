import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import {
    Row,
    Col,
    Card,
    CardBody,
    Form,
    Label,
    Input,
    Button,
    Container,
    FormGroup,
    FormFeedback,
} from "reactstrap";
import axios from "axios";

const FormRepeater = () => {
    document.title = "Form Repeater | Skote - Vite React Admin & Dashboard Template";

    const [formRows, setFormRows] = useState([
        {
            id: 1,
            box: "Box 1",  // Start with Box 1 by default
            weight: "",
            length: "",
            breadth: "",
            height: "",
            image: null,
            packed_by: "",
            parcel_service: ""
        }
    ]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const token = localStorage.getItem('token');
    const [staffs, setStaffs] = useState([]);
    const { id } = useParams();

    const onAddFormRow = () => {
        const newRow = {
            id: formRows.length + 1,
            box: `Box ${formRows.length + 1}`, // Automatically assign box name based on row count
            weight: "",
            length: "",
            breadth: "",
            height: "",
            image: null,
            packed_by: "",
        };
        setFormRows([...formRows, newRow]);
    };

    const onDeleteFormRow = (rowId) => {
        const updatedRows = formRows.filter((row) => row.id !== rowId);
        setFormRows(updatedRows);
    };

    const handleInputChange = (rowId, name, value) => {
        const updatedRows = formRows.map(row => {
            if (row.id === rowId) {
                return { ...row, [name]: value };
            }
            return row;
        });
        setFormRows(updatedRows);
    };

    const handleFileChange = (rowId, file) => {
        const updatedRows = formRows.map(row => {
            if (row.id === rowId) {
                return { ...row, image: file };
            }
            return row;
        });
        setFormRows(updatedRows);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_KEY}staffs/`,{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setStaffs(response.data.data);
            } catch (error) {
                console.error("Error fetching staffs:", error);
            }
        };

        fetchData();
    }, [token]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataList = formRows.map((row) => {
                const formData = new FormData();
                formData.append("box", row.box);
                formData.append("order", id);
                formData.append("weight", row.weight);
                formData.append("length", row.length);
                formData.append("breadth", row.breadth);
                formData.append("height", row.height);
                formData.append("packed_by", row.packed_by);
                if (row.image) {
                    formData.append("image", row.image);
                }
                return formData;
            });

            // Debugging the formData
            formDataList.forEach((formData, index) => {
                console.log(`FormData #${index + 1}:`);
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value);
                }
            });

            // Proceed with sending the requests
            const responsePromises = formDataList.map((formData) =>
                axios.post(
                    `${import.meta.env.VITE_APP_KEY}warehouse/data/`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                )
            );

            const responses = await Promise.all(responsePromises);

            let allSuccess = true;
            responses.forEach((response) => {
                if (response.data.status === "success") {
                    console.log("Row data successfully saved:", response.data);
                } else {
                    allSuccess = false;
                    setErrorMessage(response.data.message || "Unknown error");
                }
            });

            if (allSuccess) {
                setSuccessMessage("All data successfully saved!");
                // Clear the form after successful submission
                setFormRows([{
                    box: "Box 1",  // Reset to "Box 1" for new form rows
                    weight: "",
                    length: "",
                    breadth: "",
                    height: "",
                    image: null,
                    packed_by: "",
                }]);
            } else {
                setErrorMessage("Some rows failed to save. Please check the data.");
            }

        } catch (error) {
            console.error("Error during form submission:", error.response ? error.response.data : error.message);
            setErrorMessage("Error during form submission. Please try again.");
            setSuccessMessage(""); // Clear success message
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <CardBody>
                                    <h6 className="mb-4 card-title">PACKING INFORMATION</h6>
                                    <Form className="repeater" encType="multipart/form-data" onSubmit={handleSubmit}>
                                        {successMessage && <div className="alert alert-success">{successMessage}</div>}
                                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                                        <div>
                                            {formRows.map((formRow, key) => (
                                                <Row key={key}>
                                                    <Col sm={12} md={6} lg={3} className="mb-3">
                                                        <FormGroup>
                                                            <Label htmlFor="box">Box</Label>
                                                            <Input
                                                                type="text"
                                                                id="box"
                                                                value={formRow.box}
                                                                onChange={(e) => handleInputChange(formRow.id, 'box', e.target.value)}
                                                                className="form-control"
                                                                placeholder="Enter Box"
                                                            />
                                                        </FormGroup>
                                                    </Col>

                                                    <Col sm={12} md={6} lg={3} className="mb-3">
                                                        <FormGroup>
                                                            <Label htmlFor="weight">Weight</Label>
                                                            <Input
                                                                type="text"
                                                                id="weight"
                                                                value={formRow.weight}
                                                                onChange={(e) => handleInputChange(formRow.id, 'weight', e.target.value)}
                                                                className="form-control"
                                                                placeholder="Enter Weight"
                                                            />
                                                        </FormGroup>
                                                    </Col>

                                                    <Col sm={12} md={6} lg={3} className="mb-3">
                                                        <FormGroup>
                                                            <Label htmlFor="length">Length</Label>
                                                            <Input
                                                                type="text"
                                                                id="length"
                                                                value={formRow.length}
                                                                onChange={(e) => handleInputChange(formRow.id, 'length', e.target.value)}
                                                                className="form-control"
                                                                placeholder="Enter Length"
                                                            />
                                                        </FormGroup>
                                                    </Col>

                                                    <Col sm={12} md={6} lg={3} className="mb-3">
                                                        <FormGroup>
                                                            <Label htmlFor="breadth">Breadth</Label>
                                                            <Input
                                                                type="text"
                                                                id="breadth"
                                                                value={formRow.breadth}
                                                                onChange={(e) => handleInputChange(formRow.id, 'breadth', e.target.value)}
                                                                className="form-control"
                                                                placeholder="Enter Breadth"
                                                            />
                                                        </FormGroup>
                                                    </Col>

                                                    <Col sm={12} md={6} lg={3} className="mb-3">
                                                        <FormGroup>
                                                            <Label htmlFor="height">Height</Label>
                                                            <Input
                                                                type="text"
                                                                id="height"
                                                                value={formRow.height}
                                                                onChange={(e) => handleInputChange(formRow.id, 'height', e.target.value)}
                                                                className="form-control"
                                                                placeholder="Enter Height"
                                                            />
                                                        </FormGroup>
                                                    </Col>

                                                    <Col sm={12} md={6} lg={3} className="mb-3">
                                                        <FormGroup>
                                                            <Label htmlFor="image">Image</Label>
                                                            <Input
                                                                type="file"
                                                                id="image"
                                                                onChange={(e) => handleFileChange(formRow.id, e.target.files[0])}
                                                                className="form-control"
                                                            />
                                                        </FormGroup>
                                                    </Col>

                                                    <Col sm={12} md={6} lg={3} className="mb-3">
                                                        <FormGroup>
                                                            <Label htmlFor="packed_by">Packed By</Label>
                                                            <Input
                                                                type="select"
                                                                id="packed_by"
                                                                value={formRow.packed_by}
                                                                onChange={(e) => handleInputChange(formRow.id, 'packed_by', e.target.value)}
                                                                className="form-control"
                                                            >
                                                                <option value="">Select Packed By</option>
                                                                {staffs.map((staff, index) => (
                                                                    <option key={index} value={staff.id}>
                                                                        {staff.name}
                                                                    </option>
                                                                ))}
                                                            </Input>
                                                        </FormGroup>
                                                    </Col>

                                                    <Col sm={12} md={6} lg={3} className="align-self-center">
                                                        <div className="d-grid">
                                                            <Button
                                                                color="danger"
                                                                onClick={() => onDeleteFormRow(formRow.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </div>

                                        <Row className="mt-3">
                                            <Col sm={12} className="d-flex justify-content-start mb-3">
                                                <Button
                                                    color="success"
                                                    className="mt-3 mt-lg-0"
                                                    onClick={onAddFormRow}
                                                >
                                                    Add Row
                                                </Button>
                                            </Col>
                                            <Col sm={12} className="d-flex justify-content-end">
                                                <Button
                                                    color="primary"
                                                    type="submit"
                                                    className="mt-3 mt-lg-0"
                                                >
                                                    Submit
                                                </Button>
                                            </Col>
                                        </Row>

                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default FormRepeater;
