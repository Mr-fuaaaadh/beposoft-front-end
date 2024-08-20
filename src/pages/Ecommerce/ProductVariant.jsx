import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Card, Col, Container, Row, CardBody, CardTitle, Label, Form, Input, Button, FormFeedback, FormGroup } from 'reactstrap';
import { FaPlus, FaTrashAlt, FaBox, FaUser } from 'react-icons/fa';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from 'react-select';

const VariantProductCreateForm = () => {
    const [products, setProducts] = useState([]);
    const [attributeOptions, setAttributeOptions] = useState({
        names: [],
        ids: [],
        values: {}
    });
    const [formData, setFormData] = useState({
        product: '',
        attributes: [],
        managedUsers: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}products/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }

                const data = await response.json();
                const products = Array.isArray(data) ? data : data.data || [];
                setProducts(products);
            } catch (err) {
                setError(err.message || "An error occurred while fetching products");
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}product/attributes/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    const attributeNames = data.map(attr => attr.name);
                    const attributeIds = data.map(attr => attr.id);

                    setAttributeOptions({
                        names: attributeNames,
                        ids: attributeIds,
                        values: {}
                    });
                } else {
                    throw new Error("Unexpected data structure while fetching attributes");
                }
            } catch (err) {
                setError(err.message || "An error occurred while fetching attributes");
            }
        };

        fetchAttributes();
    }, []);

    const fetchAttributeValues = useCallback(async (attributeId, attributeName) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}product/attribute/${attributeId}/values/`, {
                method: 'GET',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                setAttributeOptions(prevOptions => ({
                    ...prevOptions,
                    values: {
                        ...prevOptions.values,
                        [attributeName]: data.map(item => ({ value: item.value, label: item.value })) // Convert to { value, label } format
                    }
                }));
            } else {
                throw new Error("Unexpected data structure while fetching attribute values");
            }
        } catch (err) {
            console.error("Failed to fetch attribute values:", err);
            setError(err.message || "An error occurred while fetching attribute values");
        }
    }, []);

    const handleAttributeNameChange = async (index, selectedOption) => {
        const selectedAttributeName = selectedOption ? selectedOption.value : '';
        const attributeIndex = attributeOptions.names.indexOf(selectedAttributeName);
        const selectedAttributeId = attributeOptions.ids[attributeIndex];

        if (!selectedAttributeId) return; // Avoid unnecessary fetch if no valid attribute ID

        const newAttributes = [...formData.attributes];
        newAttributes[index] = {
            ...newAttributes[index],
            attribute: selectedAttributeName,
            values: [] // Reset values
        };
        setFormData(prevData => ({ ...prevData, attributes: newAttributes }));

        try {
            await fetchAttributeValues(selectedAttributeId, selectedAttributeName);
        } catch (err) {
            console.error("Failed to fetch attribute values:", err);
        }
    };

    const handleAttributeValueChange = (index, selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        const newAttributes = [...formData.attributes];
        newAttributes[index] = {
            ...newAttributes[index],
            values: selectedValues
        };
        setFormData(prevData => ({ ...prevData, attributes: newAttributes }));
    };

    const addAttribute = () => {
        setFormData(prevData => ({
            ...prevData,
            attributes: [...prevData.attributes, { attribute: '', values: [] }]
        }));
    };

    const removeAttribute = (index) => {
        setFormData(prevData => ({
            ...prevData,
            attributes: prevData.attributes.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_APP_APIKEY}add/product/variant/`, formData, {
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Variant products added successfully');
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message || "An error occurred while submitting");
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Ecommerce" breadcrumbItem="Product Management" />

                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4">Create Variant Products</CardTitle>

                                    <Form onSubmit={handleSubmit}>
                                        <FormGroup className="mb-3">
                                            <Label for="managedUsers">
                                                <FaUser className="me-2" /> Managed Users
                                            </Label>
                                            <Input
                                                type="text"
                                                id="managedUsers"
                                                name="managedUsers"
                                                value={formData.managedUsers}
                                                onChange={(e) => setFormData(prevData => ({ ...prevData, managedUsers: e.target.value }))}
                                                placeholder="e.g., User1, User2 (comma separated)"
                                            />
                                        </FormGroup>

                                        <FormGroup className="mb-3">
                                            <Label for="product">
                                                <FaBox className="me-2" /> Product
                                            </Label>
                                            <Input
                                                type="select"
                                                id="product"
                                                name="product"
                                                value={formData.product}
                                                onChange={(e) => setFormData(prevData => ({ ...prevData, product: e.target.value }))}
                                            >
                                                <option value="">Select a product</option>
                                                {products.map(product => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>

                                        {formData.attributes.map((attr, index) => (
                                            <FormGroup key={index} className="mb-3">
                                                <Row form className="align-items-center">
                                                    <Col md={5}>
                                                        <Label for={`attribute-${index}`}>Attribute Name</Label>
                                                        <Select
                                                            id={`attribute-${index}`}
                                                            value={attr.attribute ? { value: attr.attribute, label: attr.attribute } : null}
                                                            onChange={(option) => handleAttributeNameChange(index, option)}
                                                            options={attributeOptions.names.map(name => ({ value: name, label: name }))}
                                                            placeholder="Select an attribute"
                                                        />
                                                    </Col>
                                                    <Col md={5}>
                                                        <Label for={`value-${index}`}>Attribute Values</Label>
                                                        <Select
                                                            id={`value-${index}`}
                                                            isMulti
                                                            value={attr.values.map(value => ({ value, label: value }))}
                                                            onChange={(options) => handleAttributeValueChange(index, options)}
                                                            options={attr.attribute && attributeOptions.values[attr.attribute] ? attributeOptions.values[attr.attribute] : []}
                                                            placeholder="Select values"
                                                            isDisabled={!attr.attribute}
                                                        />
                                                    </Col>

                                                    <Col md={2} className="d-flex align-items-center">
                                                        <Button
                                                            color="danger"
                                                            onClick={() => removeAttribute(index)}
                                                            outline
                                                            className="w-100 w-sm-auto"
                                                        >
                                                            <FaTrashAlt /> Remove
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                        ))}

                                        <Button type="button" color="primary" onClick={addAttribute} className="mb-3" outline>
                                            <FaPlus /> Add Attribute
                                        </Button>

                                        <div className="d-flex justify-content-start">
                                            <Button type="submit" color="success">Submit</Button>
                                        </div>

                                        {error && (
                                            <div className="mt-3">
                                                <FormFeedback type="invalid">{error}</FormFeedback>
                                            </div>
                                        )}
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

export default VariantProductCreateForm;
