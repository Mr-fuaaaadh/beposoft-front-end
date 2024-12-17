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

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const BasicTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data using Axios
    useEffect(() => {
        const token = localStorage.getItem('token');  // Replace with actual method of fetching token

        axios.get(`${import.meta.env.VITE_APP_APIKEY}credit/sales/`, {
            headers: {
                Authorization: `Bearer ${token}`  // Pass the token in the Authorization header
            }
        })
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("There was an error fetching the data!", error);
                setLoading(false);
            });
    }, []);

    // meta title
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
                                    <CardTitle className="h4 text-center">CREDIT SALES REPORT</CardTitle>
                                    
                                    {loading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <div className="table-responsive">
                                            <Table className="table table-hover mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>DATE</th>
                                                        <th>TOTAL BILLS</th>
                                                        <th>TOTAL BILLS VOLUME</th>
                                                        <th>PAID AMOUNT</th>
                                                        <th>PENDING AMOUNT</th>
                                                        <th>ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.map((item, index) => (
                                                        <tr key={index}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{item.date}</td>
                                                            <td>{item.total_orders}</td>
                                                            <td>{item.total_amount}</td>
                                                            <td>{item.total_paid}</td>
                                                            <td>{item.total_pending}</td>
                                                            <td>
                                                                <a href={`/credit/sales/resport/${item.date}/`} style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>View</a>
                                                                </td>
                                                        </tr>
                                                    ))}
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
