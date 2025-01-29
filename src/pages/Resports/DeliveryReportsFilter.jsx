import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useParams } from "react-router-dom";

const BasicTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { date } = useParams(); // Use useParams to get the date from the URL
    const token = localStorage.getItem("token");

    document.title = "Orders | Beposoft";

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_KEY}orders/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Filter orders based on the warehouse shipped_date matching the date parameter
                const filteredOrders = response.data.filter((order) =>
                    order.warehouse.some((parcel) => parcel.shipped_date === date)
                );

                setOrders(filteredOrders);
            } catch (error) {
                setError("Error fetching orders data. Please try again later.");
                console.error("Error fetching orders data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [date, token]);

    const getStatusColor = (status) => {
        const statusColors = {
            Pending: "red",
            Approved: "blue",
            Shipped: "yellow",
            Processing: "orange",
            Completed: "green",
            Cancelled: "gray",
        };
        return { color: statusColors[status] || "black" };
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
                                    <CardTitle className="h4">DELIVERY REPORTS {date} ORDERS</CardTitle>

                                    <div className="table-responsive">
                                        {loading ? (
                                            <div>Loading...</div>
                                        ) : error ? (
                                            <div className="text-danger">{error}</div>
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
                                                    {orders.length > 0 ? (
                                                        orders.map((order, index) => (
                                                            <React.Fragment key={order.id}>
                                                                <tr>
                                                                    <th scope="row">{index + 1}</th>
                                                                    <td>
                                                                        <Link to={`/order/${order.id}/items/`}>
                                                                            {order.invoice}
                                                                        </Link>
                                                                    </td>
                                                                    <td>{order.manage_staff} ({order.family})</td>
                                                                    <td>{order.customer.name}</td>
                                                                    <td style={getStatusColor(order.status)} className="position-relative">
                                                                        {order.status}
                                                                        <table className="nested-table table table-sm table-bordered mt-2">
                                                                            <thead>
                                                                                <tr className="bg-light">
                                                                                    <th>#</th>
                                                                                    <th>BOX</th>
                                                                                    <th>PARCEL</th>
                                                                                    <th>TRACKING</th>
                                                                                    <th>SHIPPED DATE</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {order.warehouse
                                                                                    .filter((parcel) => parcel.shipped_date === date)
                                                                                    .map((parcel, i) => (
                                                                                        <tr key={i}>
                                                                                            <td>{i + 1}</td>
                                                                                            <td>{parcel.box}</td>
                                                                                            <td>{parcel.parcel_service}</td>
                                                                                            <td>{parcel.tracking_id}</td>
                                                                                            <td>{parcel.shipped_date}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                    <td>{order.total_amount}</td>
                                                                    <td>{order.order_date}</td>
                                                                </tr>
                                                            </React.Fragment>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="7" className="text-center text-muted">
                                                                No orders found for this date.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <style jsx>{`
                            .nested-table {
                                width: 100%;
                                border: 1px solid #ccc;
                                margin-top: 10px;
                            }

                            .nested-table th, .nested-table td {
                                font-size: 0.55rem;
                                padding: 3px 5px;
                            }

                            .nested-table thead th {
                                background-color: #f9f9f9;
                            }

                            tr:hover {
                                background-color: #f5f5f5;
                                transition: background-color 0.2s ease;
                            }
                        `}</style>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
};

export default BasicTable;
