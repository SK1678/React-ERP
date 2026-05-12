import React, { Component } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';

export class DepartmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      editMode: false,
      departments: [
        { id: 1, name: 'IT Department', parent: 'None', manager: 'Henry Klein', status: 'Active' },
        { id: 2, name: 'Software Development', parent: 'IT Department', manager: 'Lucy Abbott', status: 'Active' }
      ],
      currentDept: {
        id: '',
        name: '',
        parent: '',
        manager: '',
        isActive: true,
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString()
      }
    };
  }

  handleToggleModal = (edit = false, dept = null) => {
    if (edit && dept) {
      this.setState({ showModal: true, editMode: true, currentDept: { ...dept } });
    } else {
      this.setState({ 
        showModal: !this.state.showModal, 
        editMode: false,
        currentDept: {
          id: '', name: '', parent: '', manager: '', isActive: true,
          createdAt: new Date().toLocaleDateString(),
          updatedAt: new Date().toLocaleDateString()
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

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Department List </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Master</a></li>
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
                      {this.state.departments.map((dept) => (
                        <tr key={dept.id}>
                          <td>{dept.id}</td>
                          <td>{dept.name}</td>
                          <td>{dept.parent}</td>
                          <td>{dept.manager}</td>
                          <td>
                             <label className={`badge badge-${dept.status === 'Active' ? 'success' : 'danger'}`}>
                                {dept.status}
                             </label>
                          </td>
                          <td>
                            <button type="button" className="btn btn-outline-warning btn-sm mr-2" onClick={() => this.handleToggleModal(true, dept)}>
                              Edit
                            </button>
                            <button type="button" className="btn btn-outline-danger btn-sm">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <Modal show={this.state.showModal} onHide={() => this.handleToggleModal()} centered>
          <Modal.Header closeButton className="bg-gray-dark">
            <Modal.Title>{this.state.editMode ? 'Edit Department' : 'Add New Department'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-gray-dark">
            <Form>
              <Form.Group>
                <label>Department ID (Auto)</label>
                <Form.Control type="text" disabled placeholder="System Generated" />
              </Form.Group>
              <Form.Group>
                <label>Department Name</label>
                <Form.Control type="text" name="name" value={this.state.currentDept.name} onChange={this.handleInputChange} placeholder="Enter Name" />
              </Form.Group>
              <Form.Group>
                <label>Parent Department</label>
                <select className="form-control" name="parent" value={this.state.currentDept.parent} onChange={this.handleInputChange}>
                  <option value="">None</option>
                  {this.state.departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </Form.Group>
              <Form.Group>
                <label>Manager</label>
                <select className="form-control" name="manager" value={this.state.currentDept.manager} onChange={this.handleInputChange}>
                  <option value="">Select Manager</option>
                  <option value="Henry Klein">Henry Klein</option>
                  <option value="Lucy Abbott">Lucy Abbott</option>
                  <option value="Peter Gill">Peter Gill</option>
                </select>
              </Form.Group>
              <div className="form-check mt-3">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" name="isActive" checked={this.state.currentDept.isActive} onChange={this.handleInputChange} /> Is Active <i className="input-helper"></i>
                </label>
              </div>

              <div className="row mt-4 pt-3 border-top border-secondary">
                <div className="col-6">
                  <small className="text-muted">Created: </small>
                  <span className="small font-weight-bold">{this.state.currentDept.createdAt}</span>
                </div>
                <div className="col-6 text-right">
                  <small className="text-muted">Updated: </small>
                  <span className="small font-weight-bold">{this.state.currentDept.updatedAt}</span>
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-gray-dark border-top-0">
            <Button variant="secondary" onClick={() => this.handleToggleModal()}>Cancel</Button>
            <Button variant="primary" onClick={() => this.handleToggleModal()}>Save</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default DepartmentList;
