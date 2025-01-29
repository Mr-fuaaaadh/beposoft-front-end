import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row, CardBody, CardTitle, Label, Form, Input, FormFeedback,Alert  } from "reactstrap";
import * as Yup from 'yup';
import { useFormik } from "formik";
import axios from 'axios'; // Ensure axios is imported

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const FormLayouts = () => {
    document.title = "Form Layouts | Skote - Vite React Admin & Dashboard Template";

    const [family, setFamily] = useState([]);
    const [successMessage, setSuccessMessage] = useState(""); // State for success message
    const [errorMessage, setErrorMessage] = useState(""); 
    const [warehouseDetails, setWarehouseDetails] = useState([]);
    const token = localStorage.getItem('token');

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

    const TYPES = [
        { value: 'single', label: 'Single' },
        { value: 'variant', label: 'Variant' },
    ];

    const formik = useFormik({
        initialValues: {
            name: "",
            hsn_code: "",
            purchase_rate: "",
            tax: "",
            family: [], // Now an array for multiple selections
            unit: "",
            selling_price: "",
            product_type: "",
            groupID: "",
            stock:"",
            check: false,
            warehouse:"",
            retail_price: "",
            landing_cost: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("This field is required"),
            hsn_code: Yup.string().required("This field is required"),
            purchase_rate: Yup.string().required("This field is required"),
            tax: Yup.string().required("This field is required"),
            family: Yup.array().min(1, "At least one family is required").required("This field is required"), // Updated validation for multiple selection
            unit: Yup.string().required("This field is required"),
            selling_price: Yup.string().required("This field is required"),
            product_type: Yup.string().required("This field is required"),
            groupID: Yup.string().required("This field is required"),
            stock : Yup.string().required("This field is required"),
            check: Yup.bool().oneOf([true], "You must accept the terms"),
            warehouse: Yup.string().required("This field is required"),
        }),
        onSubmit: async (values) => {

            console.log("form field valies...:", values);
            try {
                // Post the form data using axios
                const response = await axios.post(`${import.meta.env.VITE_APP_KEY}add/product/`, values, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                setSuccessMessage("Form submitted successfully!");
                setErrorMessage(""); 
                console.log('Form submitted successfully:', response.data);
            } catch (error) {
                // Handle error
                setErrorMessage("Error submitting form. Please try again.");
                setSuccessMessage(""); 
                console.error('Error submitting form:', error); st
                console.error('Error submitting form:', error);
            }
        }
    });

    useEffect(() => {
        const fetchProductFamilies = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_KEY}familys/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setFamily(response.data.data);
                console.log(response.data.data)
            } catch (error) {
                console.error('Error fetching product families:', error);
            }
        };

        fetchProductFamilies();
    }, [token]);

    useEffect(() => {
        const fetchwarehosue = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_KEY}warehouse/add/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setWarehouseDetails(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching warehosue:', error);
            }
        };

        fetchwarehosue();
    }, [token]);

    useEffect(() => {
        const { purchase_rate, tax } = formik.values;
        const rate = parseFloat(purchase_rate) || 0;
        const taxValue = parseFloat(tax) || 0;
        const calculatedLandingCost = rate + (rate * taxValue / 100);
        formik.setFieldValue("landing_cost", calculatedLandingCost.toFixed(2)); 
    }, [formik.values.purchase_rate, formik.values.tax]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Forms" breadcrumbItem="Form Layouts" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4">Form Grid Layout</CardTitle>

                                    {/* Show success or error messages */}
                                    {successMessage && <Alert color="success">{successMessage}</Alert>}
                                    {errorMessage && <Alert color="danger">{errorMessage}</Alert>}

                                    <Form onSubmit={formik.handleSubmit}>
                                        <div className="mb-3">
                                            <Label htmlFor="formrow-name-Input">Name</Label>
                                            <Input
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                id="formrow-name-Input"
                                                placeholder="Enter Name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.name && formik.errors.name}
                                            />
                                            {formik.errors.name && formik.touched.name && (
                                                <FormFeedback>{formik.errors.name}</FormFeedback>
                                            )}
                                        </div>

                                        <Row>
                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-hsn_code-Input">HSN CODE</Label>
                                                    <Input
                                                        type="text"
                                                        name="hsn_code"
                                                        className="form-control"
                                                        id="formrow-hsn_code-Input"
                                                        placeholder="Enter HSN CODE"
                                                        value={formik.values.hsn_code}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.hsn_code && formik.errors.hsn_code}
                                                    />
                                                    {formik.errors.hsn_code && formik.touched.hsn_code && (
                                                        <FormFeedback>{formik.errors.hsn_code}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-purchase_rate-Input">PURCHASE RATE</Label>
                                                    <Input
                                                        type="text"
                                                        name="purchase_rate"
                                                        className="form-control"
                                                        id="formrow-purchase_rate-Input"
                                                        placeholder="Enter purchase rate"
                                                        value={formik.values.purchase_rate}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.purchase_rate && formik.errors.purchase_rate}
                                                    />
                                                    {formik.errors.purchase_rate && formik.touched.purchase_rate && (
                                                        <FormFeedback>{formik.errors.purchase_rate}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>

                                            <Col lg={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-tax-Input">Tax</Label>
                                                    <Input
                                                        type="text"
                                                        name="tax"
                                                        className="form-control"
                                                        id="formrow-tax-Input"
                                                        placeholder="Enter tax"
                                                        value={formik.values.tax}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.tax && formik.errors.tax}
                                                    />
                                                    {formik.errors.tax && formik.touched.tax && (
                                                        <FormFeedback>{formik.errors.tax}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>

                                         
                                        </Row>

                                        <Row>
                                        <Col lg={3}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-selling_price-Input">landing cost</Label>
                                                    <Input
                                                        type="text"
                                                        name="landing_cost"
                                                        className="form-control"
                                                        id="formrow-selling_price-Input"
                                                        value={formik.values.landing_cost}
                                                        invalid={formik.touched.landing_cost && formik.errors.landing_cost}
                                                    />
                                                    {formik.errors.landing_cost && formik.touched.landing_cost && (
                                                        <FormFeedback>{formik.errors.landing_cost}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>  
                                   
                                            <Col md={3}>
                                            <div className="mb-3">
                                                    <Label htmlFor="formrow-unit-Input">choose warehouse</Label>
                                                    <select
                                                        name="warehouse"
                                                        id="formrow-unit-Input"
                                                        className="form-control"
                                                        value={formik.values.warehouse}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.warehouse && formik.errors.warehouse}
                                                    >
                                                        <option value="">Choose...</option>
                                                        {warehouseDetails.map((unit) => (
                                                            <option key={unit.id} value={unit.id}>{unit.name}</option>
                                                        ))}
                                                    </select>
                                                    {formik.errors.unit && formik.touched.unit && (
                                                        <FormFeedback>{formik.errors.unit}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col lg={3}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-family-Input">Family</Label>
                                                    <select
                                                        name="family"
                                                        id="formrow-family-Input"
                                                        className="form-control"
                                                        value={formik.values.family}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        multiple
                                                        invalid={formik.touched.family && formik.errors.family}
                                                    >
                                                        <option value="">Choose...</option>
                                                        {family.map((item) => (
                                                            <option key={item.id} value={item.id}>{item.name}</option>
                                                        ))}
                                                    </select>
                                                    {formik.errors.family && formik.touched.family && (
                                                        <FormFeedback>{formik.errors.family}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col lg={3}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-unit-Input">Unit</Label>
                                                    <select
                                                        name="unit"
                                                        id="formrow-unit-Input"
                                                        className="form-control"
                                                        value={formik.values.unit}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.unit && formik.errors.unit}
                                                    >
                                                        <option value="">Choose...</option>
                                                        {UNIT_TYPES.map((unit) => (
                                                            <option key={unit.value} value={unit.value}>{unit.label}</option>
                                                        ))}
                                                    </select>
                                                    {formik.errors.unit && formik.touched.unit && (
                                                        <FormFeedback>{formik.errors.unit}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col lg={3}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-selling_price-Input">Wholesale Rate</Label>
                                                    <Input
                                                        type="text"
                                                        name="selling_price"
                                                        className="form-control"
                                                        id="formrow-selling_price-Input"
                                                        placeholder="Enter Wholesale Rate"
                                                        value={formik.values.selling_price}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.selling_price && formik.errors.selling_price}
                                                    />
                                                    {formik.errors.selling_price && formik.touched.selling_price && (
                                                        <FormFeedback>{formik.errors.selling_price}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col lg={3}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-selling_price-Input">retail Rate</Label>
                                                    <Input
                                                        type="text"
                                                        name="retail_price"
                                                        className="form-control"
                                                        id="formrow-selling_price-Input"
                                                        placeholder="Enter Retail Rate"
                                                        value={formik.values.retail_price}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.retail_price && formik.errors.retail_price}
                                                    />
                                                    {formik.errors.selling_price && formik.touched.selling_price && (
                                                        <FormFeedback>{formik.errors.retail_price}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col lg={2}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-product_type-Input">Product Type</Label>
                                                    <select
                                                        name="product_type"
                                                        id="formrow-product_type-Input"
                                                        className="form-control"
                                                        value={formik.values.product_type}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.product_type && formik.errors.product_type}
                                                    >
                                                        <option value="">Choose...</option>
                                                        {TYPES.map((type) => (
                                                            <option key={type.value} value={type.value}>{type.label}</option>
                                                        ))}
                                                    </select>
                                                    {formik.errors.product_type && formik.touched.product_type && (
                                                        <FormFeedback>{formik.errors.product_type}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col lg={2}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-groupID-Input">Group ID</Label>
                                                    <Input
                                                        type="text"
                                                        name="groupID"
                                                        className="form-control"
                                                        id="formrow-groupID-Input"
                                                        placeholder="Enter group ID"
                                                        value={formik.values.groupID}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.groupID && formik.errors.groupID}
                                                    />
                                                    {formik.errors.groupID && formik.touched.groupID && (
                                                        <FormFeedback>{formik.errors.groupID}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col lg={2}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-groupID-Input">Stock</Label>
                                                    <Input
                                                        type="text"
                                                        name="stock"
                                                        className="form-control"
                                                        id="formrow-stock-Input"
                                                        placeholder="Enter stock"
                                                        value={formik.values.stock}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.stock && formik.errors.stock}
                                                    />
                                                    {formik.errors.stock && formik.touched.stock && (
                                                        <FormFeedback>{formik.errors.stock}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="mb-3">
                                            <div className="form-check">
                                                <Input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="formrow-check"
                                                    name="check"
                                                    value={formik.values.check}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    invalid={formik.touched.check && formik.errors.check}
                                                />
                                                <Label className="form-check-label" htmlFor="formrow-check">
                                                    Check me out
                                                </Label>
                                            </div>
                                            {formik.errors.check && formik.touched.check && (
                                                <FormFeedback>{formik.errors.check}</FormFeedback>
                                            )}
                                        </div>
                                        <button type="submit" className="btn btn-primary w-md">
                                            Submit
                                        </button>
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

export default FormLayouts;
