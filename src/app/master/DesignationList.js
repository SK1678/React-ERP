import React, { Component } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';

export class DesignationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      editMode: false,
      designations: [
        { id: 1, name: 'Software Engineer', department: 'IT Department', status: 'Active' },
        { id: 2, name: 'Sales Manager', department: 'Sales', status: 'Active' }
      ],
      currentDesg: {
        id: '',
        name: '',
        department: '',
        isActive: true,
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString()
      }
    };
  }

  handleToggleModal = (edit = false, desg = null) => {
    if (edit && desg) {
      this.setState({ showModal: true, editMode: true, currentDesg: { ...desg } });
    } else {
      this.setState({ 
        showModal: !this.state.showModal, 
        editMode: false,
        currentDesg: {
          id: '', name: '', department: '', isActive: true,
          createdAt: new Date().toLocaleDateString(),
          updatedAt: new Date().toLocaleDateString()
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

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Designation List </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Master</a></li>
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
                      {this.state.designations.map((desg) => (
                        <tr key={desg.id}>
                          <td>{desg.id}</td>
                          <td>{desg.name}</td>
                          <td>{desg.department}</td>
                          <td>
                             <label className={`badge badge-${desg.status === 'Active' ? 'success' : 'danger'}`}>
                                {desg.status}
                             </label>
                          </td>
                          <td>
                            <button type="button" className="btn btn-outline-warning btn-sm mr-2" onClick={() => this.handleToggleModal(true, desg)}>
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
            <Modal.Title>{this.state.editMode ? 'Edit Designation' : 'Add New Designation'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-gray-dark">
            <Form>
              <Form.Group>
                <label>Designation ID (Auto)</label>
                <Form.Control type="text" disabled placeholder="System Generated" />
              </Form.Group>
              <Form.Group>
                <label>Designation Name</label>
                <Form.Control type="text" name="name" value={this.state.currentDesg.name} onChange={this.handleInputChange} placeholder="Enter Name" />
              </Form.Group>
              <Form.Group>
                <label>Department</label>
                <select className="form-control" name="department" value={this.state.currentDesg.department} onChange={this.handleInputChange}>
                  <option value="">Select Department</option>
                  <option value="IT Department">IT Department</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </Form.Group>
              <div className="form-check mt-3">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" name="isActive" checked={this.state.currentDesg.isActive} onChange={this.handleInputChange} /> Is Active <i className="input-helper"></i>
                </label>
              </div>

              <div className="row mt-4 pt-3 border-top border-secondary">
                <div className="col-6">
                  <small className="text-muted">Created: </small>
                  <span className="small font-weight-bold">{this.state.currentDesg.createdAt}</span>
                </div>
                <div className="col-6 text-right">
                  <small className="text-muted">Updated: </small>
                  <span className="small font-weight-bold">{this.state.currentDesg.updatedAt}</span>
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

export default DesignationList;
