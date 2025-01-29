import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useParams } from "react-router-dom";

const BasicTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");


    document.title = "Orders | Beposoft";

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_KEY}warehouse/box/detail/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                setError("Error fetching orders data. Please try again later.");
                console.error("Error fetching orders data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Tables" breadcrumbItem="ORDER" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4">DELIVERY REPORTS</CardTitle>

                                    <div className="table-responsive">
                                        {loading ? (
                                            <div className="d-flex justify-content-center">
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        ) : error ? (
                                            <div className="text-danger">{error}</div>
                                        ) : (
                                            <Table className="table custom-table text-center mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>DATE</th>
                                                        <th>TOTAL BOX DELIVERED</th>
                                                        <th>TOTAL VOLUME WT. (IN KG.)</th>
                                                        <th>TOTAL ACTUAL WT.</th>
                                                        <th>TOTAL DELIVERY CHARGE</th>
                                                        <th>ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.map((order, index) => (
                                                        <tr key={order.id}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{order.shipped_date}</td>
                                                            <td>{order.total_boxes}</td>
                                                            <td>{order.total_volume_weight} KG</td>
                                                            <td>{order.total_weight} KG</td>
                                                            <td>{order.total_shipping_charge}</td>
                                                            <td>
                                                                <Link to={`/delivery/${order.shipped_date}/reports/`} className="btn btn-primary btn-sm">
                                                                    View Details
                                                                </Link>
                                                            </td>
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
