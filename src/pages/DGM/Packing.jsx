import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import {
    Card,
    Col,
    Container,
    Row,
    CardBody,
    CardTitle,
    Label,
    Input,
    Table 
} from "reactstrap";
import axios from "axios";
import { map } from 'lodash';
import PackingInformation from "./Packing-Information"
import ShippingInformation from "./Shipping-Information"


import Breadcrumbs from "../../components/Common/Breadcrumb";

const FormLayouts = () => {
    document.title = "Form Layouts | Skote - Vite React Admin & Dashboard Template";

    const { id } = useParams();  
    const [orderData, setOrderData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_KEY}order/${id}/items/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setOrderData(response.data.order); 
            } catch (error) {
                console.error("Error fetching order data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>; 
    }

    const billingAddress = orderData?.customer;
    const shippingAddress = orderData?.billing_address; 
    const warehouseData = orderData?.warehouse;

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Forms" breadcrumbItem="View Order Details" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4 text-center heading-with-underline">ORDER BASIC INFORMATION</CardTitle>
                                    <Row>
                                        <Col md={6} lg={3}>
                                            <div className="mb-3">
                                                <Label htmlFor="formrow-invoice-Input">Invoice</Label>
                                                <Input
                                                    type="text"
                                                    name="invoice"
                                                    className="form-control"
                                                    id="formrow-invoice-Input"
                                                    value={orderData?.invoice || ""}
                                                    readOnly 
                                                />
                                            </div>
                                        </Col>
                                        <Col md={6} lg={3}>
                                            <div className="mb-3">
                                                <Label htmlFor="formrow-order_date-Input">Order Date</Label>
                                                <Input
                                                    type="text"
                                                    name="order_date"
                                                    className="form-control"
                                                    id="formrow-order_date-Input"
                                                    value={orderData?.order_date || ""}
                                                    readOnly 
                                                />
                                            </div>
                                        </Col>

                                        <Col md={6} lg={3}>
                                            <div className="mb-3">
                                                <Label htmlFor="formrow-status-Input">Status</Label>
                                                <Input
                                                    type="text"
                                                    name="status"
                                                    className="form-control"
                                                    id="formrow-status-Input"
                                                    value={orderData?.status || ""}
                                                    readOnly 
                                                />
                                            </div>
                                        </Col>
                                        <Col md={6} lg={3}>
                                            <div className="mb-3">
                                                <Label htmlFor="formrow-manage_staff-Input">Manage Staff</Label>
                                                <Input
                                                    type="text"
                                                    name="manage_staff"
                                                    className="form-control"
                                                    id="formrow-manage_staff-Input"
                                                    value={orderData?.manage_staff || ""}
                                                    readOnly 
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardBody>
                                    <CardTitle className="mb-4 text-center heading-with-underline">INVOICE - INFORMATION</CardTitle>
                                    <Row>
                                        <Col sm={12} md={6}>
                                            <address>
                                                <strong>Billed To:</strong>
                                                <br />
                                                {billingAddress ? map(Object.entries(billingAddress), ([key, value], index) => (
                                                    <React.Fragment key={index}>
                                                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</span>
                                                        <br />
                                                    </React.Fragment>
                                                )) : "No Billing Address Available"}
                                            </address>
                                        </Col>

                                        <Col sm={12} md={6} className="text-sm-end">
                                            <address>
                                                <strong>Shipped To:</strong>
                                                <br />
                                                {shippingAddress ? map(Object.entries(shippingAddress), ([key, value], index) => (
                                                    <React.Fragment key={index}>
                                                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</span>
                                                        <br />
                                                    </React.Fragment>
                                                )) : "No Shipping Address Available"}
                                            </address>
                                        </Col>
                                    </Row>
                                </CardBody>

                                <CardBody>
                                    <CardTitle className="mb-4 text-center heading-with-underline">PRODUCTS</CardTitle>
                                    <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        <Table className="table table-striped mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Image</th>
                                                    <th>Product Name</th>
                                                    <th>Description</th>
                                                    <th>Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderData?.items?.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img
                                                                src={item.images?.[0] || 'No images'}
                                                                alt={item.name}
                                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                            />
                                                        </td>
                                                        <td>{item.name}</td>
                                                        <td>{item.description}</td>
                                                        <td>{item.quantity}</td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td colSpan="4" className="text-end"><strong>Total Quantity:</strong></td>
                                                    <td>
                                                        {orderData?.items?.reduce((total, item) => total + item.quantity, 0)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </CardBody>
                            <PackingInformation/>
                            <ShippingInformation warehouseData={warehouseData} />


                            </Card>
                        </Col>
                    </Row>
                </Container>

                <style jsx>{`
                    .heading-with-underline {
                        text-decoration: underline;
                        padding-bottom: 10px;
                        font-weight: bold;
                        font-size: 1.5rem;
                    }

                    .address-section {
                        border: 1px solid #ddd;
                        padding: 20px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                    }

                    .address-title {
                        font-size: 1.2rem;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 10px;
                    }

                    .address-content p {
                        margin: 5px 0;
                    }

                    .form-control {
                        border-radius: 5px;
                    }

                    .mb-3 {
                        margin-bottom: 15px;
                    }

                    .table th, .table td {
                        border: 1px solid #ddd; /* Add border to table cells */
                    }
                `}</style>
            </div>
        </React.Fragment>
    );
};

export default FormLayouts;
