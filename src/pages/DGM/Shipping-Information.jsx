import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Row, Col, CardTitle } from "reactstrap";

const BasicTable = ({ warehouseData }) => {
    const [parcelServices, setParcelServices] = useState([]);
    const [editableData, setEditableData] = useState(warehouseData);
    const token = localStorage.getItem('token');

    // Fetch parcel services on component mount
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_APP_KEY}parcal/service/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setParcelServices(response.data.data);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the parcel services!",
                    error
                );
            });
    }, [token]);

    // Handle input changes for editable fields
    const handleInputChange = (e, index, field) => {
        const newData = [...editableData];
        // Corrected to match the parcel_service field
        if (field === "parcel_service") {
            newData[index][field] = parseInt(e.target.value, 10); // Ensure type consistency
        } else {
            newData[index][field] = e.target.value;
        }
        setEditableData(newData); // Optimistically update the state

        // Update data on server
        updateDataOnServer(newData[index]);
    };

    // Update the server with the edited data
    const updateDataOnServer = (updatedItem) => {
        const url = `${import.meta.env.VITE_APP_KEY}warehouse/detail/${updatedItem.id}/`;

        axios
            .put(url, updatedItem, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log("Data updated successfully:", response.data);
                // Optionally synchronize state with server response
                const updatedIndex = editableData.findIndex(
                    (item) => item.id === response.data.id
                );
                const newData = [...editableData];
                newData[updatedIndex] = response.data;
                setEditableData(newData);
            })
            .catch((error) => {
                console.error(
                    "There was an error updating the data:",
                    error.response ? error.response.data : error.message
                );
                alert("Failed to update the parcel service. Please try again.");
            });
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Row>
                        <Col xl={12}>
                            <CardTitle className="h4 custom-heading">
                                SHIPPING INFORMATION
                            </CardTitle>
                            <div className="table-responsive">
                                <Table className="table table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>BOX</th>
                                            <th>Parcel Service</th>
                                            <th>TA.Wt (Grms.)</th>
                                            <th>V.Wt</th>
                                            <th>Tracking Id</th>
                                            {/* <th>Delivery Charge</th> */}
                                            <th>Image</th>
                                            <th>Packed by</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {editableData && editableData.length > 0 ? (
                                            editableData.map((item, index) => (
                                                <tr key={item.id}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{item.box || "N/A"}</td>
                                                    <td>
                                                        <select
                                                            value={item.parcel_service || "N/A"}
                                                            onChange={(e) =>
                                                                handleInputChange(e, index, "parcel_service")
                                                            }
                                                        >
                                                            <option value="N/A">Select Parcel</option>
                                                            {parcelServices.map((service) => (
                                                                <option key={service.id} value={service.id}>
                                                                    {service.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>{item.weight || "N/A"}</td>
                                                    <td>
                                                        {(item.length *
                                                            item.breadth *
                                                            item.height) / 6000 || "N/A"}
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={item.tracking_id || ""}
                                                            onChange={(e) =>
                                                                handleInputChange(e, index, "tracking_id")
                                                            }
                                                        />
                                                    </td>
                                                    {/* <td>
                                                        <input
                                                            type="text"
                                                            value={item.shipping_charge || ""}
                                                            onChange={(e) =>
                                                                handleInputChange(e, index, "shipping_charge")
                                                            }
                                                        />
                                                    </td> */}
                                                    <td>
                                                        <img
                                                            src={item.image}
                                                            alt="image"
                                                            style={{
                                                                width: "50px",
                                                                height: "50px",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{item.customer || "N/A"}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="text-center">
                                                    No warehouse data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <style jsx>{`
                .custom-heading {
                    text-align: center;
                    position: relative;
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                }

                .custom-heading::after {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 2px;
                    background-color: #007bff;
                    bottom: -10px;
                    left: 0;
                }

                select,
                input {
                    width: 100%;
                    padding: 5px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
            `}</style>
        </React.Fragment>
    );
};

export default BasicTable;
