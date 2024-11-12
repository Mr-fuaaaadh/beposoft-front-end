import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import { FaUniversity, FaIdBadge, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const validationSchema = Yup.object({
    received_at: Yup.date().required('Date is required'),
    amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
    bank: Yup.string().required('Bank is required'),
    transactionID: Yup.string().required('Transaction ID is required'),
    createdBy: Yup.string().required('Creator name is required'),
    remark: Yup.string().max(500, 'Remark should be 500 characters or less')
});

// Utility function to get today's date in YYYY-MM-DD format
const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const ReceiptFormPage = ({ toggleReciptModal }) => {
    const { id } = useParams();
    const [creatorName, setCreatorName] = useState('');
    const [banks, setBanks] = useState([]);

    useEffect(() => {
        const Creatername = localStorage.getItem('name');
        console.log("Creator Name:", Creatername);
        setCreatorName(Creatername || '');

        // Fetch the list of banks from an API and set them in state
        const fetchBanks = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const response = await axios.get(`${import.meta.env.VITE_APP_APIKEY}banks/`, { headers });
                setBanks(response.data.data);
            } catch (error) {
                console.error('Error fetching banks', error);
            }
        };

        fetchBanks();
    }, []);

    const handleSubmit = async (values) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Ensure date has a value, and set it to today's date if it's empty
            const formattedDate = values.received_at || getCurrentDate();

            const selectedBank = banks.find(bank => bank.id === values.bank);
            localStorage.setItem('selectedBank', selectedBank ? selectedBank.name : '');

            // Submit the form data including formatted date
            const response = await axios.post(
                `${import.meta.env.VITE_APP_APIKEY}payment/${id}/reciept/`,
                { ...values, received_at: formattedDate, id },
                { headers }
            );

            console.log('Form submitted successfully', response.data);
            toggleReciptModal(); // Close modal on success
        } catch (error) {
            console.error('Error submitting form', error);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Formik
                initialValues={{
                    received_at: getCurrentDate(),
                    amount: '',
                    bank: '',
                    transactionID: '',
                    createdBy: creatorName || '',
                    remark: ''
                }}
                enableReinitialize // Allows form to reinitialize with new initial values
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {(Recieptformik) => (
                    <Form onSubmit={Recieptformik.handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="font-weight-bold">Received Date</Label>
                                    <Input
                                        type="date"
                                        name="received_at"
                                        value={Recieptformik.values.received_at}
                                        onChange={Recieptformik.handleChange}
                                        onBlur={Recieptformik.handleBlur}
                                        className={`border-primary ${Recieptformik.errors.received_at && Recieptformik.touched.received_at ? 'is-invalid' : ''}`}
                                    />
                                    {Recieptformik.errors.received_at && Recieptformik.touched.received_at && (
                                        <div className="invalid-feedback">{Recieptformik.errors.received_at}</div>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="font-weight-bold">Amount</Label>
                                    <Input
                                        type="number"
                                        name="amount"
                                        value={Recieptformik.values.amount}
                                        onChange={Recieptformik.handleChange}
                                        onBlur={Recieptformik.handleBlur}
                                        className={`border-success ${Recieptformik.errors.amount && Recieptformik.touched.amount ? 'is-invalid' : ''}`}
                                        placeholder="Enter amount"
                                    />
                                    {Recieptformik.errors.amount && Recieptformik.touched.amount && (
                                        <div className="invalid-feedback">{Recieptformik.errors.amount}</div>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label className="font-weight-bold">Bank</Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><FaUniversity /></span>
                                        <Input
                                            type="select"
                                            name="bank"
                                            value={Recieptformik.values.bank}
                                            onChange={Recieptformik.handleChange}
                                            onBlur={Recieptformik.handleBlur}
                                            className={Recieptformik.errors.bank && Recieptformik.touched.bank ? 'is-invalid' : ''}
                                        >
                                            <option value="">Select bank</option>
                                            {banks.map(bank => (
                                                <option key={bank.id} value={bank.id}>{bank.name}</option>
                                            ))}
                                        </Input>
                                        {Recieptformik.errors.bank && Recieptformik.touched.bank && (
                                            <div className="invalid-feedback">{Recieptformik.errors.bank}</div>
                                        )}
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label className="font-weight-bold">Transaction ID</Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><FaIdBadge /></span>
                                        <Input
                                            type="text"
                                            name="transactionID"
                                            value={Recieptformik.values.transactionID}
                                            onChange={Recieptformik.handleChange}
                                            onBlur={Recieptformik.handleBlur}
                                            className={`border-warning shadow-sm ${Recieptformik.errors.transactionID && Recieptformik.touched.transactionID ? 'is-invalid' : ''}`}
                                            placeholder="Enter transaction ID"
                                        />
                                        {Recieptformik.errors.transactionID && Recieptformik.touched.transactionID && (
                                            <div className="invalid-feedback">{Recieptformik.errors.transactionID}</div>
                                        )}
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label className="font-weight-bold">Created By</Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><FaUserPlus /></span>
                                        <Input
                                            type="text"
                                            name="createdBy"
                                            value={Recieptformik.values.createdBy}
                                            readOnly
                                            className="border-info shadow-sm"
                                            placeholder="Creator's name"
                                        />
                                    </div>
                                </FormGroup>
                            </Col>

                            <Col md={12}>
                                <FormGroup>
                                    <Label className="font-weight-bold">Remark</Label>
                                    <Input
                                        type="textarea"
                                        name="remark"
                                        value={Recieptformik.values.remark}
                                        onChange={Recieptformik.handleChange}
                                        onBlur={Recieptformik.handleBlur}
                                        className={`border-secondary ${Recieptformik.errors.remark && Recieptformik.touched.remark ? 'is-invalid' : ''}`}
                                        placeholder="Enter any additional remarks here"
                                    />
                                    {Recieptformik.errors.remark && Recieptformik.touched.remark && (
                                        <div className="invalid-feedback">{Recieptformik.errors.remark}</div>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <div className="modal-footer d-flex justify-content-end" style={{ padding: "1.5rem" }}>
                            <Button color="success" type="submit" className="px-4">Save</Button>
                            <Button color="danger" onClick={toggleReciptModal} className="ml-2 px-4">Cancel</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ReceiptFormPage;
