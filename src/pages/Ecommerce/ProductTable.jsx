import React, { useEffect, useState } from "react";
import axios from 'axios'; // Import axios
import { Table, Row, Col, Card, CardBody, CardTitle, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledTooltip, Input, Button } from "reactstrap";
import { FaSearch } from 'react-icons/fa'; // Import search icon from react-icons
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from 'react-router-dom';

const truncateText = (text, length) => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

const BasicTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_APP_APIKEY}products/`, {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data && Array.isArray(data.data)) {
          setProducts(data.data);
          setFilteredProducts(data.data); // Initialize filtered products
        } else {
          setError("No data found or unexpected response structure");
        }

        setLoading(false);
      } catch (err) {
        setError(err.message || "Unknown error occurred");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, navigate]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setFilteredProducts(products);
  };

  const handleAddProduct = () => {
    // Navigate to the add product page or open a modal
    navigate('/ecommerce-add-product'); // Example navigation
  };

  const handleProductClick = (productId, productType) => {
    // Navigate to the product detail page with ID and type in the URL
    navigate(`/ecommerce-product-variant/${productId}/${productType}/`);
  };

  const onClickDelete = async (productId) => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.delete(`${import.meta.env.VITE_APP_APIKEY}product/delete/${productId}/`, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // Successfully deleted
        setProducts(products.filter(product => product.id !== productId));
        setFilteredProducts(filteredProducts.filter(product => product.id !== productId));
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  document.title = "Product Tables | Beposoft";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Tables" breadcrumbItem="Product Tables" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col md={8}>
                      <div className="hstack gap-3">
                        <Input
                          className="form-control me-auto"
                          type="text"
                          placeholder="Search products..."
                          aria-label="Search products"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                        <Button color="secondary" onClick={handleSearchSubmit}>
                          <FaSearch />
                        </Button>
                        <div className="vr"></div>
                        <Button color="outline-danger" onClick={handleResetSearch}>
                          Reset
                        </Button>
                      </div>
                    </Col>
                    <Col md={4} className="text-end">
                      <Button color="primary" onClick={handleAddProduct}>
                        Add Product
                      </Button>
                    </Col>
                  </Row>
                  <CardTitle className="h4">Product Table</CardTitle>
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p className="text-danger">Error: {error}</p>
                  ) : (
                    <div className="table-responsive">
                      <Table className="table mb-0">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>HSN CODE</th>
                            <th>TYPE</th>
                            <th>UNIT</th>
                            <th>PURCHASE RATE</th>
                            <th>TAX %</th>
                            <th>EXCLUDED PRICE</th>
                            <th>SELLING PRICE</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                              <tr key={product.id}>
                                <th scope="row">{index + 1}</th>
                                <td style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleProductClick(product.id, product.type)}>
                                  {truncateText(product.name, 30)}
                                </td>
                                <td style={{ textAlign: 'center' }}>{product.hsn_code}</td>
                                <td style={{ textAlign: 'center' }}>{product.type}</td>
                                <td style={{ textAlign: 'center' }}>{product.unit}</td>
                                <td style={{ textAlign: 'center' }}>{product.purchase_rate}</td>
                                <td style={{ textAlign: 'center' }}>{product.tax}%</td>
                                <td style={{ textAlign: 'center' }}>{Math.floor(product.exclude_price)}</td>
                                <td style={{ textAlign: 'center' }}>{product.selling_price}</td>
                                <td style={{ textAlign: 'center' }}>
                                  <UncontrolledDropdown>
                                    <DropdownToggle tag="a" className="card-drop">
                                      <i className="mdi mdi-dots-horizontal font-size-18"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-end">
                                      <DropdownItem
                                        onClick={() => handleCustomerClick(product)}
                                      >
                                        <i className="mdi mdi-pencil font-size-16 text-success me-1" id={`edittooltip-${product.id}`}></i>
                                        Edit
                                        <UncontrolledTooltip placement="top" target={`edittooltip-${product.id}`}>
                                          Edit
                                        </UncontrolledTooltip>
                                      </DropdownItem>
                                      <DropdownItem
                                        onClick={() => onClickDelete(product.id)}
                                      >
                                        <i className="mdi mdi-trash-can font-size-16 text-danger me-1" id={`deletetooltip-${product.id}`}></i>
                                        Delete
                                        <UncontrolledTooltip placement="top" target={`deletetooltip-${product.id}`}>
                                          Delete
                                        </UncontrolledTooltip>
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="10">No products available</td>
                            </tr>
                          )}
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
