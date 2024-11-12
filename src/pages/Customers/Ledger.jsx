import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
    Table,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    Input,
    Label,
    Button,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BasicTable = () => {
    const { id } = useParams();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const name = localStorage.getItem('name');
    document.title = `${name} Ledger | Beposoft`;

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [companyFilter, setCompanyFilter] = useState("");
    
    const tableRef = useRef(null);

    useEffect(() => {
        const fetchLedgerData = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_APIKEY}customer/${id}/ledger`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setOrders(response.data.data);
                setFilteredOrders(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching ledger data:", error);
                setError("Failed to fetch ledger data.");
                setLoading(false);
            }
        };

        if (id) fetchLedgerData();
    }, [id]);

    const handleFilter = () => {
        const filtered = orders.filter(order => {
            const orderDate = new Date(order.order_date);
            const isWithinDateRange = (!startDate || orderDate >= new Date(startDate)) && (!endDate || orderDate <= new Date(endDate));
            const matchesCompany = !companyFilter || order.company === companyFilter;
            return isWithinDateRange && matchesCompany;
        });
        setFilteredOrders(filtered);
    };

    const exportToPDF = () => {
        const input = tableRef.current;
        html2canvas(input).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.width;
            const pageHeight = pdf.internal.pageSize.height;
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let position = 20;
            let heightLeft = imgHeight;
            let pageCount = 1;
    
            // Custom Header
            pdf.setFontSize(14);
            pdf.text("Customer Ledger Report", pageWidth / 2, 15, { align: 'center' });
            pdf.setFontSize(10);
            pdf.setTextColor(100);
    
            // Adjust "Generated on" date to align correctly on the right
            const dateText = `Generated on: ${new Date().toLocaleDateString()}`;
            const textWidth = pdf.getStringUnitWidth(dateText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
            pdf.text(dateText, pageWidth - textWidth - 10, 15); // Align 10 units from the right edge
    
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
    
            // Adding Pagination and Footer
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                pageCount++;
    
                // Footer with page number
                pdf.setFontSize(10);
                pdf.text(`Page ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            }
    
            pdf.save("Customer_Ledger_Report.pdf");
        });
    };
    

    const totalDebit = filteredOrders.reduce((total, order) => total + order.total_amount, 0);
    const totalCredit = filteredOrders.reduce(
        (total, order) =>
            total + order.payment_receipts.reduce((sum, receipt) => sum + parseFloat(receipt.amount || 0), 0),
        0
    );
    const closingBalance = totalDebit - totalCredit;

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Tables" breadcrumbItem="Customer Ledger" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4 text-uppercase">
                                        Customer Ledger
                                    </CardTitle>
                                    <CardSubtitle className="card-title-desc mb-4">
                                        Detailed view of debits and credits for the customer ledger.
                                    </CardSubtitle>

                                    {/* Filter Section */}
                                    <div className="mb-4">
                                        <Row>
                                            <Col md={4}>
                                                <Label for="startDate">Start Date</Label>
                                                <Input
                                                    type="date"
                                                    id="startDate"
                                                    value={startDate}
                                                    onChange={e => setStartDate(e.target.value)}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <Label for="endDate">End Date</Label>
                                                <Input
                                                    type="date"
                                                    id="endDate"
                                                    value={endDate}
                                                    onChange={e => setEndDate(e.target.value)}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <Label for="company">Company</Label>
                                                <Input
                                                    type="select"
                                                    id="company"
                                                    value={companyFilter}
                                                    onChange={e => setCompanyFilter(e.target.value)}
                                                >
                                                    <option value="">All Companies</option>
                                                    <option value="MICHEAL IMPORT EXPORT PVT LTD">MICHEAL IMPORT EXPORT PVT LTD</option>
                                                    <option value="BEPOSITIVERACING PVT LTD">BEPOSITIVERACING PVT LTD</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        <Button color="primary" className="mt-3" onClick={handleFilter}>
                                            Apply Filters
                                        </Button>
                                    </div>

                                    {/* Table Section */}
                                    <div className="table-responsive" ref={tableRef}>
                                        <Table className="table table-bordered mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>#</th>
                                                    <th>DATE</th>
                                                    <th>INVOICE</th>
                                                    <th>PARTICULAR</th>
                                                    <th>DEBIT (₹)</th>
                                                    <th>CREDIT (₹)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredOrders.map((order, orderIndex) => (
                                                    <React.Fragment key={order.id}>
                                                        <tr>
                                                            <th scope="row">{orderIndex + 1}</th>
                                                            <td>{order.order_date}</td>
                                                            <td>
                                                                <a href={`/order/${order.id}/items/`} target="_blank" rel="noopener noreferrer">{order.invoice}/{order.company}</a>
                                                            </td>
                                                            <td style={{ color: 'red' }}>Goods Sale</td>
                                                            <td>{order.total_amount.toFixed(2)}</td>
                                                            <td>-</td>
                                                        </tr>

                                                        {order.payment_receipts.map((receipt, index) => (
                                                            <tr key={receipt.id}>
                                                                <th scope="row">{`${orderIndex + 1}.${index + 1}`}</th>
                                                                <td>{receipt.received_at}</td>
                                                                <td>{receipt.bank}</td>
                                                                <td style={{ color: 'green' }}>Payment received</td>
                                                                <td>-</td>
                                                                <td>{parseFloat(receipt.amount || 0).toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                ))}

                                                <tr>
                                                    <td colSpan="3" className="text-right" style={{ fontWeight: 'bold' }}>
                                                        Grand Total
                                                    </td>
                                                    <td></td>
                                                    <td style={{ fontWeight: 'bold' }}>{totalDebit.toFixed(2)}</td>
                                                    <td style={{ fontWeight: 'bold' }}>{totalCredit.toFixed(2)}</td>
                                                </tr>

                                                {/* Closing Balance Row */}
                                                <tr>
                                                    <td colSpan="4" className="text-right" style={{ fontWeight: 'bold' }}>
                                                        Closing Balance
                                                    </td>
                                                    <td></td>
                                                    <td style={{ fontWeight: 'bold' }}>{closingBalance.toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>

                                    {/* Export to PDF Button Below the Table */}
                                    <Button color="secondary" className="mt-3" onClick={exportToPDF}>
                                        Export to PDF
                                    </Button>
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
