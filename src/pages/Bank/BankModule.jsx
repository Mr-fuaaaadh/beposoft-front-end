import React, { useState, useEffect } from "react";
import { Input, Table, Container, Row, Col, Label, Form } from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BankModule = () => {
    const [banklist, setBankList] = useState([]);
    const [bankmodule, setBankModule] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date()); // For single date
    const [dateRange, setDateRange] = useState([null, null]); // For date range
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const [startDate, endDate] = dateRange;

    const currentDate = new Date().toISOString().split('T')[0];
    console.log(currentDate);

    useEffect(() => {
        const token = localStorage.getItem("token"); // Retrieve token from storage
        axios
            .get(`${import.meta.env.VITE_APP_KEY}banks/`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                },
            })
            .then((response) => {
                setBankList(response.data.data);
                setLoading(false);
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Clear token and redirect to login
                    localStorage.removeItem("token");
                    alert("Your session has expired. Please log in again.");
                    navigate("/login");
                } else {
                    setError(err);
                    setLoading(false);
                }
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token"); // Retrieve token from storage
        axios
            .get(`${import.meta.env.VITE_APP_KEY}finance-report/`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                },
            })
            .then((response) => {
                setBankModule(response.data.data);
                setLoading(false);
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Clear token and redirect to login
                    localStorage.removeItem("token");
                    alert("Your session has expired. Please log in again.");
                    navigate("/login");
                } else {
                    setError(err);
                    setLoading(false);
                }
            });
    }, []);

    const calculateCredit = (payments, dateFilter) => {
        if (!payments || payments.length === 0) return 0;

        // Filter payments by selected date or date range
        const filteredPayments = payments.filter((payment) => {
            const paymentDate = new Date(payment.received_at).toISOString().split('T')[0];
            if (dateFilter.start && dateFilter.end) {
                // Date range
                return paymentDate >= dateFilter.start && paymentDate <= dateFilter.end;
            } else if (dateFilter.date) {
                // Single date
                return paymentDate === dateFilter.date;
            }
            return true; // Default case
        });

        return filteredPayments.reduce((total, payment) => total + parseFloat(payment.amount), 0);
    };

    const calculateDebit = (banks, dateFilter) => {
        if (!banks || banks.length === 0) return 0;

        // Filter banks by selected date or date range
        const filteredBanks = banks.filter((bank) => {
            const expenseDate = new Date(bank.expense_date).toISOString().split('T')[0];
            if (dateFilter.start && dateFilter.end) {
                // Date range
                return expenseDate >= dateFilter.start && expenseDate <= dateFilter.end;
            } else if (dateFilter.date) {
                // Single date
                return expenseDate === dateFilter.date;
            }
            return true; // Default case
        });

        return filteredBanks.reduce((total, bank) => total + parseFloat(bank.amount), 0);
    };

    const calculateClosingBalance = (openBalance, credit, debit) => {
        return parseFloat(openBalance) + credit - debit;
    };

    const applyFilters = () => {
        const dateFilter = {
            date: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
            start: startDate ? startDate.toISOString().split('T')[0] : null,
            end: endDate ? endDate.toISOString().split('T')[0] : null,
        };

        // Filter data based on selected date(s)
        const filtered = bankmodule.map((customer) => {
            const credit = calculateCredit(customer.payments, dateFilter);
            const debit = calculateDebit(customer.banks, dateFilter);
            const closingBalance = calculateClosingBalance(customer.open_balance, credit, debit);
            return { ...customer, credit, debit, closingBalance };
        });

        setBankList(filtered);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Form>
                        <Row>
                            <Col md={4}>
                                <div className="mb-3">
                                    <Label>Select a Single Date:</Label>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control"
                                    />
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="mb-3">
                                    <Label>Select a Date Range:</Label>
                                    <DatePicker
                                        selectsRange={true}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(update) => setDateRange(update)}
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control"
                                    />
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-primary mt-4"
                                        onClick={applyFilters}
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>

            <div>
                <Table bordered striped hover className="mb-0">
                    <caption>List of Bank Information</caption>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>OPB</th>
                            <th>Credit</th>
                            <th>Debit</th>
                            <th>CLB</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banklist.map((customer, index) => (
                            <tr key={customer.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{customer.name}</td>
                                <td>{customer.open_balance}</td>
                                <td>{customer.credit}</td>
                                <td>{customer.debit}</td>
                                <td>{customer.closingBalance}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </React.Fragment>
    );
};

export default BankModule;
