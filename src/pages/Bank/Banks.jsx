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

const BasicTable = () => {
    // State to store data
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null); 
    const [accounts, setAccounts] = useState([]);  // Add state to store accounts data

    // Document title
    document.title = "beposoft | bank details";

    useEffect(() => {
        // Get token from localStorage or wherever it's stored
        const token = localStorage.getItem("token"); // Replace with your token storage logic

        axios
            .get(`${import.meta.env.VITE_APP_APIKEY}banks/`, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Pass token in headers
                },
            })
            .then((response) => {
                setAccounts(response.data.data); 
                setLoading(false); 
            })
            .catch((err) => {
                setError(err); 
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (error) {
        return <div>Error: {error.message}</div>; 
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid d-flex justify-content-center">
                    <Row className="w-100">
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4 text-center font-weight-bold text-decoration-underline">
                                        COMPANY ACCOUNTS DETAILS
                                    </CardTitle>
                                    <div className="table-responsive">
                                        <Table className="table table-hover mb-0 text-center">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Name</th>
                                                    <th>A/C NO</th>
                                                    <th>IFSC CODE</th>
                                                    <th>BRANCH</th>
                                                    <th>OPENING BALANCE</th>
                                                    <th>created_user</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {accounts.map((account, index) => (
                                                    <tr key={account.id}> 
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{account.name}</td>
                                                        <td style={{ color: 'blue' }}>{account.account_number}</td>
                                                        <td>{account.ifsc_code}</td>
                                                        <td>{account.branch}</td>
                                                        <td>{account.open_balance}</td>
                                                        <td>{account.created_user}</td>
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
}

export default BasicTable;
