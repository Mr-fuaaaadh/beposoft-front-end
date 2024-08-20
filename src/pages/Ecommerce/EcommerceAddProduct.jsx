import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardTitle, Col, Container, Form, Input, Label, Row, FormFeedback } from "reactstrap";
import Dropzone from "react-dropzone";
import * as yup from "yup";
import { useFormik } from "formik";
import Select from "react-select";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios"; // Ensure axios is imported

const EcommerenceAddProduct = () => {
  document.title = "Add Product | Skote - Vite React Admin & Dashboard Template";

  const [selectedFiles, setselectedFiles] = useState([]);
  const [productFamilies, setProductFamilies] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProductFamilies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_APIKEY}familys/`, {
          headers: {
            'Authorization': `${token}`,
          },
        });
        setProductFamilies(response.data.data); // Adjust based on actual response structure
      } catch (error) {
        console.error('Error fetching product families:', error);
      }
    };

    fetchProductFamilies();
  }, [token]);

  const UNIT_TYPES = [
    { value: 'NOS', label: 'NOS' },
    { value: 'PRS', label: 'PRS' },
    { value: 'BOX', label: 'BOX' },
    { value: 'SET', label: 'SET' },
    { value: 'SET OF 12', label: 'SET OF 12' },
    { value: 'SET OF 16', label: 'SET OF 16' },
    { value: 'SET OF 6', label: 'SET OF 6' },
    { value: 'SET OF 8', label: 'SET OF 8' },
  ];

  const types = [
    { value: 'single', label: 'single' },
    { value: 'variant', label: 'variant' },
  ];

  const handleAcceptedFiles = (files) => {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );

    setselectedFiles(files);
  };

  // const formatBytes = (bytes, decimals = 2) => {
  //   if (bytes === 0) return "0 Bytes";
  //   const k = 1024;
  //   const dm = decimals < 0 ? 0 : decimals;
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + types[i];
  // };

  const formik = useFormik({
    initialValues: {
      name: '',
      hsn_code: '',
      family: [],
      purchase_rate: '',
      type: '',
      tax: '',
      unit:"",
      selling_price: '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Please Enter Your Product Name'),
      hsn_code: yup.string().required('Please Enter Your Manufacturer Name'),
      family: yup.array().min(1, 'Please select at least one Feature'),
      purchase_rate: yup.number().required('Please Enter Your purchase_rate'),
      type: yup.string().required('Please Enter Your type'),
      tax: yup.string().required('Please Enter Your Product Tax'),
      unit: yup.string().required('Please Enter Your Product unit'),
      selling_price: yup.string().required('Please Enter Your selling_price'),

    }),
    onSubmit: async (values) => {
      console.log('Submitting values:', values);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_APIKEY}add/product/`,
          values,
          {
            headers: {
              'Authorization': `${token}`,
            },
          }
        );
        console.log('Product added successfully:', response.data);

        formik.resetForm();
      } catch (error) {
        console.error('Error adding product:', error);
      }
      console.log(values)
    },
  });

  const metaData = useFormik({
    initialValues: {
      name: '',
      hsn_code: '',
      selling_price: ''
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Please Enter Your Product Name'),
      hsn_code: yup.string().required('Please Enter Your HSN Code'),
      selling_price: yup.string().required('Please Enter Your Selling price')
    }),
    onSubmit: (values) => {
      metaData.resetForm();
    },
  });

  console.log("Formik Touched:", formik.touched);
  console.log("Formik Errors:", formik.errors);



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Ecommerce" breadcrumbItem="Add Product" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Basic Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill all information below
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="name">Product Name</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Product Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.name && formik.errors.name ? true : false
                            }
                          />
                          {formik.errors.name && formik.touched.name ? (
                            <FormFeedback type="invalid">{formik.errors.name}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="hsn_code">HSN CODE</Label>
                          <Input
                            id="hsn_code"
                            name="hsn_code"
                            type="text"
                            placeholder="HSN CODE"
                            value={formik.values.hsn_code}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.hsn_code && formik.errors.hsn_code ? true : false
                            }
                          />
                          {formik.errors.hsn_code && formik.touched.hsn_code ? (
                            <FormFeedback type="invalid">{formik.errors.hsn_code}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="purchase_rate">Purchase Rate</Label>
                          <Input
                            id="purchase_rate"
                            name="purchase_rate"
                            type="number"
                            placeholder="Purchase Rate"
                            value={formik.values.purchase_rate}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.purchase_rate && formik.errors.purchase_rate ? true : false
                            }
                          />
                          {formik.errors.purchase_rate && formik.touched.purchase_rate ? (
                            <FormFeedback type="invalid">{formik.errors.purchase_rate}</FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="tax">Tax</Label>
                          <Input
                            id="tax"
                            name="tax"
                            type="number"
                            placeholder="Tax"
                            value={formik.values.tax}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.tax && formik.errors.tax ? true : false
                            }
                          />
                          {formik.errors.tax && formik.touched.tax ? (
                            <FormFeedback type="invalid">{formik.errors.tax}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <div className="control-label" style={{ marginBottom: "0.5rem" }}>Unit Type</div>
                          <Select
                            name="unit"
                            options={UNIT_TYPES}
                            className="select2"
                            value={UNIT_TYPES.find((option) => option.value === formik.values.unit)}
                            onChange={(selectedOption) => formik.setFieldValue("unit", selectedOption.value)}
                          />
                          {formik.errors.type && formik.touched.type ? (
                            <span className="text-danger">{formik.errors.type}</span>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <div className="control-label" style={{ marginBottom: "0.5rem" }}>Product Type</div>
                          <Select
                            name="size"
                            options={types}
                            className="select2"
                            value={types.find((option) => option.value === formik.values.size)}
                            onChange={(selectedOption) => formik.setFieldValue("type", selectedOption.value)}
                          />
                          {formik.errors.size && formik.touched.size ? (
                            <span className="text-danger">{formik.errors.size}</span>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <div className="control-label" style={{ marginBottom: "0.5rem" }}>Product Family</div>
                          <Select
                            classNamePrefix="select2-selection"
                            name="family"
                            placeholder="Choose..."
                            options={productFamilies.map(family => ({
                              value: family.id,
                              label: family.name
                            }))}
                            isMulti
                            value={productFamilies.filter(family =>
                              formik.values.family.includes(family.id)
                            ).map(family => ({
                              value: family.id,
                              label: family.name
                            }))}
                            onChange={selectedOptions =>
                              formik.setFieldValue(
                                "family",
                                selectedOptions.map(option => option.value)
                              )
                            }
                          />
                          {formik.errors.family && formik.touched.family ? (
                            <span className="text-danger">{formik.errors.family}</span>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="selling_price">Selling Price</Label>
                          <Input
                            id="selling_price"
                            name="selling_price"
                            type="number"
                            placeholder="Selling Price"
                            value={formik.values.selling_price}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.selling_price && formik.errors.selling_price ? true : false
                            }
                          />
                          {formik.errors.selling_price && formik.touched.selling_price ? (
                            <FormFeedback type="invalid">{formik.errors.selling_price}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary">Save Changes</Button>
                      <Button type="button" color="secondary" onClick={() => formik.resetForm()}>Cancel</Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle className="mb-3">Product Images</CardTitle>
                  <Form>
                    <Dropzone
                      onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles)}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone">
                          <div
                            className="dz-message needsclick"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <div className="dz-message needsclick">
                              <div className="mb-3">
                                <i className="display-4 text-muted bx bxs-cloud-upload" />
                              </div>
                              <h4>Drop files here or click to upload.</h4>
                            </div>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <ul className="list-unstyled mb-0" id="file-previews">
                      {selectedFiles.map((file, index) => (
                        <li className="mt-2 dz-image-preview" key={index}>
                          <div className="border rounded">
                            <div className="d-flex flex-wrap gap-2 p-2">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm bg-light rounded p-2">
                                  <img
                                    data-dz-thumbnail=""
                                    className="img-fluid rounded d-block"
                                    src={file.preview}
                                    alt={file.name}
                                  />
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <div className="pt-1">
                                  <h5 className="fs-md mb-1" data-dz-name>{file.path}</h5>
                                  <strong className="error text-danger" data-dz-errormessage></strong>
                                </div>
                              </div>
                              <div className="flex-shrink-0 ms-3">
                                <Button color="danger" size="sm" onClick={() => {
                                  const newImages = [...selectedFiles];
                                  newImages.splice(index, 1);
                                  setselectedFiles(newImages);
                                }}>
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Form>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle tag="h4">Meta Data</CardTitle>
                  <p className="card-title-desc mb-3">
                    Fill all information below
                  </p>

                  <Form onSubmit={metaData.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm={6}>
                        <div className="mb-3">
                          <Label htmlFor="metatitle">Meta title</Label>
                          <Input
                            id="metatitle"
                            name="name"
                            type="text"
                            placeholder="Meta title"
                            value={metaData.values.name}
                            onChange={metaData.handleChange}
                            invalid={
                              metaData.touched.name && metaData.errors.name ? true : false
                            }
                          />
                          {metaData.errors.name && metaData.touched.name ? (
                            <FormFeedback type="invalid">{metaData.errors.name}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="metakeywords">Meta Keywords</Label>
                          <Input
                            id="metakeywords"
                            name="hsn_code"
                            type="text"
                            placeholder="Meta Keywords"
                            value={metaData.values.hsn_code}
                            onChange={metaData.handleChange}
                            invalid={
                              metaData.touched.hsn_code && metaData.errors.hsn_code ? true : false
                            }
                          />
                          {metaData.errors.hsn_code && metaData.touched.hsn_code ? (
                            <FormFeedback type="invalid">{metaData.errors.hsn_code}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col sm={6}>
                        <div className="mb-3">
                          <Label htmlFor="metadescription">Meta Description</Label>
                          <Input
                            name="metadescription"
                            tag="textarea"
                            id="metadescription"
                            rows={5}
                            placeholder="Meta Description"
                            value={metaData.values.metadescription}
                            onChange={metaData.handleChange}
                            invalid={
                              metaData.touched.metadescription && metaData.errors.metadescription ? true : false
                            }
                          />
                          {metaData.errors.metadescription && metaData.touched.metadescription ? (
                            <FormFeedback type="invalid">{metaData.errors.metadescription}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" className="waves-effect waves-light" color="primary">Save Changes</Button>
                      <Button type="button" className="waves-effect waves-light" color="secondary" onClick={() => metaData.resetForm()}>Cancel</Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default EcommerenceAddProduct;
