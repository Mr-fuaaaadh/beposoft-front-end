import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardTitle, Col, Container, Form, Input, Label, Row, FormFeedback } from "reactstrap";
import Dropzone from "react-dropzone";
import * as yup from "yup";
import { useFormik } from "formik";
import Select from "react-select";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useParams } from 'react-router-dom';

const EcommerenceAddProduct = () => {
    document.title = "Add Product | Skote - Vite React Admin & Dashboard Template";

    const { id } = useParams(); // Get the id from the URL params
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [productFamilies, setProductFamilies] = useState([]);
    const [imagePreview, setImagePreview] = useState(""); // State for image preview
    const token = localStorage.getItem('token');

    console.log(`getd id ${id}`);

    const types = [
        { value: 'single', label: 'single' },
        { value: 'variant', label: 'variant' },
    ];

    const formik = useFormik({
        initialValues: {
            name: '',
            hsn_code: '',
            family: [],
            purchase_rate: '',
            type: '',
            tax: '',
            unit: "",
            selling_price: '',
            image: null // Add image field
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Please Enter Your Product Name'),
            hsn_code: yup.string().required('Please Enter Your Manufacturer Name'),
            family: yup.array().min(1, 'Please select at least one Feature'),
            purchase_rate: yup.number().required('Please Enter Your purchase_rate'),
            type: yup.string().required('Please Enter Your type'),
            tax: yup.string().required('Please Enter Your Product Tax'),
            unit: yup.string().required('Please Enter Your Product unit'),
            selling_price: yup.string().required('Please Enter Your selling_price'),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            for (const key in values) {
                formData.append(key, values[key]);
            }
            if (selectedFiles.length > 0) {
                formData.append('image', selectedFiles[0]);
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_APP_APIKEY}product/update/${id}/`, // Include the id in the URL
                    {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Error updating product');
                }
                console.log('Product updated successfully:', data);
                formik.resetForm();
                setImagePreview(""); // Reset image preview
            } catch (error) {
                console.error('Error updating product:', error);
            }
        },
    });

    const UNIT_TYPES = [
        { value: 'NOS', label: 'NOS' },
        { value: 'PRS', label: 'PRS' },
        { value: 'BOX', label: 'BOX' },
        { value: 'SET', label: 'SET' },
        { value: 'SET OF 12', label: 'SET OF 12' },
        { value: 'SET OF 16', label: 'SET OF 16' },
        { value: 'SET OF 6', label: 'SET OF 6' },
        { value: 'SET OF 8', label: 'SET OF 8' },
    ];

    useEffect(() => {
        const fetchProductFamilies = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}familys/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setProductFamilies(data.data);
                } else {
                    console.error('Error fetching product families:', data.message);
                }
            } catch (error) {
                console.error('Error fetching product families:', error);
            }
        };

        const fetchProductData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}product/update/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const productData = await response.json();
                console.log("Fetched product data:", productData);

                if (response.ok && productData) {
                    formik.setValues({
                        name: productData.data.name || '',
                        hsn_code: productData.data.hsn_code || '',
                        family: productData.data.family.map(family => family.id) || [],
                        purchase_rate: productData.data.purchase_rate || '',
                        type: productData.data.type || '',
                        tax: productData.data.tax || '',
                        unit: productData.data.unit || '',
                        selling_price: productData.data.selling_price || '',
                    });
                    if (productData.data.image) {
                        setImagePreview(productData.data.image); // Set initial image preview if available
                    }
                } else {
                    console.error('Error fetching product data:', productData.message);
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchProductFamilies();
        fetchProductData(); // Fetch product data when the component mounts
    }, [token, id]); // Include token and id in the dependency array

    const handleAcceptedFiles = (files) => {
        const file = files[0];
        setSelectedFiles(files);
        setImagePreview(URL.createObjectURL(file)); // Set image preview
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Ecommerce" breadcrumbItem="Add Product" />

                    <Row>
                        <Col xs="12">
                            <Card>
                                <CardBody>
                                    <CardTitle tag="h4">Basic Information</CardTitle>
                                    <p className="card-title-desc mb-4">
                                        Fill all information below
                                    </p>

                                    <Form onSubmit={formik.handleSubmit} autoComplete="off">
                                        <Row>
                                            <Col sm="6">
                                                <div className="mb-3">
                                                    <Label htmlFor="name">Product Name</Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        placeholder="Product Name"
                                                        value={formik.values.name}
                                                        onChange={formik.handleChange}
                                                        invalid={formik.touched.name && formik.errors.name ? true : false}
                                                    />
                                                    {formik.errors.name && formik.touched.name ? (
                                                        <FormFeedback type="invalid">{formik.errors.name}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="hsn_code">HSN CODE</Label>
                                                    <Input
                                                        id="hsn_code"
                                                        name="hsn_code"
                                                        type="text"
                                                        placeholder="HSN CODE"
                                                        value={formik.values.hsn_code}
                                                        onChange={formik.handleChange}
                                                        invalid={formik.touched.hsn_code && formik.errors.hsn_code ? true : false}
                                                    />
                                                    {formik.errors.hsn_code && formik.touched.hsn_code ? (
                                                        <FormFeedback type="invalid">{formik.errors.hsn_code}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="purchase_rate">Purchase Rate</Label>
                                                    <Input
                                                        id="purchase_rate"
                                                        name="purchase_rate"
                                                        type="number"
                                                        placeholder="Purchase Rate"
                                                        value={formik.values.purchase_rate}
                                                        onChange={formik.handleChange}
                                                        invalid={formik.touched.purchase_rate && formik.errors.purchase_rate ? true : false}
                                                    />
                                                    {formik.errors.purchase_rate && formik.touched.purchase_rate ? (
                                                        <FormFeedback type="invalid">{formik.errors.purchase_rate}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="tax">Tax</Label>
                                                    <Input
                                                        id="tax"
                                                        name="tax"
                                                        type="number"
                                                        placeholder="Tax"
                                                        value={formik.values.tax}
                                                        onChange={formik.handleChange}
                                                        invalid={formik.touched.tax && formik.errors.tax ? true : false}
                                                    />
                                                    {formik.errors.tax && formik.touched.tax ? (
                                                        <FormFeedback type="invalid">{formik.errors.tax}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>

                                            <Col sm="6">
                                                <div className="mb-3">
                                                    <div className="control-label" style={{ marginBottom: "0.5rem" }}>Unit Type</div>
                                                    <Select
                                                        name="unit"
                                                        options={UNIT_TYPES}
                                                        className="select2"
                                                        value={UNIT_TYPES.find((option) => option.value === formik.values.unit)}
                                                        onChange={(selectedOption) => formik.setFieldValue("unit", selectedOption.value)}
                                                    />
                                                    {formik.errors.unit && formik.touched.unit ? (
                                                        <span className="text-danger">{formik.errors.unit}</span>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <div className="control-label" style={{ marginBottom: "0.5rem" }}>Product Type</div>
                                                    <Select
                                                        name="type"
                                                        options={types}
                                                        className="select2"
                                                        value={types.find((option) => option.value === formik.values.type)}
                                                        onChange={(selectedOption) => formik.setFieldValue("type", selectedOption.value)}
                                                    />
                                                    {formik.errors.type && formik.touched.type ? (
                                                        <span className="text-danger">{formik.errors.type}</span>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <div className="control-label" style={{ marginBottom: "0.5rem" }}>Product Family</div>
                                                    <Select
                                                        classNamePrefix="select2-selection"
                                                        name="family"
                                                        placeholder="Choose..."
                                                        options={productFamilies.map(family => ({
                                                            value: family.id,
                                                            label: family.name
                                                        }))}
                                                        isMulti
                                                        value={productFamilies.filter(family =>
                                                            formik.values.family.includes(family.id)
                                                        ).map(family => ({
                                                            value: family.id,
                                                            label: family.name
                                                        }))}
                                                        onChange={selectedOptions =>
                                                            formik.setFieldValue(
                                                                "family",
                                                                selectedOptions.map(option => option.value)
                                                            )
                                                        }
                                                    />
                                                    {formik.errors.family && formik.touched.family ? (
                                                        <span className="text-danger">{formik.errors.family}</span>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="selling_price">Selling Price</Label>
                                                    <Input
                                                        id="selling_price"
                                                        name="selling_price"
                                                        type="number"
                                                        placeholder="Selling Price"
                                                        value={formik.values.selling_price}
                                                        onChange={formik.handleChange}
                                                        invalid={formik.touched.selling_price && formik.errors.selling_price ? true : false}
                                                    />
                                                    {formik.errors.selling_price && formik.touched.selling_price ? (
                                                        <FormFeedback type="invalid">{formik.errors.selling_price}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                {/* Image Upload and Preview */}
                                                <div className="mb-3">
                                                    <Label htmlFor="image">Product Image</Label>
                                                    <Dropzone onDrop={acceptedFiles => handleAcceptedFiles(acceptedFiles)}>
                                                        {({ getRootProps, getInputProps }) => (
                                                            <div {...getRootProps({ className: 'dropzone' })}>
                                                                <input {...getInputProps()} />
                                                                <p>Drag 'n' drop some files here, or click to select files</p>
                                                            </div>
                                                        )}
                                                    </Dropzone>
                                                    {imagePreview && (
                                                        <div className="image-preview">
                                                            <img src={imagePreview} alt="Preview" />
                                                        </div>
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="d-flex flex-wrap gap-2">
                                            <Button type="submit" color="primary">Save Changes</Button>
                                            <Button type="button" color="secondary" onClick={() => formik.resetForm()}>Cancel</Button>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default EcommerenceAddProduct;
