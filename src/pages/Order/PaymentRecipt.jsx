import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, CardTitle, Table, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Receipt from "./Reciept";

const ReceiptFormPage = () => {
    const { id } = useParams();
    const [packing, setPacking] = useState([]);
    const [orderItems, setOrderItems] = useState([]); // Store order items
    const [totalAmount, setTotalAmount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // For handling form submission state

    // Toggle modal visibility
    const toggleModal = () => setIsOpen(!isOpen);

    // Fetch order data and receipts
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array to fetch data on page load

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch order items
            const orderItemsResponse = await axios.get(`${import.meta.env.VITE_APP_APIKEY}order/${id}/items/`, { headers });
            setOrderItems(orderItemsResponse.data.order.payment_receipts);
            setPacking(orderItemsResponse.data.order.warehouse);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    const handleSubmit = async (values, { resetForm }) => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const formattedDate = values.received_at || getCurrentDate();

            const response = await axios.post(
                `${import.meta.env.VITE_APP_APIKEY}payment/${id}/reciept/`,
                { ...values, received_at: formattedDate, id },
                { headers }
            );

            if (response.status === 200 || response.status === 201) {
                alert('Receipt added successfully');
                resetForm();
                toggleModal();

                fetchData();
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            if (error.response) {
                console.error('Server responded with an error:', error.response);
                alert(`Failed to submit form: ${error.response.data.message || 'Please try again later.'}`);
            } else if (error.request) {
                console.error('Network error:', error.request);
                alert('Network error: Please check your internet connection and try again.');
            } else {
                console.error('Error:', error.message);
                alert('Failed to submit form. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardBody>
                <CardTitle className="mb-4 p-2 text-uppercase border-bottom border-primary">
                    <i className="bi bi-info-circle me-2"></i> INFORMATION
                </CardTitle>

                <Row>
                    <Col md={4} className="d-flex flex-column p-3" style={{ borderRight: "1px solid black" }}>
                        <h5>INVOICE PAYMENT STATUS</h5>
                        <p style={{ color: "green", fontWeight: "bold" }}>No receipt against Invoice</p>
                    </Col>

                    <Col md={4} className="d-flex flex-column p-3" style={{ borderRight: "1px solid black" }}>
                        <h5>CUSTOMER LEDGER</h5>
                        <div style={{ backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "5px", fontWeight: "bold" }}>
                            Ledger debited: <span style={{ color: "#dc3545" }}>{totalAmount.toFixed(2)}</span>
                        </div>
                    </Col>

                    <Col md={4} className="d-flex flex-column p-3">
                        <h5>ACTION</h5>
                        <button className="btn btn-primary btn-sm mt-2" onClick={toggleModal}>Add</button>
                    </Col>
                </Row>

                <Modal isOpen={isOpen} toggle={toggleModal} size="lg">
                    <ModalHeader toggle={toggleModal}>Receipt Against Invoice Generate</ModalHeader>
                    <ModalBody>
                        <Receipt handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
                    </ModalBody>
                </Modal>

                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardBody>
                                <CardTitle className="h4">RECEIPT DETAILS</CardTitle>
                                <div className="table-responsive">
                                    <Table className="table table-bordered mb-0">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>RECEIPT NO</th>
                                                <th>DATE</th>
                                                <th>BANK</th>
                                                <th>AMOUNT</th>
                                                <th>CREATED BY</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(orderItems) && orderItems.length > 0 ? (
                                                orderItems.map((receiptItem, index) => (
                                                    <tr key={receiptItem.id || index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{receiptItem.payment_receipt || 'N/A'}</td>
                                                        <td>{receiptItem.received_at || 'N/A'}</td>
                                                        <td>{receiptItem.bank || 'N/A'}</td>
                                                        <td>{receiptItem.amount || 'N/A'}</td>
                                                        <td>{receiptItem.created_by || 'N/A'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" style={{ textAlign: 'center', color: 'gray' }}>No receipts available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>

                            <Row>
                                <Col xl={6}>
                                    <Card>
                                        <CardBody>
                                            <h4 className="card-title">PACKING INFORMATION</h4>
                                            <div className="table-responsive">
                                                <Table className="table table-bordered border-primary mb-0">
                                                    <thead>
                                                        <tr >
                                                            <th>#</th>
                                                            <th>BOX</th>
                                                            <th>A.WT</th>
                                                            <th>V.WT</th>
                                                            <th>IMAGE</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(packing) && packing.length > 0 ? (
                                                            packing.map((packedItems, index) => (
                                                                <tr key={packedItems.id || index}>
                                                                    <th scope="row">{index + 1}</th>
                                                                    <td>{packedItems.box}</td>
                                                                    <td>{packedItems.height * packedItems.breadth * packedItems.length / 6000 || 'N/A'}</td>
                                                                    <td>{packedItems.weight}</td>
                                                                    <td>
                                                                        <img
                                                                            src={`${packedItems.image}` || 'default-image.jpg'}
                                                                            alt={`Box ${packedItems.box}`}
                                                                            style={{ width: '25px', height: '25px', objectFit: 'cover' }}
                                                                        />
                                                                    </td>

                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="6" style={{ textAlign: 'center', color: 'gray' }}>No Packing available</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col xl={6}>
                                    <Card>
                                        <CardBody>
                                            <h4 className="card-title">TRACKING INFORMATION</h4>
                                            <div className="table-responsive">
                                                <Table className="table table-bordered border-success mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>BOX</th>
                                                            <th>PARCEL SERVICE</th>
                                                            <th>TRACKING ID</th>
                                                            <th>DELIVERY CHARGE</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(packing) && packing.length > 0 ? (
                                                            packing.map((packedItems, index) => (
                                                                <tr key={packedItems.id || index}>
                                                                    <th scope="row">{index + 1}</th>
                                                                    <td>{packedItems.box}</td>
                                                                    <td>{packedItems.parcel_service || 'N/A'}</td>
                                                                    <td>{packedItems.tracking_id || 'N/A'}</td>
                                                                    <td>{packedItems.shipping_charge || 'N/A'}</td>

                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="6" style={{ textAlign: 'center', color: 'gray' }}>No Packing available</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default ReceiptFormPage;
