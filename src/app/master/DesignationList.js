import React, { Component } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import ApiManager from '../services/api';

class DesignationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      editMode: false,
      loading: true,
      designations: [],
      departments: [],
      currentDesg: {
        id: '',
        name: '',
        department: '',
        isActive: true,
        createdAt: '',
        updatedAt: ''
      }
    };
  }

  componentDidMount() {
    this.fetchDesignations();
    this.fetchDepartments();
  }

  fetchDesignations = () => {
    this.setState({ loading: true });
    ApiManager.getDesignations()
      .then(data => {
        this.setState({ designations: Array.isArray(data) ? data : [], loading: false });
      })
      .catch(err => {
        console.error('Failed to fetch designations:', err);
        this.setState({ loading: false, designations: [] });
      });
  }

  fetchDepartments = () => {
    ApiManager.getDepartments()
      .then(data => {
        this.setState({ departments: Array.isArray(data) ? data : [] });
      })
      .catch(err => {
        console.error('Failed to fetch departments:', err);
        this.setState({ departments: [] });
      });
  }

  handleToggleModal = (edit = false, desg = null) => {
    if (edit && desg) {
      this.setState({
        showModal: true,
        editMode: true,
        currentDesg: {
          ...desg,
          isActive: desg.status === 'Active',
          createdAt: desg.created_at ? new Date(desg.created_at).toLocaleString() : '',
          updatedAt: desg.updated_at ? new Date(desg.updated_at).toLocaleString() : ''
        }
      });
    } else {
      this.setState({
        showModal: !this.state.showModal,
        editMode: false,
        currentDesg: {
          id: '', name: '', department: '', isActive: true, createdAt: '', updatedAt: ''
        }
      });
    }
  }

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      currentDesg: {
        ...this.state.currentDesg,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  }

  handleSave = () => {
    const { editMode, currentDesg } = this.state;

    const payload = {
      name: currentDesg.name,
      department: currentDesg.department,
      status: currentDesg.isActive ? 'Active' : 'Inactive'
    };

    if (editMode) {
      ApiManager.updateDesignation(currentDesg.id, payload)
        .then(() => {
          this.fetchDesignations();
          this.handleToggleModal();
        })
        .catch(err => console.error('Update failed:', err));
    } else {
      ApiManager.createDesignation(payload)
        .then(() => {
          this.fetchDesignations();
          this.handleToggleModal();
        })
        .catch(err => console.error('Create failed:', err));
    }
  }

  handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this designation?')) {
      ApiManager.deleteDesignation(id)
        .then(() => this.fetchDesignations())
        .catch(err => console.error('Delete failed:', err));
    }
  }

  render() {
    const { loading, designations, departments, showModal, editMode, currentDesg } = this.state;

    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Designation List </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={e => e.preventDefault()}>Master</a></li>
              <li className="breadcrumb-item active" aria-current="page">Designation</li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card" style={{ overflow: 'visible' }}>
              <div className="card-body" style={{ overflow: 'visible' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title">Manage Designations</h4>
                  <button type="button" className="btn btn-primary btn-icon-text" onClick={() => this.handleToggleModal()}>
                    <i className="mdi mdi-plus btn-icon-prepend"></i> Add New Designation
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : designations.length > 0 ? (
                        designations.map(desg => (
                          <tr key={desg.id}>
                            <td>{desg.id}</td>
                            <td>{desg.name}</td>
                            <td>{desg.department || '—'}</td>
                            <td>
                              <label className={`badge badge-${desg.status === 'Active' ? 'success' : 'danger'}`}>
                                {desg.status}
                              </label>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-outline-warning btn-sm mr-2"
                                onClick={() => this.handleToggleModal(true, desg)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => this.handleDelete(desg.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">No designations found. Click "Add New Designation" to create one.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={() => this.handleToggleModal()} centered>
          <Modal.Header closeButton className="bg-gray-dark">
            <Modal.Title>{editMode ? 'Edit Designation' : 'Add New Designation'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-gray-dark">
            <Form>
              <Form.Group>
                <label>Designation ID (Auto)</label>
                <Form.Control type="text" disabled placeholder="System Generated" />
              </Form.Group>
              <Form.Group>
                <label>Designation Name</label>
                <Form.Control
                  type="text"
                  name="name"
                  value={currentDesg.name}
                  onChange={this.handleInputChange}
                  placeholder="Enter Designation Name"
                />
              </Form.Group>
              <Form.Group>
                <label>Department</label>
                <select
                  className="form-control"
                  name="department"
                  value={currentDesg.department}
                  onChange={this.handleInputChange}
                >
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </Form.Group>
              <div className="form-check mt-3">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="isActive"
                    checked={currentDesg.isActive}
                    onChange={this.handleInputChange}
                  /> Is Active <i className="input-helper"></i>
                </label>
              </div>

              {editMode && (
                <div className="row mt-4 pt-3 border-top border-secondary">
                  <div className="col-6">
                    <small className="text-muted">Created: </small>
                    <span className="small font-weight-bold">{currentDesg.createdAt}</span>
                  </div>
                  <div className="col-6 text-right">
                    <small className="text-muted">Updated: </small>
                    <span className="small font-weight-bold">{currentDesg.updatedAt}</span>
                  </div>
                </div>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-gray-dark border-top-0">
            <Button variant="secondary" onClick={() => this.handleToggleModal()}>Cancel</Button>
            <Button variant="primary" onClick={this.handleSave}>
              {editMode ? 'Update Designation' : 'Save Designation'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default DesignationList;
