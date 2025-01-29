import React, { useState, useEffect } from "react";
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

const BasicTable = () => {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios
            .get(`${import.meta.env.VITE_APP_KEY}state/wise/report/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setSalesData(response.data.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the data:", error);
            });
    }, []);


    // Meta title
    document.title = "Basic Tables | Skote - Vite React Admin & Dashboard Template";


    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Tables" breadcrumbItem="Basic Tables" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4 text-center mt-4 mb-4" style={{ borderBottom: "2px solid #007bff", paddingBottom: "10px" }}>
                                        SALES REPORTS
                                    </CardTitle>


                                    <div className="table-responsive">
                                        <Table
                                            className="table table-bordered"
                                            style={{
                                                border: "1px solid #dee2e6",
                                                borderRadius: "10px",
                                                overflow: "hidden",
                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                                            }}
                                        >
                                            <thead style={{ backgroundColor: "#007bff", color: "#ffffff" }}>
                                                <tr>
                                                    <th className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>#</th>
                                                    <th className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>Name</th>
                                                    <th colSpan="2" className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>Invoice</th>
                                                    <th colSpan="2" className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>Delivered</th>
                                                    <th colSpan="2" className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>Cancelled</th>
                                                    <th colSpan="2" className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>Return</th>
                                                    <th colSpan="2" className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>Rejected</th>

                                                    <th className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>Action</th>
                                                </tr>
                                                <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>No</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Name</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Bill</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Amount</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Bill</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Amount</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Bill</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Amount</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Bill</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Amount</th><th className="text-center" style={{ border: "1px solid #dee2e6" }}>Bill</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Amount</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {salesData.length > 0 ? (
                                                    salesData.map((sale, index) => (
                                                        <tr key={sale.id} style={{ backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#ffffff" }}>
                                                            <th scope="row" className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{index + 1}</th>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.name}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.total_orders_count}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.total_amount}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.completed_orders_count}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.completed_amount}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.cancelled_orders_count}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.cancelled_amount}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.returned_orders_count}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.returned_amount}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.rejected_orders_count}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.rejected_amount}</td>

                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>
                                                                <a href={`/state/sales/view/${sale.id}/data/`} style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>View</a>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="9" className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                                                            No sales data available.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
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
