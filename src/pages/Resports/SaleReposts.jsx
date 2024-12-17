import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    Input,
    Button,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const BasicTable = () => {
    const [salesData, setSalesData] = useState([]);
    const [filteredSalesData, setFilteredSalesData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios
            .get(`${import.meta.env.VITE_APP_APIKEY}salesreport/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setSalesData(response.data.sales_report);
                setFilteredSalesData(response.data.sales_report);
            })
            .catch((error) => {
                console.error("There was an error fetching the data:", error);
            });
    }, []);

    // Function to handle filtering
    const handleFilter = () => {
        const filteredData = salesData.filter((sale) => {
            const saleDate = new Date(sale.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            return (!start || saleDate >= start) && (!end || saleDate <= end);
        });

        setFilteredSalesData(filteredData);
    };

    // Function to calculate the totals
    const calculateTotals = (data) => {
        return data.reduce(
            (totals, sale) => {
                totals.totalAmount += sale.amount || 0;
                totals.totalApprovedAmount += sale.approved.amount || 0;
                totals.totalRejectedAmount += sale.rejected.amount || 0;
                return totals;
            },
            { totalAmount: 0, totalApprovedAmount: 0, totalRejectedAmount: 0 }
        );
    };

    // Meta title
    document.title = "Basic Tables | Skote - Vite React Admin & Dashboard Template";

    const totals = calculateTotals(filteredSalesData);

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
                                        STATE SALES REPORTS
                                    </CardTitle>

                                    <Row className="mb-3">
                                        <Col md={4}>
                                            <Input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                placeholder="Start Date"
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <Input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                placeholder="End Date"
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <Button color="primary" onClick={handleFilter}>
                                                Filter
                                            </Button>
                                        </Col>
                                    </Row>

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
                                                    <th className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>Date</th>
                                                    <th colSpan="2" className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>Invoice</th>
                                                    <th colSpan="2" className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>Approved</th>
                                                    <th colSpan="2" className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>Rejected</th>
                                                    <th className="text-center" style={{ padding: "12px", border: "1px solid #dee2e6" }}>Action</th>
                                                </tr>
                                                <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>No</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Date</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Bill</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Amount</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Bill</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Amount</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Bill</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Amount</th>
                                                    <th className="text-center" style={{ border: "1px solid #dee2e6" }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredSalesData.length > 0 ? (
                                                    filteredSalesData.map((sale, index) => (
                                                        <tr key={sale.id} style={{ backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#ffffff" }}>
                                                            <th scope="row" className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{index + 1}</th>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.date}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.total_bills_in_date}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.amount}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.approved.bills}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.approved.amount}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.rejected.bills}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{sale.rejected.amount}</td>
                                                            <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>
                                                            <a href={`/sales/view/${sale.date}/data/`} style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>View</a>

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
                                                <tr style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
                                                    <td colSpan="3" className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>Total</td>
                                                    <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{totals.totalAmount}</td>
                                                    <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}></td>
                                                    <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{totals.totalApprovedAmount}</td>
                                                    <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}>{totals.totalRejectedAmount}</td>
                                                    <td className="text-center" style={{ border: "1px solid #dee2e6", padding: "12px" }}></td>
                                                </tr>
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
