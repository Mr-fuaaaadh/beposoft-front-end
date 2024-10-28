import React, { useEffect, useState } from "react";
import { Table, Row, Col, Card, CardBody, CardTitle, Button, Form, FormGroup, Input, Label } from "reactstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import icons for edit and delete
import Breadcrumbs from "../../components/Common/Breadcrumb";

const BasicTable = () => {
    const [attributes, setAttributes] = useState([]); // Ensure attributes is an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false); // State to show/hide the form
    const [newAttribute, setNewAttribute] = useState(""); // State to store new attribute name
    const [newAttributeValue, setNewAttributeValue] = useState(""); // State to store new attribute value
    const [editingAttribute, setEditingAttribute] = useState(null); // State to track which attribute is being edited
    const [availableAttributes, setAvailableAttributes] = useState([]); // Ensure availableAttributes is an array
    const token = localStorage.getItem("token");

    // Fetch product attributes
    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}add/product/attribute/values/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                setAttributes(data || []); // Ensure data is an array
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch data");
                setLoading(false);
            }
        };

        fetchAttributes();
    }, [token]);

    // Fetch available attributes for the dropdown (if available via API)
    useEffect(() => {
        const fetchAvailableAttributes = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}product/attributes/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch attribute options");
                }

                const data = await response.json();
                setAvailableAttributes(data || []); // Ensure data is an array
            } catch (err) {
                setError("Failed to fetch attribute options");
            }
        };

        fetchAvailableAttributes();
    }, [token]);

    const handleAddOrUpdateAttribute = async (e) => {
        e.preventDefault();
        const apiUrl = editingAttribute
            ? `${import.meta.env.VITE_APP_APIKEY}product/attribute/${editingAttribute.id}/values/`
            : `${import.meta.env.VITE_APP_APIKEY}add/product/attribute/values/`;

        const method = editingAttribute ? "PUT" : "POST";

        try {
            const response = await fetch(apiUrl, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    value: newAttribute,
                    attribute: newAttributeValue // Add selected value for attribute
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to ${editingAttribute ? "update" : "add"} attribute`);
            }

            const updatedOrAddedAttribute = await response.json();
            if (editingAttribute) {
                setAttributes(
                    attributes.map((attr) => (attr.id === editingAttribute.id ? updatedOrAddedAttribute : attr))
                );
            } else {
                setAttributes([...attributes, updatedOrAddedAttribute]);
            }

            setNewAttribute(""); 
            setNewAttributeValue(""); // Reset attribute value
            setShowForm(false); // Hide the form after submission
            setEditingAttribute(null); // Clear editing state
        } catch (err) {
            setError(`Failed to ${editingAttribute ? "update" : "add"} attribute`);
        }
    };

    // Handle Delete Action
    const handleDeleteAttribute = async (attributeId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}product/attribute/delete/${attributeId}/values/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete attribute");
            }

            // Remove deleted attribute from the list
            setAttributes(attributes.filter((attr) => attr.id !== attributeId));
        } catch (err) {
            setError("Failed to delete attribute");
        }
    };

    // Handle Edit Action
    const handleEditAttribute = (attribute) => {
        setEditingAttribute(attribute); // Set the current attribute being edited
        setNewAttribute(attribute.name); // Pre-fill the input with the current name
        setNewAttributeValue(attribute.value); // Pre-fill the value
        setShowForm(true); // Show the form to edit
    };

    document.title = "Basic Tables | Skote - Vite React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Tables" breadcrumbItem="Basic Tables" />

                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4">Product Attribute values</CardTitle>
                                    {loading ? (
                                        <p>Loading...</p>
                                    ) : error ? (
                                        <p className="text-danger">Error: {error}</p>
                                    ) : (
                                        <div className="table-responsive">
                                            <Table className="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Attribute Name</th>
                                                        <th>Attribute Value</th>
                                                        <th>Update</th>
                                                        <th>Delete</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {attributes && attributes.length > 0 ? ( // Safe check before accessing .length
                                                        attributes.map((attribute, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{attribute.attribute || "Unnamed Attribute"}</td>
                                                                <td>{attribute.value || "Unnamed value"}</td>

                                                                <td>
                                                                    <Button
                                                                        color="info"
                                                                        onClick={() => handleEditAttribute(attribute)}
                                                                        className="me-2"
                                                                    >
                                                                        <FaEdit /> {/* Edit Icon */}
                                                                    </Button>
                                                                </td>
                                                                <td>
                                                                <Button
                                                                        color="danger"
                                                                        onClick={() => handleDeleteAttribute(attribute.id)}
                                                                    >
                                                                        <FaTrashAlt /> {/* Delete Icon */}
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="3" className="text-center">
                                                                No attributes available
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    )}

                                    {/* Add/Update Attribute Button */}
                                    <Button color="primary" onClick={() => setShowForm(!showForm)} className="mt-4">
                                        {showForm ? "Cancel" : editingAttribute ? "Edit Attribute" : "Add Attribute"}
                                    </Button>

                                    {/* Show Add/Update Attribute Form */}
                                    {showForm && (
                                        <Form onSubmit={handleAddOrUpdateAttribute} className="mt-4">
                                            <FormGroup>
                                                <Label for="attributeName">Attribute Name</Label>
                                                <Input
                                                    type="text"
                                                    id="attributeName"
                                                    value={newAttribute}
                                                    onChange={(e) => setNewAttribute(e.target.value)}
                                                    placeholder="Enter attribute name"
                                                    required
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="attributeValue">Attribute Value</Label>
                                                <Input
                                                    type="select"
                                                    id="attributeValue"
                                                    value={newAttributeValue}
                                                    onChange={(e) => setNewAttributeValue(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select an Attribute Value</option>
                                                    {availableAttributes && availableAttributes.length > 0 ? ( // Safe check for availableAttributes
                                                        availableAttributes.map((option) => (
                                                            <option key={option.id} value={option.id}>
                                                                {option.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option disabled>No options available</option>
                                                    )}
                                                </Input>
                                            </FormGroup>
                                            <Button type="submit" color="success">
                                                {editingAttribute ? "Update Attribute" : "Add Attribute"}
                                            </Button>
                                        </Form>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
};

export default BasicTable;
