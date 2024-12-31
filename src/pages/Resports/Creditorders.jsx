import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Row, Col, Card, CardBody, CardTitle, Input, Button } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useParams } from "react-router-dom";
import * as XLSX from "xlsx";

const BasicTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCompany, setSelectedCompany] = useState(""); // State for selected company
    const [companies, setCompanies] = useState([]); // State for company list
    const { date } = useParams();
    const token = localStorage.getItem("token");

    document.title = "Orders | Beposoft";

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_APIKEY}orders/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const filteredOrders = response.data.filter(
                    (order) =>
                        order.payment_status === "credit" && order.order_date === date
                );

                setOrders(filteredOrders);

                // Assuming each order contains company info (adjust based on actual response structure)
                const companyList = [
                    ...new Set(filteredOrders.map((order) => order.company.name)),
                ];
                setCompanies(companyList);
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

    // Filter orders based on the search term and selected company
    const filteredOrders = orders.filter((order) => {
        const matchesSearchTerm =
            order.manage_staff.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.company.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCompanyFilter =
            selectedCompany === "" || order.company.name === selectedCompany;
        return matchesSearchTerm && matchesCompanyFilter;
    });

    // Export to Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredOrders);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");
        XLSX.writeFile(wb, "orders.xlsx");
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

                                    <Row className="mb-3">
                                        <Col md={5}>
                                            {/* Search Input */}
                                            <Input
                                                type="text"
                                                placeholder="Search orders..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="mb-3"
                                            />
                                        </Col>
                                        <Col md={5}>
                                            {/* Company Filter Dropdown */}
                                            <Input
                                                type="select"
                                                value={selectedCompany}
                                                onChange={(e) => setSelectedCompany(e.target.value)}
                                                className="mb-3"
                                            >
                                                <option value="">All Companies</option>
                                                {companies.map((company) => (
                                                    <option key={company} value={company}>
                                                        {company}
                                                    </option>
                                                ))}
                                            </Input>
                                        </Col>

                                        <Col md={2}>
                                        <Col>
                                            {/* Export to Excel Button */}
                                            <Button color="primary" onClick={exportToExcel} className="mb-3">
                                                Export to Excel
                                            </Button>
                                        </Col>
                                        </Col>
                                    </Row>

                                    


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
                                                    {filteredOrders.length > 0 ? (
                                                        filteredOrders.map((order, index) => (
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
                                                                    <td
                                                                        style={getStatusColor(order.status)}
                                                                        className="position-relative"
                                                                    >
                                                                        {order.status}
                                                                        <table className="nested-table table table-sm table-bordered mt-2">
                                                                            <thead>
                                                                                <tr className="bg-light">
                                                                                    <th>#</th>
                                                                                    <th>BOX</th>
                                                                                    <th>PARCEL</th>
                                                                                    <th>TRACKING</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {order.warehouse.map((parcel, i) => (
                                                                                    <tr key={i}>
                                                                                        <td>{i + 1}</td>
                                                                                        <td>{parcel.box}</td>
                                                                                        <td>{parcel.parcel_service}</td>
                                                                                        <td>{parcel.tracking_id}</td>
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
                                                                No orders match your search.
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
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
};

export default BasicTable;
