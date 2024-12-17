import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Col, Container, Row, CardBody, CardTitle, Label, Form, Input, Button, FormFeedback, FormGroup, Table } from 'reactstrap'; // Ensure Table is imported
import { FaPlus, FaTrashAlt, FaBox, FaUser } from 'react-icons/fa';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from 'react-select';

const VariantProductCreateForm = () => {
    document.title = "Beposoft | Product Variant";
    const { type, id } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [imagePreviews, setImagePreviews] = useState([]);
    const [attributeOptions, setAttributeOptions] = useState({
        names: [],
        ids: [],
        values: {}
    });
    const [formData, setFormData] = useState({
        product: '',
        attributes: [],
        managedUsers: '',
        stock: '',
        is_variant: false
    });

    const handleIsVariantChange = (e) => {
        console.log('Checkbox value:', e.target.checked);  
        setFormData({
            ...formData,
            is_variant: e.target.checked  
        });
    };

    const [error, setError] = useState(null);
    const userName = localStorage.getItem('name');


    const handleDelete = async (itemId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            try {
                await fetch(`${import.meta.env.VITE_APP_APIKEY}product/${itemId}/variant/data/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                setStockData((prevData) => prevData.filter((item) => item.id !== itemId));
                alert("Item deleted successfully.");
            } catch (error) {
                console.error("Error deleting item:", error);
                setError("An error occurred while deleting the item.");
            }
        }
    };

    const handleImageDelete = async (itemId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");
        if (confirmDelete) {
            try {
                await fetch(`${import.meta.env.VITE_APP_APIKEY}image/delete/${itemId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                setStockData((prevData) => prevData.filter((item) => item.id !== itemId));
                alert("Item deleted successfully.");
            } catch (error) {
                console.error("Error deleting item:", error);
                setError("An error occurred while deleting the item.");
            }
        }
    };


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}products/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                const data = await response.json();
                const products = Array.isArray(data) ? data : data.data || [];
                setProducts(products);

                if (id) {
                    const selectedProduct = products.find(product => product.id === parseInt(id, 10));
                    if (selectedProduct) {
                        setFormData(prevData => ({ ...prevData, product: selectedProduct.id }));
                    }
                }
            } catch (err) {
                setError(err.message || "An error occurred while fetching products");
            }
        };

        fetchProducts();
    }, [id, navigate]);

    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}product/attributes/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    const attributeNames = data.map(attr => attr.name);
                    const attributeIds = data.map(attr => attr.id);

                    setAttributeOptions({
                        names: attributeNames,
                        ids: attributeIds,
                        values: {}
                    });
                } else {
                    throw new Error("Unexpected data structure while fetching attributes");
                }
            } catch (err) {
                setError(err.message || "An error occurred while fetching attributes");
            }
        };

        fetchAttributes();
    }, [navigate]);

    const fetchAttributeValues = useCallback(async (attributeId, attributeName) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}product/attribute/${attributeId}/values/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                setAttributeOptions(prevOptions => ({
                    ...prevOptions,
                    values: {
                        ...prevOptions.values,
                        [attributeName]: data.map(item => ({ value: item.value, label: item.value }))
                    }
                }));
            } else {
                throw new Error("Unexpected data structure while fetching attribute values");
            }
        } catch (err) {
            setError(err.message || "An error occurred while fetching attribute values");
        }
    }, [navigate]);

    const [selectedImages, setSelectedImages] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setSelectedImages(prevImages => [...prevImages, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

        setSelectedImages(updatedImages);
        setImagePreviews(updatedPreviews);
    };

    const handleAttributeNameChange = async (index, selectedOption) => {
        const selectedAttributeName = selectedOption ? selectedOption.value : '';
        const attributeIndex = attributeOptions.names.indexOf(selectedAttributeName);
        const selectedAttributeId = attributeOptions.ids[attributeIndex];


        if (!selectedAttributeId) return;

        const newAttributes = [...formData.attributes];
        newAttributes[index] = {
            ...newAttributes[index],
            attribute: selectedAttributeName,
            values: []
        };
        setFormData(prevData => ({ ...prevData, attributes: newAttributes }));

        try {
            await fetchAttributeValues(selectedAttributeId, selectedAttributeName);
        } catch (err) {
        }
    };

    const handleAttributeValueChange = (index, selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        const newAttributes = [...formData.attributes];
        newAttributes[index] = {
            ...newAttributes[index],
            values: selectedValues
        };
        setFormData(prevData => ({ ...prevData, attributes: newAttributes }));
    };

    const addAttribute = () => {
        setFormData(prevData => ({
            ...prevData,
            attributes: [...prevData.attributes, { attribute: '', values: [] }]
        }));
    };

    const removeAttribute = (index) => {
        setFormData(prevData => ({
            ...prevData,
            attributes: prevData.attributes.filter((_, i) => i !== index)
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("formData:", formData);
    
        const formDataToSend = new FormData();
        formDataToSend.append('product', formData.product);
        formDataToSend.append('managedUsers', formData.managedUsers);
        formDataToSend.append('attributes', JSON.stringify(formData.attributes));
    
        // Append the actual File objects for image uploads
        selectedImages.forEach((file) => {
            formDataToSend.append('images', file);  // Append each image with the same 'images' key
        });
    
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_APIKEY}add/product/variant/`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            if (response.status === 201) {
                setSuccessMessage("Product added successfully!");
                // Fetch stock data after successful submission
                fetchStockData();
            } else {
                setErrorMessage("Failed to add product. Please try again.");
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message || "An error occurred while submitting");
            setErrorMessage("Failed to add product. Please try again.");
        }
    };
    
    // Fetch stock data function
    const fetchStockData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}products/${id}/variants/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
    
            const data = await response.json();
            setStockData(data.products); // Update the stock data state
        } catch (err) {
            setError(err.message || "An error occurred while fetching stock data");
        }
    };
    
    // UseEffect to fetch stock data when component mounts or id changes
    useEffect(() => {
        fetchStockData(); // Fetch stock data initially
    }, [id, navigate]);
    









    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Ecommerce" breadcrumbItem="Product Management" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4">Create Variant Products</CardTitle>

                                    {successMessage && (
                                        <div className="alert alert-success" role="alert">
                                            {successMessage}
                                        </div>
                                    )}

                                    <Form onSubmit={handleSubmit}>
                                        <FormGroup className="mb-3">
                                            <Label for="userName">
                                                <FaUser className="me-2" /> Managed Users
                                            </Label>
                                            <Input
                                                type="text"
                                                id="userName"
                                                name="userName"
                                                value={userName}
                                                onChange={(e) => setFormData(prevData => ({ ...prevData, userName: e.target.value }))}
                                                placeholder="e.g., User1, User2 (comma separated)"
                                            />
                                        </FormGroup>

                                        <FormGroup className="mb-3">
                                            <Label for="product">
                                                <FaBox className="me-2" /> Product
                                            </Label>
                                            <Input
                                                type="select"
                                                id="product"
                                                name="product"
                                                value={formData.product}
                                                onChange={(e) => {
                                                    setFormData(prevData => ({ ...prevData, product: e.target.value }));
                                                }}
                                            >
                                                <option value="">Select a product</option>
                                                {products.map(product => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>

                                        {type === 'variant' && (
                                            <React.Fragment>
                                                {formData.attributes.map((attr, index) => (
                                                    <FormGroup key={index} className="mb-3">
                                                        <Row form className="align-items-center">
                                                            <Col md={5}>
                                                                <Label for={`attribute-${index}`}>Attribute Name</Label>
                                                                <Select
                                                                    id={`attribute-${index}`}
                                                                    value={attr.attribute ? { value: attr.attribute, label: attr.attribute } : null}
                                                                    onChange={(option) => handleAttributeNameChange(index, option)}
                                                                    options={attributeOptions.names.map(name => ({ value: name, label: name }))}
                                                                    placeholder="Select an attribute"
                                                                />
                                                            </Col>
                                                            <Col md={5}>
                                                                <Label for={`value-${index}`}>Attribute Values</Label>
                                                                <Select
                                                                    id={`value-${index}`}
                                                                    isMulti
                                                                    value={attr.values.map(value => ({ value, label: value }))}
                                                                    onChange={(options) => handleAttributeValueChange(index, options)}
                                                                    options={attr.attribute && attributeOptions.values[attr.attribute] ? attributeOptions.values[attr.attribute] : []}
                                                                    placeholder="Select values"
                                                                    isDisabled={!attr.attribute}
                                                                />
                                                            </Col>

                                                            <Col md={2} className="d-flex justify-content-end align-items-center" style={{ height: '100%' }}>
                                                                <Button
                                                                    color="danger"
                                                                    onClick={() => removeAttribute(index)}
                                                                    outline
                                                                    className="w-100 w-sm-auto"
                                                                    style={{ padding: '8px', alignSelf: 'center' }}
                                                                >
                                                                    <FaTrashAlt /> Remove
                                                                </Button>
                                                            </Col>

                                                        </Row>
                                                    </FormGroup>
                                                ))}

                                                <Button type="button" color="primary" onClick={addAttribute} className="mb-3" outline>
                                                    <FaPlus /> Add Attribute
                                                </Button>



                                                <FormGroup className="mb-3">
                                                    <Row className="align-items-center">
                                                        <Col md={12}>
                                                            <Label check>
                                                                <Input
                                                                    type="checkbox"
                                                                    checked={formData.is_variant}  // Controlled checkbox
                                                                    onChange={handleIsVariantChange}  // Update state on change
                                                                />
                                                                Is Variant?
                                                            </Label>
                                                        </Col>
                                                    </Row>
                                                </FormGroup>


                                            </React.Fragment>
                                        )}

                                        {type !== 'variant' && (
                                            <>
                                                <FormGroup className="mb-3">
                                                    <Label for="images">
                                                        <FaUser className="me-2" /> Upload Images
                                                    </Label>
                                                    <Input
                                                        type="file"
                                                        id="images"
                                                        name="images"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        placeholder="Select images"
                                                    />
                                                </FormGroup>

                                                {selectedImages.length > 0 && (
                                                    <div className="image-preview-container" style={styles.imagePreviewContainer}>
                                                        {imagePreviews.map((previewUrl, index) => (
                                                            <div key={index} className="image-preview" style={styles.imagePreview}>
                                                                <img src={previewUrl} alt={`Preview ${index}`} style={styles.image} />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(index)}
                                                                    style={styles.removeButton}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}



                                        <div className="d-flex justify-content-start">
                                            <Button type="submit" color="success">Submit</Button>
                                        </div>

                                        {error && (
                                            <div className="mt-3">
                                                <FormFeedback type="invalid">{error}</FormFeedback>
                                            </div>
                                        )}
                                    </Form>
                                </CardBody>
                            </Card>


                            <Col xl={12}>
                                <Card>
                                    <CardBody>
                                        <div className="table-responsive">
                                            <h4 className="card-title">
                                                {type === 'variant' ? 'VARIANT ITEMS' : 'PRODUCT IMAGES'}
                                            </h4>


                                            {error && <p className="text-danger">{error}</p>}
                                            <Table className="align-middle mb-0">
                                                <thead>
                                                    {type === 'variant' ? (
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>NAME</th>
                                                            <th>IMAGE</th>
                                                            <th>STOCK</th>
                                                            <th>CREATED USER</th>
                                                            <th>DELETE</th>
                                                            <th>EDIT</th>
                                                        </tr>
                                                    ) : (
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>IMAGE</th>
                                                            <th>ACTION</th>
                                                        </tr>
                                                    )}
                                                </thead>

                                                <tbody>
                                                    {type === 'variant' ? (
                                                        (stockData && stockData.length > 0) ? (  // Ensure stockData is defined and has length
                                                            stockData.map((item, index) => (
                                                                <tr key={item.id}>
                                                                    <th scope="row">{index + 1}</th>
                                                                    <td>{item.name}</td>
                                                                    <td>
                                                                        <img src={item.variant_images[0]?.image} alt={item.name} style={{ width: '50px', height: '50px' }} />
                                                                    </td>
                                                                    <td>{item.stock}</td>
                                                                    <td>{item.created_user}</td>
                                                                    <td>
                                                                        <button type="button"
                                                                            className="btn btn-light btn-sm"
                                                                            onClick={() => handleDelete(item.id)}
                                                                        >Delete</button>
                                                                    </td>
                                                                    <td>
                                                                        <Link to={`/ecommerce/product/${item.id}/update/`}>
                                                                            <button type="button" className="btn btn-light btn-sm">Edit</button>
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="7" className="text-center">No variant items found</td>
                                                            </tr>
                                                        )
                                                    ) : (
                                                        (stockData && stockData.length > 0) ? (  
                                                            stockData.map((item, index) => (
                                                                <tr key={item.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        <img src={item.image}alt={item.name} style={{ width: '100px', height: '100px' }} />
                                                                    </td>
                                                                    <td>
                                                                        <button type="button"
                                                                            className="btn btn-light btn-sm"
                                                                            onClick={() => handleImageDelete(item.id)}
                                                                        >Delete</button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="2" className="text-center">No images available</td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>



                                            </Table>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>


    );
};

const styles = {
    imagePreviewContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'flex-start', 
        padding: '10px'
    },
    imagePreview: {
        position: 'relative',
        display: 'inline-block',
    },
    image: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    removeButton: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        backgroundColor: '#ff4d4f',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        padding: '5px 10px',
        cursor: 'pointer',
        fontSize: '12px',
    },
};

export default VariantProductCreateForm;
