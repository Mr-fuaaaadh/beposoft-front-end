import React, { useEffect, useState } from "react";
import {
    Table,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
} from "reactstrap";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

import Breadcrumbs from "../../components/Common/Breadcrumb";

const BasicTable = () => {
    document.title = "Basic Tables | Skote - Vite React Admin & Dashboard Template";

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token"); 
                const response = await axios.get(`${import.meta.env.VITE_APP_KEY}orders/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const calculateTotalVolumeWeight = (warehouse) => {
        return warehouse.reduce((totalWeight, box) => {
            const { length, breadth, height } = box;
            const volWt = (length * breadth * height) / 6000;
            return totalWeight + volWt; 
        }, 0);
    };

    const calculateTotalWeight = (warehouse) => {
        return warehouse.reduce((totalWeight, item) => {
            return totalWeight + parseFloat(item.weight); // Convert weight to number and sum
        }, 0);
    };

    const calculateTotalShippingCharge = (warehouse) => {
        return warehouse.reduce((totalCharge, item) => {
            return totalCharge + parseFloat(item.shipping_charge || 0); // Treat null as 0
        }, 0);
    };

    const handleAction = (actionType, orderId) => {
        switch (actionType) {
            case "view":
                navigate(`/order/packing/${orderId}/progress/`);
                break;
            case "pdf":
                generatePDF(orderId);
                break;
            case "excel":
                generateExcel(orderId);
                break;
            default:
                break;
        }
    };

    const generatePDF = (orderId) => {
        const doc = new jsPDF();
        doc.text(`Order ID: ${orderId}`, 10, 10);
        doc.text("Order details go here...", 10, 20); 
        doc.save(`order_${orderId}.pdf`);
    };

    const generateExcel = (orderId) => {
        const orderData = orders.find((order) => order.id === orderId);
        const ws = XLSX.utils.json_to_sheet([orderData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Order Data");
        XLSX.writeFile(wb, `order_${orderId}.xlsx`);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Tables" breadcrumbItem="DELIVERY LIST" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4">DELIVERY NOTES</CardTitle>
                                    {loading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <div className="table-responsive">
                                            <Table className="table mb-0 table-bordered">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>INVOICE</th>
                                                        <th>CUSTOMER</th>
                                                        <th>BOXS</th>
                                                        <th>Vol Wt</th>
                                                        <th>Actual Wt (Grms.)</th>
                                                        <th>Delivery Charge</th>
                                                        <th>STATUS</th>
                                                        <th>CREATE AT</th>
                                                        <th>ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.length > 0 ? (
                                                        orders.map((order, index) => {
                                                            const totalVolumeWeight = calculateTotalVolumeWeight(order.warehouse);
                                                            const totalActualWeight = calculateTotalWeight(order.warehouse);
                                                            const totalShippingCharge = calculateTotalShippingCharge(order.warehouse);
                                                            return (
                                                                <tr key={order.id}>
                                                                    <th scope="row">{index + 1}</th>
                                                                    <td style={{ fontWeight: "bold", color: "blue" }}>{order.invoice}</td>
                                                                    <td style={{ fontWeight: "bold", color: "green" }}>{order.customer.name}</td>
                                                                    <td>{order.warehouse.length} </td>
                                                                    <td>{totalVolumeWeight.toFixed(2)}</td>
                                                                    <td>{totalActualWeight.toFixed(2)} kg</td> 
                                                                    <td>{totalShippingCharge}</td>
                                                                    <td style={{ fontWeight: "bold", color: order.status === "Delivered" ? "green" : "red" }}>
                                                                        {order.status}
                                                                    </td>
                                                                    <td>{order.order_date}</td>
                                                                    <td>
                                                                        <select
                                                                            className="form-control"
                                                                            onChange={(e) => handleAction(e.target.value, order.id)}
                                                                            defaultValue=""
                                                                        >
                                                                            <option value="" disabled>Select Action</option>
                                                                            <option value="view">View</option>
                                                                            <option value="pdf">PDF</option>
                                                                            <option value="excel">Excel</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="11">No orders found</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    )}
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
