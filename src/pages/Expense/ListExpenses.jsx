import React, { useEffect, useState } from "react";
import { Table, Row, Col, Card, CardBody, CardTitle, Input, Button } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import * as XLSX from "xlsx";

const BasicTable = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}expense/add/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch expenses');
                }

                const data = await response.json();
                setExpenses(data.data);
                setFilteredExpenses(data.data);
            } catch (error) {
                console.error("Error fetching expense data:", error);
            }
        };

        fetchExpenses();
    }, [token]);

    useEffect(() => {
        let filteredData = expenses;

        if (searchTerm) {
            filteredData = filteredData.filter(expense =>
                expense.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expense.payed_by.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expense.purpose_of_payment.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (startDate) {
            filteredData = filteredData.filter(expense => new Date(expense.expense_date) >= new Date(startDate));
        }

        if (endDate) {
            filteredData = filteredData.filter(expense => new Date(expense.expense_date) <= new Date(endDate));
        }

        setFilteredExpenses(filteredData);
    }, [searchTerm, startDate, endDate, expenses]);

    const handleExportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredExpenses);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Expenses");
        XLSX.writeFile(wb, "expenses.xlsx");
    };

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
                                    <CardTitle className="h4">Expense Data</CardTitle>

                                    {/* Search and Filters */}
                                    <Row className="mb-3">
                                        <Col md={3}>
                                            <Input
                                                type="text"
                                                placeholder="Search..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <Input
                                                type="date"
                                                placeholder="Start Date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <Input
                                                type="date"
                                                placeholder="End Date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <Button color="primary" onClick={handleExportToExcel}>
                                                Export to Excel
                                            </Button>
                                        </Col>
                                    </Row>

                                    <div className="table-responsive">
                                        <Table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Company</th>
                                                    <th>Payed By</th>
                                                    <th>Amount</th>
                                                    <th>Expense Date</th>
                                                    <th>Purpose</th>
                                                    <th>Description</th>
                                                    <th>Added By</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredExpenses.map((expense, index) => (
                                                    <tr key={expense.id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td style={{ color: '#007bff' }}>{expense.company.name || 'N/A'}</td>
                                                        <td style={{ color: '#28a745' }}>{expense.payed_by.name || 'N/A'}</td>
                                                        <td>
                                                            <span style={{ color: '#28a745' }}>₹{expense.amount}</span>
                                                        </td>
                                                        <td>{expense.expense_date}</td>
                                                        <td style={{ color: '#ff6f61' }}>{expense.purpose_of_payment}</td>
                                                        <td>{expense.description}</td>
                                                        <td style={{ fontWeight: 'bold' }}>{expense.added_by}</td>
                                                    </tr>
                                                ))}
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