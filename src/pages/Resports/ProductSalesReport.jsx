import React, { useState, useEffect } from "react";
import {
    Table,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
} from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const BasicTable = () => {
    document.title = "Basic Tables | Skote - Vite React Admin & Dashboard Template";

    // State to store table data
    const [tableData, setTableData] = useState([]);
    const token = localStorage.getItem("token");

    // Fetch data using the fetch API
    const fetchData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}sold/products/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response Data:", data); // Log the response body
            setTableData(data.data); // Adjust based on the actual response structure
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Call fetchData when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Tables" breadcrumbItem="Basic Tables" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4">Bordered Table</CardTitle>
                                    <CardSubtitle className="card-title-desc">
                                        Add <code>.table-bordered</code> for borders on all sides of the table and cells.
                                    </CardSubtitle>

                                    <div className="table-responsive">
                                        <Table className="table table-bordered mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>DATE</th>
                                                    <th>PRODUCT NAME</th>
                                                    <th>STOCK QUANTITY</th>
                                                    <th>ITEM SOLD</th>
                                                    <th>REMAINING STOCK</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.map((item, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item.date}</td>
                                                        <td>{item.product_title}</td>
                                                        <td>{item.stock_quantity + item.items_sold}</td>
                                                        <td>{item.items_sold}</td>
                                                        <td>{item.stock_quantity}</td>
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
