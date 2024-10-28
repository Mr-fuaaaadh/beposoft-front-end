import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import axios from 'axios';
import {
    Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label, Form
} from "reactstrap";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons for edit and delete

// Import components
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/TableContainer';

const DatatableTables = () => {
    const [data, setData] = useState([]); 
    const [departments, setDepartments] = useState([]); // New state for departments
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [selectedCustomer, setSelectedCustomer] = useState(null); 
    const [modal, setModal] = useState(false); 
    const token = localStorage.getItem('token');

    const toggleModal = () => setModal(!modal); 

    const columns = useMemo(
        () => [
            {
                header: () => <div style={{ textAlign: 'center' }}>ID</div>,  // Center alignment for header
                accessorKey: 'id',
                enableColumnFilter: false,
                enableSorting: true,
                cell: ({ row }) => (
                    <div style={{ textAlign: 'center' }}>{row.original.id}</div> // Center alignment for ID value
                ),
            },
            
            {
                header: () => <div style={{ textAlign: 'center' }}>NAME</div>,
                accessorKey: 'name',
                enableColumnFilter: false,
                enableSorting: true,
                cell: ({ row }) => (
                    <div style={{ textAlign: 'center' }}>{row.original.name}</div> // Center alignment for Name
                ),
            },
            {
                header: () => <div style={{ textAlign: 'center' }}>DEPARTMENT</div>,
                accessorKey: 'department',
                enableColumnFilter: false,
                enableSorting: true,
                cell: ({ row }) => (
                    <div style={{ textAlign: 'center' }}>{row.original.department}</div> // Center alignment for Department
                ),
            },
            {
                header: () => <div style={{ textAlign: 'center' }}>EDIT</div>,
                accessorKey: 'editActions',
                enableColumnFilter: false,
                enableSorting: false,
                cell: ({ row }) => (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                            className="btn btn-primary d-flex align-items-center"
                            style={{ height: '30px', padding: '0 10px' }}
                            onClick={() => handleEdit(row.original)}
                        >
                            <FaEdit style={{ marginRight: '5px' }} />
                            Edit
                        </button>
                    </div>
                ),
            },
            {
                header: () => <div style={{ textAlign: 'center' }}>DELETE</div>,
                accessorKey: 'deleteActions',
                enableColumnFilter: false,
                enableSorting: false,
                cell: ({ row }) => (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                            className="btn btn-danger d-flex align-items-center"
                            style={{ height: '30px', padding: '0 10px' }}
                            onClick={() => handleDelete(row.original.id)}
                        >
                            <FaTrash style={{ marginRight: '5px' }} />
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        toggleModal(); 
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_APP_APIKEY}supervisor/update/${id}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setData(data.filter(customer => customer.id !== id)); 
        } catch (error) {
            console.error("Delete failed:", error);
            setError(error.message || "Failed to delete customer");
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_APP_APIKEY}supervisor/update/${selectedCustomer.id}/`, selectedCustomer, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setData(data.map(customer => customer.id === selectedCustomer.id ? selectedCustomer : customer)); 
            toggleModal(); 
        } catch (error) {
            console.error("Update failed:", error);
            setError(error.message || "Failed to update customer");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_APIKEY}supervisors/`, {headers: {'Authorization': `Bearer ${token}`}}); 
                if (response.status === 200) {
                    setData(response.data.data); 
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                setError(error.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_APIKEY}departments/`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (response.status === 200) {
                    setDepartments(response.data.data); // Set the department data
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                setError(error.message || "Failed to fetch departments");
            }
        };

        fetchData();
        fetchDepartments();
    }, [token]);

    document.title = "Supervisors | Beposoft";

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Tables" breadcrumbItem="Customers Information" />
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-danger">Error: {error}</p>
                ) : (
                    <TableContainer
                        columns={columns}
                        data={data || []}
                        isGlobalFilter={true}
                        isPagination={true}
                        SearchPlaceholder="Search by Name, Department, or Designation..."
                        pagination="pagination"
                        paginationWrapper='dataTables_paginate paging_simple_numbers'
                        tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                    />
                )}

                {/* Modal for editing */}
                <Modal isOpen={modal} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>Edit Customer</ModalHeader>
                    <ModalBody>
                        <Form>
                            <Label for="name">Name</Label>
                            <Input 
                                id="name" 
                                name="name" 
                                value={selectedCustomer?.name || ''} 
                                onChange={handleInputChange}
                            />
                            <Label for="department">Department</Label>
                            <Input 
                                id="department" 
                                name="department" 
                                type="select" // Change to select type for dropdown
                                value={selectedCustomer?.department || ''} 
                                onChange={handleInputChange}
                            >
                                <option value="">Select Department</option> {/* Placeholder option */}
                                {departments.map(department => (
                                    <option key={department.id} value={department.id}>{department.name}</option>
                                ))}
                            </Input>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                        <Button color="primary" onClick={handleSubmit}>Save</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
};

DatatableTables.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
};

export default DatatableTables;
