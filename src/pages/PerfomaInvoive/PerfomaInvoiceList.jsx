import React, { useEffect, useState } from "react";
import {
    Table,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";

const BasicTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    document.title = "Orders | Beposoft";

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_KEY}perfoma/invoices/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Error fetching orders data");
                }

                const data = await response.json();
                setOrders(data.data);
            } catch (error) {
                setError("Error fetching orders data. Please try again later.");
                console.error("Error fetching orders data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return { color: 'red' };
            case 'Approved':
                return { color: 'blue' };
            case 'Shipped':
                return { color: 'yellow' };
            case 'Processing':
                return { color: 'orange' };
            case 'Completed':
                return { color: 'green' };
            case 'Cancelled':
                return { color: 'gray' };
            default:
                return { color: 'black' };
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Tables" breadcrumbItem="ORDER" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4">BEPOSOFT ORDERS</CardTitle>
                                    <div className="table-responsive">
                                        {loading ? (
                                            <div>Loading...</div>
                                        ) : error ? (
                                            <div className="text-danger">{error}</div>
                                        ) : orders.length === 0 ? (
                                            <div>No orders available.</div>
                                        ) : (
                                            <Table className="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>INVOICE NO</th>
                                                        <th>STAFF</th>
                                                        <th>CUSTOMER</th>
                                                        <th>STATUS</th>
                                                        <th>BILL AMOUNT</th>
                                                        <th>CREATED AT</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.map((order, index) => (
                                                        <tr key={order.id}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>
                                                                <Link to={`/perfoma/invoice/${order.invoice}/view/`}>
                                                                    {order.invoice}
                                                                </Link>
                                                            </td>
                                                            <td>{order.manage_staff} ({order.family})</td>
                                                            <td>{order.customer ? order.customer.name : "N/A"}</td>
                                                            <td style={getStatusColor(order.status)}>
                                                                {order.status}
                                                            </td>
                                                            <td>{order.total_amount}</td>
                                                            <td>{order.order_date}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </div>
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
