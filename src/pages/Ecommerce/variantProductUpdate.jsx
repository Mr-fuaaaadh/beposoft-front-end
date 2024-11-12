import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    Button,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";

const VariantProductData = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [fetchedImages, setFetchedImages] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [attributeValues, setAttributeValues] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentSize, setCurrentSize] = useState({ id: '', attribute: '', stock: '' });
    const [error, setError] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();
    const create_user = localStorage.getItem("name");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (id) {
            fetchData(); // Fetch product data
            fetchAttributes(); // Fetch attributes data
            fetchSizes(); // Fetch initial sizes data
        }
    }, [id]);

    // Formik form initialization
    const formik = useFormik({
        initialValues: {
            name: "",
            stock: "",
            color: "",
            is_variant: false,
            attribute: "",
            size: [],
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required("This field is required"),
            color: Yup.string().required("This field is required"),
            is_variant: Yup.boolean(),
            attribute: Yup.string().when("is_variant", {
                is: true,
                then: (schema) => schema.required("This field is required"),
                otherwise: (schema) => schema.notRequired(),
            }),
            size: Yup.array().when("is_variant", {
                is: true,
                then: (schema) => schema.min(1, "Please select at least one size").required("This field is required"),
                otherwise: (schema) => schema.notRequired(),
            }),
        }),
        onSubmit: async (values) => {
            try {
                const apiUrl = `${import.meta.env.VITE_APP_APIKEY}product/${id}/variant/data/`;
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("stock", values.stock);
                formData.append("color", values.color);
                formData.append("is_variant", values.is_variant ? "true" : "false");
                formData.append("attribute", values.attribute);
                values.size.forEach((size) => formData.append("size", size));
                selectedImages.forEach((image) => formData.append("images", image));

                const response = await fetch(apiUrl, {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });

                if (response.ok) {
                    const newSizes = values.size.map((size) => ({
                        attribute: size,
                        stock: values.stock,
                        id: Math.random().toString(36).substr(2, 9), // Assign a temporary ID for local state
                    }));

                    // Optimistically update sizes
                    setSizes((prevSizes) => [...prevSizes, ...newSizes]);
                    await fetchSizes();

                    formik.resetForm();
                    setSelectedImages([]);
                } else {
                    const errorData = await response.json();
                    alert(`Failed to update product variant: ${errorData.message || "Unknown error"}`);
                }
            } catch (error) {
                alert("An error occurred while updating the product variant.");
            }
        }

    });

    // Fetch product data
    const fetchData = async () => {
        try {
            const apiUrl = `${import.meta.env.VITE_APP_APIKEY}product/${id}/variant/data/`;
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const result = await response.json();
            const productData = result.data;

            // Update form values directly
            formik.setValues({
                name: productData?.name || "",
                stock: productData?.stock || "",
                color: productData?.color || "",
                is_variant: productData?.is_variant || false,
                attribute: productData?.attribute || "",
                size: productData?.size || [],
            });

            const imagesResponse = await fetch(`${import.meta.env.VITE_APP_APIKEY}variant/${id}/images/`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!imagesResponse.ok) throw new Error("Network response was not ok");

            const resultImages = await imagesResponse.json();
            setFetchedImages(resultImages.images);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Fetch attributes
    const fetchAttributes = async () => {
        try {
            const attributesUrl = `${import.meta.env.VITE_APP_APIKEY}product/attributes/`;
            const response = await fetch(attributesUrl, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (!response.ok) throw new Error("Failed to fetch attributes");

            const attributesData = await response.json();
            setAttributes(attributesData);
        } catch (error) {
            console.error("Error fetching attributes:", error);
            setError(error.message);
        }
    };

    const fetchSizes = async () => {
        try {
            const sizeUrl = `${import.meta.env.VITE_APP_APIKEY}variant/product/${id}/size/view/`;
            const response = await fetch(sizeUrl, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (!response.ok) throw new Error("Failed to fetch sizes");

            const sizeData = await response.json();
            setSizes(sizeData.data); // Update the sizes state with new data
        } catch (error) {
            console.error("Error fetching sizes:", error);
            setError(error.message);
        }
    };

    // Fetch attribute values
    const fetchAttributeValues = useCallback(async (attributeId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}product/attribute/${attributeId}/values/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (!response.ok) throw new Error("Failed to fetch attribute values");

            const data = await response.json();
            setAttributeValues(data);
        } catch (error) {
            console.error("Error fetching attribute values:", error);
            setError(error.message);
        }
    }, [navigate, token]);

    // Image selection handler
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages((prevImages) => [...prevImages, ...files]);
    };

    // Remove selected image from preview
    const removeImage = (indexToRemove) => {
        setSelectedImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
    };

    // Remove images from backend
    const removeImages = async (index, imageId) => {
        const apiUrl = `${import.meta.env.VITE_APP_APIKEY}variant/${imageId}/delete/`;
        try {
            const response = await fetch(apiUrl, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Error deleting image");

            setFetchedImages((prevImages) => prevImages.filter((_, i) => i !== index));
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    const removesize = async (index, sizeId) => {
        const apiUrl = `${import.meta.env.VITE_APP_APIKEY}variant/product/${sizeId}/size/edit/`;
        try {
            const response = await fetch(apiUrl, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Error deleting size");
            }

            setSizes((prevSizes) => prevSizes.filter((_, i) => i !== index)); // Optimistically update UI
        } catch (error) {
            console.error("Error deleting size:", error);
            alert(`An error occurred while deleting the size: ${error.message}`);
        }
    };





    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleEditClick = (size) => {
        setCurrentSize(size);
        toggleModal();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentSize((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        const apiUrl = `${import.meta.env.VITE_APP_APIKEY}variant/product/${currentSize.id}/size/edit/`;
        try {
            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentSize),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Error updating size");
            }

            const updatedSizes = sizes.map((size) =>
                size.id === currentSize.id ? { ...size, ...currentSize } : size
            );
            setSizes(updatedSizes);
            toggleModal();
        } catch (error) {
            console.error("Error updating size:", error);
            alert(`An error occurred while updating the size: ${error.message}`);
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4">Update Product Variant</CardTitle>
                                    <Form onSubmit={formik.handleSubmit}>
                                        <div className="mb-3">
                                            <Label htmlFor="formrow-created-user">Created User</Label>
                                            <Input
                                                type="text"
                                                name="created_user"
                                                className="form-control"
                                                value={create_user || ""}
                                                disabled
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <Label htmlFor="formrow-name-Input">Name</Label>
                                            <Input
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                placeholder="Enter Product Name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.name && !!formik.errors.name}
                                            />
                                            {formik.touched.name && formik.errors.name && (
                                                <FormFeedback>{formik.errors.name}</FormFeedback>
                                            )}
                                        </div>

                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-color-Input">Color</Label>
                                                    <Input
                                                        type="text"
                                                        name="color"
                                                        className="form-control"
                                                        placeholder="Enter Color"
                                                        value={formik.values.color}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.color && !!formik.errors.color}
                                                    />
                                                    {formik.touched.color && formik.errors.color && (
                                                        <FormFeedback>{formik.errors.color}</FormFeedback>
                                                    )}
                                                </div>
                                            </Col>
                                            {!formik.values.is_variant && (
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="formrow-stock-Input">Stock</Label>
                                                        <Input
                                                            type="number"
                                                            name="stock"
                                                            className="form-control"
                                                            placeholder="Enter Stock"
                                                            value={formik.values.stock}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            invalid={formik.touched.stock && !!formik.errors.stock}
                                                        />
                                                        {formik.touched.stock && formik.errors.stock && (
                                                            <FormFeedback>{formik.errors.stock}</FormFeedback>
                                                        )}
                                                    </div>
                                                </Col>
                                            )}
                                        </Row>

                                        <div className="mb-3">
                                            <Label htmlFor="formrow-customis_variant">Is Variant</Label>
                                            <Input
                                                type="select"
                                                name="is_variant"
                                                value={formik.values.is_variant ? "true" : "false"}
                                                onChange={(e) =>
                                                    formik.setFieldValue("is_variant", e.target.value === "true")
                                                }
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.is_variant && !!formik.errors.is_variant}
                                            >
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </Input>
                                            {formik.touched.is_variant && formik.errors.is_variant && (
                                                <FormFeedback>{formik.errors.is_variant}</FormFeedback>
                                            )}
                                        </div>

                                        {formik.values.is_variant && (
                                            <>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-attribute-Input">Attribute</Label>
                                                    <Input
                                                        type="select"
                                                        name="attribute"
                                                        className="form-control"
                                                        value={formik.values.attribute}
                                                        onChange={(e) => {
                                                            formik.handleChange(e);
                                                            fetchAttributeValues(e.target.value);
                                                        }}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.attribute && !!formik.errors.attribute}
                                                    >
                                                        <option value="">Select an Attribute</option>
                                                        {attributes.map((attr) => (
                                                            <option key={attr.id} value={attr.id}>
                                                                {attr.name}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                    {formik.touched.attribute && formik.errors.attribute && (
                                                        <FormFeedback>{formik.errors.attribute}</FormFeedback>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="formrow-size-Input">Size</Label>
                                                    <Input
                                                        type="select"
                                                        name="size"
                                                        multiple
                                                        className="form-control"
                                                        value={formik.values.size}
                                                        onChange={(e) =>
                                                            formik.setFieldValue(
                                                                "size",
                                                                Array.from(e.target.selectedOptions, (option) => option.value)
                                                            )
                                                        }
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.size && !!formik.errors.size}
                                                    >
                                                        {attributeValues.map((size) => (
                                                            <option key={size.id} value={size.value}>
                                                                {size.value}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                    {formik.touched.size && formik.errors.size && (
                                                        <FormFeedback>{formik.errors.size}</FormFeedback>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        <div className="mb-3">
                                            <Label htmlFor="formrow-images-Input">Upload Images</Label>
                                            <Input type="file" multiple className="form-control" onChange={handleImageChange} />
                                        </div>

                                        <Row>
                                            {selectedImages.map((image, index) => (
                                                <Col md={1} key={index} className="mb-3">
                                                    <div className="image-preview">
                                                        <img
                                                            src={URL.createObjectURL(image)}
                                                            alt={`preview-${index}`}
                                                            className="img-fluid"
                                                        />
                                                        <Button
                                                            color="danger"
                                                            size="sm"
                                                            className="mt-2"
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>

                                        <div className="mt-4">
                                            <Button type="submit" color="primary">
                                                Submit
                                            </Button>
                                        </div>
                                    </Form>
                                </CardBody>

                                {/* Fetched Images Table */}
                                <Row>
                                    <Col md={6}>
                                        <Table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Image</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fetchedImages.map((image, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img
                                                                src={`http://localhost:8000${image.image}`}
                                                                alt={`Image ${index + 1}`}
                                                                style={{ width: "50px", height: "50px", marginRight: "10px" }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Button color="danger" size="sm" onClick={() => removeImages(index, image.id)}>
                                                                Remove
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Col>
                                    {formik.values.is_variant && (
                                        <Col md={6}>
                                            <Table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>SIZE</th>
                                                        <th>STOCK</th>
                                                        <th>DELETE</th>
                                                        <th>UPDATE</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sizes.map((size, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{size.attribute}</td>
                                                            <td>{size.stock}</td>
                                                            <td>
                                                                <Button color="danger" size="sm" onClick={() => removesize(index, size.id)}>
                                                                    Remove
                                                                </Button>
                                                            </td>
                                                            <td>
                                                                <Button color="warning" size="sm" onClick={() => handleEditClick(size)}>
                                                                    Update
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>


                                            <Modal isOpen={modalOpen} toggle={toggleModal}>
                                                <ModalHeader toggle={toggleModal}>Edit Size</ModalHeader>
                                                <ModalBody>
                                                    <Input
                                                        type="text"
                                                        name="attribute"
                                                        value={currentSize.attribute}
                                                        onChange={handleInputChange}
                                                        placeholder="Size"
                                                    />
                                                    <Input
                                                        type="number"
                                                        name="stock"
                                                        value={currentSize.stock}
                                                        onChange={handleInputChange}
                                                        placeholder="Stock"
                                                        className="mt-2"
                                                    />
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="primary" onClick={handleUpdate}>Update</Button>
                                                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                                                </ModalFooter>
                                            </Modal>
                                        </Col>
                                    )}
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default VariantProductData;
