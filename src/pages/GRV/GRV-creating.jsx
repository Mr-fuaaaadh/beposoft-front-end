import React, { useEffect, useState } from "react";
import {
    Card,
    Col,
    Container,
    Row,
    CardBody,
    CardTitle,
    Label,
    Form,
    Input,
    FormFeedback,
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import { useFormik } from "formik";
import axios from "axios";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const token = localStorage.getItem("token");

const FormLayouts = () => {
    document.title = "beposoft | New GRV";

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modal, setModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [orderProducts, setOrderProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const date = new Date();

    const currentDate = date.toISOString().split('T')[0]; // This will give you the date in "YYYY-MM-DD" format

    // Format the current time as HH:mm:ss
    const currentTime = date.toTimeString().split(' ')[0];



    // Fetch orders on component mount
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const endpoint = `${import.meta.env.VITE_APP_APIKEY}orders/`;
                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                console.error(error.response?.data || error.message);
            }
        };

        fetchOrders();
    }, []);

    const handleOrderChange = async (e) => {
        const selectedId = parseInt(e.target.value, 10);
        const order = orders.find((o) => o.id === selectedId);
        setSelectedOrder(order || null);

        if (order) {
            formik.setValues({
                order: selectedId,
                invoice: order.invoice || "",
                order_date: order.order_date || "",
                billing_address: order.billing_address?.address || "",
                manage_staff: order.manage_staff || "",
            });

            // Extract products from the selected order
            setOrderProducts(order.items || []); // `items` is the field containing product data
        } else {
            formik.resetForm();
            setOrderProducts([]);
        }
    };


    const toggleModal = () => setModal(!modal);

    const handleProductSelect = (product, quantity) => {
        if (quantity > 0) {
            const newProducts = Array.from({ length: quantity }, () => ({
                ...product,
                uniqueId: `${product.id}-${Math.random()}`, // Ensure unique row
                rowQuantity: 1,
            }));
            setSelectedProducts((prev) => [...prev, ...newProducts]);
        }
        toggleModal();
    };

    const handleSaveInvoice = async () => {
        const dataToSave = selectedProducts.map((product) => ({
            order: selectedOrder.id,
            product: product.name,
            returnreason: product.returnReason || "Not specified",
            price: product.rate,
            quantity: product.rowQuantity,
            remark: "return", // Assuming a fixed remark for this example
            status: "pending",
            note: product.note || "",
            date: currentDate,  // Add current date
            time: currentTime, 
        }));

        setLoading(true);
        try {
            const endpoint = `${import.meta.env.VITE_APP_APIKEY}grv/data/`; // Adjust the endpoint for your backend
            const response = await axios.post(endpoint, dataToSave, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Invoice saved successfully!");
            console.log(response.data);
            setSelectedProducts([]); // Clear the selected products after saving
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert("Error saving invoice. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            order: "",
            invoice: "",
            manage_staff: "",
            billing_address: "",
            order_date: "",
        },
        onSubmit: (values) => {
            console.log("Form submitted:", values);
        },
    });

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Forms" breadcrumbItem="NEW GRV" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4">Invoice Form</CardTitle>
                                    <Form onSubmit={formik.handleSubmit}>
                                        <Row>
                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="order">Select Orders</Label>
                                                    <Input
                                                        type="select"
                                                        name="order"
                                                        id="order"
                                                        value={formik.values.order}
                                                        onChange={handleOrderChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={
                                                            formik.touched.order &&
                                                            formik.errors.order
                                                        }
                                                    >
                                                        <option value="">Choose Orders</option>
                                                        {orders.map((order) => (
                                                            <option
                                                                key={order.id}
                                                                value={order.id}
                                                            >
                                                                {`Order #${order.invoice || "N/A"} - ${order.manage_staff || "No Staff"} - ₹${order.total_amount || "No Amount"}`}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                    {formik.touched.order &&
                                                        formik.errors.order ? (
                                                        <FormFeedback type="invalid">
                                                            {formik.errors.order}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>
                                            <Col md={3}>
                                                <div className="mb-3">
                                                    <Label htmlFor="invoice">Invoice</Label>
                                                    <Input
                                                        type="text"
                                                        name="invoice"
                                                        id="invoice"
                                                        placeholder="Enter Invoice"
                                                        value={formik.values.invoice}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={3}>
                                                <div className="mb-3">
                                                    <Label htmlFor="manage_staff">User Management</Label>
                                                    <Input
                                                        type="text"
                                                        name="manage_staff"
                                                        id="manage_staff"
                                                        value={formik.values.manage_staff}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={2}>
                                                <div className="mb-3">
                                                    <Label htmlFor="order_date">Invoice Date</Label>
                                                    <Input
                                                        type="date"
                                                        name="order_date"
                                                        id="order_date"
                                                        value={formik.values.order_date}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <div className="mb-3">
                                                    <Label htmlFor="billing_address">
                                                        Bill to Address
                                                    </Label>
                                                    <Input
                                                        type="textarea"
                                                        name="billing_address"
                                                        id="billing_address"
                                                        value={formik.values.billing_address}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                    <Button color="primary" onClick={toggleModal}>
                                        Add Products
                                    </Button>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <div className="table-responsive">
                                        <Table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Image</th>
                                                    <th>Product Name</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Return Reason</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedProducts.map((product, index) => (
                                                    <tr key={product.uniqueId}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img
                                                                src={`http://localhost:8000${product.images[0]}`}
                                                                alt={product.name}
                                                                style={{
                                                                    width: "50px",
                                                                    height: "50px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "5px",
                                                                }}
                                                            />
                                                        </td>
                                                        <td>{product.name}</td>
                                                        <td>₹{product.rate ? product.rate.toFixed(2) : "0.00"}</td> {/* Fixed here */}
                                                        <td>1</td>
                                                        <td>
                                                            <div>
                                                                <div>
                                                                    <Input
                                                                        type="radio"
                                                                        name={`returnReason-${product.uniqueId}`}
                                                                        id={`damaged-${product.uniqueId}`}
                                                                        value="Damaged"
                                                                        onChange={(e) => {
                                                                            const selectedReason = e.target.value;
                                                                            setSelectedProducts((prev) =>
                                                                                prev.map((p) =>
                                                                                    p.uniqueId === product.uniqueId
                                                                                        ? { ...p, returnReason: selectedReason }
                                                                                        : p
                                                                                )
                                                                            );
                                                                        }}
                                                                    />
                                                                    <Label htmlFor={`damaged-${product.uniqueId}`} className="ms-1">
                                                                        Damaged
                                                                    </Label>
                                                                </div>
                                                                <div>
                                                                    <Input
                                                                        type="radio"
                                                                        name={`returnReason-${product.uniqueId}`}
                                                                        id={`partiallyDamaged-${product.uniqueId}`}
                                                                        value="Partially Damaged"
                                                                        onChange={(e) => {
                                                                            const selectedReason = e.target.value;
                                                                            setSelectedProducts((prev) =>
                                                                                prev.map((p) =>
                                                                                    p.uniqueId === product.uniqueId
                                                                                        ? { ...p, returnReason: selectedReason }
                                                                                        : p
                                                                                )
                                                                            );
                                                                        }}
                                                                    />
                                                                    <Label htmlFor={`partiallyDamaged-${product.uniqueId}`} className="ms-1">
                                                                        Partially Damaged
                                                                    </Label>
                                                                </div>
                                                                <div>
                                                                    <Input
                                                                        type="radio"
                                                                        name={`returnReason-${product.uniqueId}`}
                                                                        id={`usable-${product.uniqueId}`}
                                                                        value="Usable"
                                                                        onChange={(e) => {
                                                                            const selectedReason = e.target.value;
                                                                            setSelectedProducts((prev) =>
                                                                                prev.map((p) =>
                                                                                    p.uniqueId === product.uniqueId
                                                                                        ? { ...p, returnReason: selectedReason }
                                                                                        : p
                                                                                )
                                                                            );
                                                                        }}
                                                                    />
                                                                    <Label htmlFor={`usable-${product.uniqueId}`} className="ms-1">
                                                                        Usable
                                                                    </Label>
                                                                </div>
                                                                <div>
                                                                    <Input
                                                                        type="text"
                                                                        name="note"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Button
                                                                color="danger"
                                                                onClick={() =>
                                                                    setSelectedProducts((prev) =>
                                                                        prev.filter((p) => p.uniqueId !== product.uniqueId)
                                                                    )
                                                                }
                                                            >
                                                                Remove
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </Table>
                                    </div>
                                </CardBody>
                                <Button
                                    color="success"
                                    onClick={handleSaveInvoice}
                                    disabled={loading || selectedProducts.length === 0}
                                >
                                    {loading ? "Generating Invoice..." : "Generate Invoice"}
                                </Button>
                            </Card>
                        </Col>

                    </Row>
                </Container>

                <Modal isOpen={modal} toggle={toggleModal} size="lg">
                    <ModalHeader toggle={toggleModal}>Order Products</ModalHeader>
                    <ModalBody>
                        {orderProducts.length > 0 ? (
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Image</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Return Quantity</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderProducts.map((product, index) => {
                                        let quantity = 1; // Default quantity
                                        return (
                                            <tr key={product.id}>
                                                <td>{index + 1}</td>
                                                <td>{product.name} </td>
                                                <td>
                                                    <img
                                                        src={`http://localhost:8000${product.images[0]}`}
                                                        alt={product.name}
                                                        style={{
                                                            width: "50px",
                                                            height: "50px",
                                                            objectFit: "cover",
                                                            borderRadius: "5px",
                                                        }}
                                                    />
                                                </td>
                                                <td>₹{product.rate.toFixed(2)}</td>
                                                <td>{product.quantity}</td>
                                                <td>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        defaultValue="1"
                                                        onChange={(e) =>
                                                            (quantity = parseInt(e.target.value, 10) || 1)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <Button
                                                        color="primary"
                                                        onClick={() =>
                                                            handleProductSelect(product, quantity)
                                                        }
                                                    >
                                                        Add
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        ) : (
                            <p>No products found for the selected order.</p>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleModal}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </React.Fragment>
    );
};

export default FormLayouts;