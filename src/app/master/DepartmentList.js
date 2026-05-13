import React, { Component } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import ApiManager from '../services/api';

class DepartmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      editMode: false,
      loading: true,
      departments: [],
      currentDept: {
        id: '',
        name: '',
        parent: '',
        manager: '',
        isActive: true,
        createdAt: '',
        updatedAt: ''
      }
    };
  }

  componentDidMount() {
    this.fetchDepartments();
  }

  fetchDepartments = () => {
    this.setState({ loading: true });
    ApiManager.getDepartments()
      .then(data => {
        this.setState({ departments: Array.isArray(data) ? data : [], loading: false });
      })
      .catch(err => {
        console.error('Failed to fetch departments:', err);
        this.setState({ loading: false, departments: [] });
      });
  }

  handleToggleModal = (edit = false, dept = null) => {
    if (edit && dept) {
      this.setState({
        showModal: true,
        editMode: true,
        currentDept: {
          ...dept,
          isActive: dept.status === 'Active',
          createdAt: dept.created_at ? new Date(dept.created_at).toLocaleString() : '',
          updatedAt: dept.updated_at ? new Date(dept.updated_at).toLocaleString() : ''
        }
      });
    } else {
      this.setState({
        showModal: !this.state.showModal,
        editMode: false,
        currentDept: {
          id: '', name: '', parent: '', manager: '', isActive: true, createdAt: '', updatedAt: ''
        }
      });
    }
  }

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      currentDept: {
        ...this.state.currentDept,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  }

  handleSave = () => {
    const { editMode, currentDept } = this.state;

    const payload = {
      name: currentDept.name,
      parent: currentDept.parent,
      manager: currentDept.manager,
      status: currentDept.isActive ? 'Active' : 'Inactive'
    };

    if (editMode) {
      ApiManager.updateDepartment(currentDept.id, payload)
        .then(() => {
          this.fetchDepartments();
          this.handleToggleModal();
        })
        .catch(err => console.error('Update failed:', err));
    } else {
      ApiManager.createDepartment(payload)
        .then(() => {
          this.fetchDepartments();
          this.handleToggleModal();
        })
        .catch(err => console.error('Create failed:', err));
    }
  }

  handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      ApiManager.deleteDepartment(id)
        .then(() => this.fetchDepartments())
        .catch(err => console.error('Delete failed:', err));
    }
  }

  render() {
    const { loading, departments, showModal, editMode, currentDept } = this.state;

    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Department List </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={e => e.preventDefault()}>Master</a></li>
              <li className="breadcrumb-item active" aria-current="page">Department</li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card" style={{ overflow: 'visible' }}>
              <div className="card-body" style={{ overflow: 'visible' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title">Manage Departments</h4>
                  <button type="button" className="btn btn-primary btn-icon-text" onClick={() => this.handleToggleModal()}>
                    <i className="mdi mdi-plus btn-icon-prepend"></i> Add New Department
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Parent Dept</th>
                        <th>Manager</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : departments.length > 0 ? (
                        departments.map(dept => (
                          <tr key={dept.id}>
                            <td>{dept.id}</td>
                            <td>{dept.name}</td>
                            <td>{dept.parent || '—'}</td>
                            <td>{dept.manager || '—'}</td>
                            <td>
                              <label className={`badge badge-${dept.status === 'Active' ? 'success' : 'danger'}`}>
                                {dept.status}
                              </label>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-outline-warning btn-sm mr-2"
                                onClick={() => this.handleToggleModal(true, dept)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => this.handleDelete(dept.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-5 text-muted">No departments found. Click "Add New Department" to create one.</td>
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
            <Modal.Title>{editMode ? 'Edit Department' : 'Add New Department'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-gray-dark">
            <Form>
              <Form.Group>
                <label>Department ID (Auto)</label>
                <Form.Control type="text" disabled placeholder="System Generated" />
              </Form.Group>
              <Form.Group>
                <label>Department Name</label>
                <Form.Control
                  type="text"
                  name="name"
                  value={currentDept.name}
                  onChange={this.handleInputChange}
                  placeholder="Enter Department Name"
                />
              </Form.Group>
              <Form.Group>
                <label>Parent Department</label>
                <select className="form-control" name="parent" value={currentDept.parent} onChange={this.handleInputChange}>
                  <option value="">None</option>
                  {departments.filter(d => d.id !== currentDept.id).map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </Form.Group>
              <Form.Group>
                <label>Manager</label>
                <Form.Control
                  type="text"
                  name="manager"
                  value={currentDept.manager}
                  onChange={this.handleInputChange}
                  placeholder="Enter Manager Name"
                />
              </Form.Group>
              <div className="form-check mt-3">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="isActive"
                    checked={currentDept.isActive}
                    onChange={this.handleInputChange}
                  /> Is Active <i className="input-helper"></i>
                </label>
              </div>

              {editMode && (
                <div className="row mt-4 pt-3 border-top border-secondary">
                  <div className="col-6">
                    <small className="text-muted">Created: </small>
                    <span className="small font-weight-bold">{currentDept.createdAt}</span>
                  </div>
                  <div className="col-6 text-right">
                    <small className="text-muted">Updated: </small>
                    <span className="small font-weight-bold">{currentDept.updatedAt}</span>
                  </div>
                </div>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-gray-dark border-top-0">
            <Button variant="secondary" onClick={() => this.handleToggleModal()}>Cancel</Button>
            <Button variant="primary" onClick={this.handleSave}>
              {editMode ? 'Update Department' : 'Save Department'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default DepartmentList;
