import React, { useState } from "react";
import { Card, Col, Container, Row, CardBody, CardTitle, Label, Form, Input, FormFeedback } from "reactstrap";
import * as Yup from 'yup';
import { useFormik } from "formik";
// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";


const FormLayouts = () => {
    // Meta title
    document.title = "Form Layouts | Skote - Vite React Admin & Dashboard Template";

    // Retrieve the created_user value from local storage
    const created_user = localStorage.getItem('name') || '';
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Formik setup
    const formik = useFormik({
        initialValues: {
            name: "",
            account_number: "",
            ifsc_code: "",
            branch: "",
            state: "",
            open_balance: "",
            check: false,
            created_user: created_user,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("This field is required"),
            account_number: Yup.string().required("This field is required"),
            ifsc_code: Yup.string().required("This field is required"),
            state: Yup.string().required("This field is required"),
            open_balance: Yup.string().required("This field is required"),
            check: Yup.boolean().oneOf([true], "You must accept the terms"),
        }),
        onSubmit: async (values) => {
            console.log("Form values:", values);

            setSuccessMessage("");
            setErrorMessage("");

            const token = localStorage.getItem('token');
            console.log("token data...:", token);
            if (!token) {
                setErrorMessage("Authorization token is missing. Please log in.");
                return;
            }


            console.log("token",token);

            const apiBaseUrl = import.meta.env.VITE_APP_APIKEY;

            console.log('dnsddjbsdjbd',apiBaseUrl);
    
            if (!apiBaseUrl) {
                setErrorMessage("API base URL is not configured.");
                return;
            }

            try {
                const response = await fetch(`${apiBaseUrl}add/bank/`,{
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                console.log("response info", response);

                if (response.ok) {
                    const data = await response.json();
                    setSuccessMessage("Form submitted successfully!");
                    console.log("Form submission response:", data);
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || "Server responded with an error.");
                    console.error("Server error:", errorData);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        },
        
    });


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

                                    {/* Success and Error Messages */}
                                    {successMessage && (
                                        <div className="alert alert-success" role="alert">
                                            {successMessage}
                                        </div>
                                    )}
                                    {errorMessage && (
                                        <div className="alert alert-danger" role="alert">
                                            {errorMessage}
                                        </div>
                                    )}

                                    <Form onSubmit={formik.handleSubmit}>
                                        <div className="mb-3">
                                            <Label htmlFor="formrow-name-Input">Name</Label>
                                            <Input
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                id="formrow-name-Input"
                                                placeholder="Enter Your First Name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.name && formik.errors.name ? true : false}
                                            />
                                            {formik.touched.name && formik.errors.name && (
                                                <FormFeedback>{formik.errors.name}</FormFeedback>
                                            )}
                                        </div>

                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-account-Input">Account Number</Label>
                                                    <Input
                                                        type="text"
                                                        name="account_number"
                                                        className="form-control"
                                                        id="formrow-account-Input"
                                                        placeholder="Enter Your Account Number"
                                                        value={formik.values.account_number}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.account_number && formik.errors.account_number ? true : false}
                                                    />
                                                    {formik.touched.account_number && formik.errors.account_number && (
                                                        <FormFeedback>{formik.errors.account_number}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-ifsc-Input">IFSC Code</Label>
                                                    <Input
                                                        type="text"
                                                        name="ifsc_code"
                                                        className="form-control"
                                                        id="formrow-ifsc-Input"
                                                        placeholder="Enter Your IFSC Code"
                                                        value={formik.values.ifsc_code}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.ifsc_code && formik.errors.ifsc_code ? true : false}
                                                    />
                                                    {formik.touched.ifsc_code && formik.errors.ifsc_code && (
                                                        <FormFeedback>{formik.errors.ifsc_code}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col lg={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-branch-Input">Branch</Label>
                                                    <Input
                                                        type="text"
                                                        name="branch"
                                                        className="form-control"
                                                        id="formrow-branch-Input"
                                                        placeholder="Enter Your Branch"
                                                        value={formik.values.branch}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.branch && formik.errors.branch ? true : false}
                                                    />
                                                    {formik.touched.branch && formik.errors.branch && (
                                                        <FormFeedback>{formik.errors.branch}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>

                                            <Col lg={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-open_balance-Input">Opening Balance</Label>
                                                    <Input
                                                        type="text"
                                                        name="open_balance"
                                                        className="form-control"
                                                        id="formrow-open_balance-Input"
                                                        placeholder="Enter Your Opening Balance"
                                                        value={formik.values.open_balance}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.open_balance && formik.errors.open_balance ? true : false}
                                                    />
                                                    {formik.touched.open_balance && formik.errors.open_balance && (
                                                        <FormFeedback>{formik.errors.open_balance}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>

                                            <Col lg={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-created_user-Input">Created User</Label>
                                                    <Input
                                                        type="text"
                                                        name="created_user"
                                                        className="form-control"
                                                        id="formrow-created_user-Input"
                                                        value={formik.values.created_user}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="mb-3 form-check">
                                            <Input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="formrow-check"
                                                name="check"
                                                checked={formik.values.check}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.check && formik.errors.check ? true : false}
                                            />
                                            <Label className="form-check-label" htmlFor="formrow-check">
                                                Check me out
                                            </Label>
                                            {formik.touched.check && formik.errors.check && (
                                                <FormFeedback>{formik.errors.check}</FormFeedback>
                                            )}
                                        </div>
                                        <div>
                                            <button type="submit" className="btn btn-primary w-md">
                                                Submit
                                            </button>
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
};

export default FormLayouts;
