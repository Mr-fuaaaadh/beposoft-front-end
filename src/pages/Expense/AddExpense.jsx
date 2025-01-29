import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row, CardBody, CardTitle, Label, Form, Input, FormFeedback } from "reactstrap";
import * as Yup from 'yup';
import { useFormik } from "formik";
import axios from "axios";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const FormLayouts = () => {
    document.title = "Form Layouts | Skote - Vite React Admin & Dashboard Template";
    const token = localStorage.getItem('token');

    const [companies, setCompanies] = useState([]);
    const [banks, setBanks] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [payment, setPayment] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch company data
                const companyResponse = await axios.get(`${import.meta.env.VITE_APP_KEY}company/data/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCompanies(companyResponse.data.data);

                // Fetch bank data
                const bankResponse = await axios.get(`${import.meta.env.VITE_APP_KEY}banks/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setBanks(bankResponse.data.data);

                // Fetch staff data
                const staffResponse = await axios.get(`${import.meta.env.VITE_APP_KEY}staffs/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setStaffs(staffResponse.data.data);


            } catch (error) {
                console.error("Error fetching data:", error);
                alert("An error occurred while fetching the data.");
            }
        };

        fetchData();
    }, [token]);

    const  purposeofPayment = [
        { 
            value: "water",
            label: "Water",
        },
        { 
            value: "electricity",
            label: "Electricity",
        },
        { 
            value: "salary",
            label: "Salary",
        },
        { 
            value: "emi",
            label: "EMI",
        },
        { 
            value: "rent",
            label: "Rent",
        },
        { 
            value: "equipments",
            label: "Equipments",
        },
        { 
            value: "travel",
            label: "Travel",
        },
        { 
            value: "other",
            label: "Others",
        }
    ]

    const formik = useFormik({
        initialValues: {
            company: "",
            payed_by: "",
            bank: "",
            purpose_of_payment: "",
            amount: "",
            expense_date: new Date().toISOString().split('T')[0],
            transaction_id: "",
            description: "",
            added_by: "",
            check: "",
        },
        validationSchema: Yup.object({
            company: Yup.string().required("This field is required"),
            payed_by: Yup.string().required("This field is required"),
            bank: Yup.string().required("This field is required"),
            purpose_of_payment: Yup.string().required("This field is required"),
            amount: Yup.string().required("This field is required"),
            expense_date: Yup.string().required("This field is required"),
            transaction_id: Yup.string().required("This field is required"),
            description: Yup.string().required("This field is required"),
            added_by: Yup.string().required("This field is required"),
            check: Yup.string().required("This field is required"),
        }),

        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_APP_KEY}expense/add/`,
                    values,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                setSuccessMessage("Form submitted successfully!");
                setErrorMessage('');
                resetForm();
            } catch (error) {
                console.error("Error submitting form:", error);
                setErrorMessage("An error occurred while submitting the form.");
                setSuccessMessage('');
            }
        }
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

                                    <Form onSubmit={formik.handleSubmit}>
                                        <div className="mb-3">
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
                                        </div>

                                        <Row>
                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-company-Input">Company</Label>
                                                    <Input
                                                        type="select"
                                                        name="company"
                                                        className="form-control"
                                                        id="formrow-company-Input"
                                                        value={formik.values.company}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.company && formik.errors.company ? true : false}
                                                    >
                                                        <option value="" label="Select Your Company" />
                                                        {companies.map((company) => (
                                                            <option key={company.id} value={company.id} label={company.name} />
                                                        ))}
                                                    </Input>
                                                    {formik.errors.company && formik.touched.company ? (
                                                        <FormFeedback type="invalid">{formik.errors.company}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>

                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-payed_by-Input">Payed By</Label>
                                                    <Input
                                                        type="select"
                                                        name="payed_by"
                                                        className="form-control"
                                                        id="formrow-payed_by-Input"
                                                        value={formik.values.payed_by}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.payed_by && formik.errors.payed_by ? true : false}
                                                    >
                                                        <option value="" label="Payed by " />
                                                        {staffs.map((staff) => (
                                                            <option key={staff.id} value={staff.id} label={staff.name} />
                                                        ))}
                                                    </Input>
                                                    {formik.errors.payed_by && formik.touched.payed_by ? (
                                                        <FormFeedback type="invalid">{formik.errors.payed_by}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>

                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-bank-Input">Bank</Label>
                                                    <Input
                                                        type="select"
                                                        name="bank"
                                                        className="form-control"
                                                        id="formrow-bank-Input"
                                                        value={formik.values.bank}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.bank && formik.errors.bank ? true : false}
                                                    >
                                                        <option value="" label="Select Your Bank" />
                                                        {banks.map((bank) => (
                                                            <option key={bank.id} value={bank.id} label={bank.name} />
                                                        ))}
                                                    </Input>
                                                    {formik.errors.bank && formik.touched.bank ? (
                                                        <FormFeedback type="invalid">{formik.errors.bank}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col lg={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-Inputpurpose_of_payment">Purpose Of Payment</Label>
                                                 <select
                                                        name="purpose_of_payment"
                                                        id="formrow-product_type-Input"
                                                        className="form-control"
                                                        value={formik.values.purpose_of_payment}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.purpose_of_payment && formik.errors.purpose_of_payment}
                                                    >
                                                        <option value="">Choose...</option>
                                                        {purposeofPayment.map((type) => (
                                                            <option key={type.value} value={type.value}>{type.label}</option>
                                                        ))}
                                                    </select>
                                                    {formik.errors.purpose_of_payment && formik.touched.purpose_of_payment ? (
                                                        <FormFeedback type="invalid">{formik.errors.purpose_of_payment}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>

                                            <Col lg={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-InputZip">Amount</Label>
                                                    <Input
                                                        type="text"
                                                        name="amount"
                                                        className="form-control"
                                                        id="formrow-InputZip"
                                                        placeholder="Enter Payed Amount"
                                                        value={formik.values.amount}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.amount && formik.errors.amount ? true : false}
                                                    />
                                                    {formik.errors.amount && formik.touched.amount ? (
                                                        <FormFeedback type="invalid">{formik.errors.amount}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>

                                            <Col lg={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-InputZip">Date</Label>
                                                    <Input
                                                        type="date"
                                                        name="expense_date"
                                                        className="form-control"
                                                        id="formrow-Inputexpense_date"
                                                        value={formik.values.expense_date}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.expense_date && formik.errors.expense_date ? true : false}
                                                    />
                                                    {formik.errors.expense_date && formik.touched.expense_date ? (
                                                        <FormFeedback type="invalid">{formik.errors.expense_date}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col lg={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-Inputpurpose_of_payment">Transaction ID</Label>
                                                    <Input
                                                        type="text"
                                                        name="transaction_id"
                                                        className="form-control"
                                                        id="formrow-Input-transaction_id"
                                                        placeholder="Enter the transaction ID"
                                                        value={formik.values.transaction_id}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.transaction_id && formik.errors.transaction_id ? true : false}
                                                    />
                                                    {formik.errors.transaction_id && formik.touched.transaction_id ? (
                                                        <FormFeedback type="invalid">{formik.errors.transaction_id}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>

                                            <Col lg={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-InputZip">Description</Label>
                                                    <Input
                                                        type="textarea"
                                                        name="description"
                                                        className="form-control"
                                                        id="formrow-InputZip"
                                                        placeholder="Enter Payed description"
                                                        value={formik.values.description}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.description && formik.errors.description ? true : false}
                                                    />
                                                    {formik.errors.description && formik.touched.description ? (
                                                        <FormFeedback type="invalid">{formik.errors.description}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>

                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-bank-Input">Added By</Label>
                                                    <Input
                                                        type="select"
                                                        name="added_by"
                                                        className="form-control"
                                                        id="formrow-added_by-Input"
                                                        value={formik.values.added_by}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.added_by && formik.errors.added_by ? true : false}
                                                    >
                                                        <option value="" label="Select Staff" />
                                                        {staffs.map((staff) => (
                                                            <option key={staff.id} value={staff.name} label={staff.name} />
                                                        ))}
                                                    </Input>
                                                    {formik.errors.added_by && formik.touched.added_by ? (
                                                        <FormFeedback type="invalid">{formik.errors.added_by}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="mb-3">
                                            <div className="form-check">
                                                <Input
                                                    type="checkbox"
                                                    className="form-check-Input"
                                                    id="formrow-customCheck"
                                                    name="check"
                                                    value={formik.values.check}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    invalid={formik.touched.check && formik.errors.check ? true : false}
                                                />
                                                <Label
                                                    className="form-check-Label"
                                                    htmlFor="formrow-customCheck"
                                                >
                                                    Check me out
                                                </Label>
                                            </div>
                                            {formik.errors.check && formik.touched.check ? (
                                                <FormFeedback type="invalid">{formik.errors.check}</FormFeedback>
                                            ) : null}
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
