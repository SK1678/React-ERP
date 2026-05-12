import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

export class RegisterUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        userId: 'USER-' + Math.floor(1000 + Math.random() * 9000), // Mock auto-gen ID
        name: '',
        phone: '',
        department: '',
        designation: '',
        officeLocation: '',
        email: '',
        password: '',
        isActive: true,
        photo: null,
        photoPreview: null,
        creationDate: new Date().toLocaleDateString(),
        updateDate: new Date().toLocaleDateString()
      },
      stores: [],
      permissions: []
    };
  }

  handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          userData: {
            ...this.state.userData,
            photo: file,
            photoPreview: reader.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }

  addStoreLine = () => {
    this.setState({
      stores: [...this.state.stores, { id: Date.now(), name: '' }]
    });
  }

  removeStoreLine = (id) => {
    this.setState({
      stores: this.state.stores.filter(store => store.id !== id)
    });
  }

  addPermissionLine = () => {
    this.setState({
      permissions: [...this.state.permissions, { id: Date.now(), name: '' }]
    });
  }

  removePermissionLine = (id) => {
    this.setState({
      permissions: this.state.permissions.filter(perm => perm.id !== id)
    });
  }

  handleStoreChange = (id, value) => {
    this.setState({
      stores: this.state.stores.map(store => store.id === id ? { ...store, name: value } : store)
    });
  }

  handlePermissionChange = (id, value) => {
    this.setState({
      permissions: this.state.permissions.map(perm => perm.id === id ? { ...perm, name: value } : perm)
    });
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Register User </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Users</a></li>
              <li className="breadcrumb-item active" aria-current="page">Register</li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">User Information</h4>
                <form className="form-sample">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">User Id:</label>
                        <div className="col-sm-9">
                          <Form.Control type="text" value={this.state.userData.userId} disabled />
                        </div>
                      </Form.Group>
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Name:</label>
                        <div className="col-sm-9">
                          <Form.Control type="text" placeholder="Enter Full Name" />
                        </div>
                      </Form.Group>
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Phone:</label>
                        <div className="col-sm-9">
                          <Form.Control type="text" placeholder="Enter Phone Number" />
                        </div>
                      </Form.Group>
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Department:</label>
                        <div className="col-sm-9">
                          <select className="form-control">
                            <option>Select Department</option>
                            <option>IT</option>
                            <option>HR</option>
                            <option>Accounts</option>
                            <option>Sales</option>
                          </select>
                        </div>
                      </Form.Group>
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Designation:</label>
                        <div className="col-sm-9">
                          <select className="form-control">
                            <option>Select Designation</option>
                            <option>Manager</option>
                            <option>Developer</option>
                            <option>Designer</option>
                            <option>Analyst</option>
                            <option>Executive</option>
                          </select>
                        </div>
                      </Form.Group>
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Office Location:</label>
                        <div className="col-sm-9">
                          <select className="form-control">
                            <option>Select Location</option>
                            <option>Head Office</option>
                            <option>Branch Office</option>
                            <option>Warehouse</option>
                          </select>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <div className="row mb-4 align-items-center">
                        <div className="col-sm-4 text-center">
                          <div
                            onClick={() => document.getElementById('photoInput').click()}
                            style={{
                              width: '120px',
                              height: '120px',
                              border: '2px dashed var(--border-color)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'var(--bg-color)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              position: 'relative'
                            }}
                          >
                            {this.state.userData.photoPreview ? (
                              <img src={this.state.userData.photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div className="text-center">
                                <i className="mdi mdi-camera text-muted" style={{ fontSize: '24px' }}></i>
                                <p className="text-muted small mb-0">Upload</p>
                              </div>
                            )}
                          </div>
                          <input type="file" id="photoInput" hidden accept="image/*" onChange={this.handlePhotoChange} />
                        </div>
                        <div className="col-sm-8">
                          <Form.Group className="row mb-2">
                            <label className="col-sm-5 col-form-label py-0 small text-muted">Created:</label>
                            <div className="col-sm-7">
                              <span className="small font-weight-bold">{this.state.userData.creationDate}</span>
                            </div>
                          </Form.Group>
                          <Form.Group className="row mb-0">
                            <label className="col-sm-5 col-form-label py-0 small text-muted">Updated:</label>
                            <div className="col-sm-7">
                              <span className="small font-weight-bold">{this.state.userData.updateDate}</span>
                            </div>
                          </Form.Group>
                        </div>
                      </div>
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Email:</label>
                        <div className="col-sm-9">
                          <Form.Control type="email" placeholder="Enter Email" />
                        </div>
                      </Form.Group>
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Password:</label>
                        <div className="col-sm-9">
                          <Form.Control type="password" placeholder="Enter Password" />
                        </div>
                      </Form.Group>
                      <Form.Group className="row">
                        <div className="col-sm-3"></div>
                        <div className="col-sm-9">
                          <div className="form-check">
                            <label className="form-check-label">
                              <input type="checkbox" className="form-check-input" defaultChecked /> Is active? <i className="input-helper"></i>
                            </label>
                          </div>
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="card-title mb-0">Applicable Store list</h4>
                        <button
                          type="button"
                          className="btn btn-info btn-rounded btn-icon"
                          onClick={this.addStoreLine}
                          style={{ width: '26px', height: '26px', minWidth: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <i className="mdi mdi-plus" style={{ fontSize: '18px' }}></i>
                        </button>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th className="text-center" style={{ width: '100px' }}>Action</th>
                              <th>Store Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.stores.map((store) => (
                              <tr key={store.id}>
                                <td className="text-center p-2">
                                  <div className="d-flex justify-content-center align-items-center">
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-rounded btn-icon p-0 mr-1"
                                      onClick={() => this.removeStoreLine(store.id)}
                                      style={{ width: '26px', height: '26px', minWidth: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                      <i className="mdi mdi-delete" style={{ fontSize: '16px' }}></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-warning btn-rounded btn-icon p-0"
                                      onClick={this.addStoreLine}
                                      style={{ width: '26px', height: '26px', minWidth: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                      <i className="mdi mdi-plus" style={{ fontSize: '16px' }}></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="p-1">
                                  <Form.Control
                                    type="text"
                                    className="form-control-sm border-0"
                                    value={store.name}
                                    onChange={(e) => this.handleStoreChange(store.id, e.target.value)}
                                    placeholder="Type Store Name..."
                                    style={{ background: 'transparent' }}
                                  />
                                </td>
                              </tr>
                            ))}
                            {this.state.stores.length === 0 && (
                              <tr>
                                <td colSpan="2" className="text-center text-muted py-4 small">No stores added. Click the + icon to add a new line.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="card-title mb-0">Applicable Permissions</h4>
                        <button
                          type="button"
                          className="btn btn-info btn-rounded btn-icon"
                          onClick={this.addPermissionLine}
                          style={{ width: '26px', height: '26px', minWidth: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <i className="mdi mdi-plus" style={{ fontSize: '18px' }}></i>
                        </button>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th style={{ width: '100px' }}>Action</th>
                              <th>Permission Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.permissions.map((perm) => (
                              <tr key={perm.id}>
                                <td className="text-center p-2">
                                  <div className="d-flex justify-content-center align-items-center">
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-rounded btn-icon p-0 mr-1"
                                      onClick={() => this.removePermissionLine(perm.id)}
                                      style={{ width: '26px', height: '26px', minWidth: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                      <i className="mdi mdi-delete" style={{ fontSize: '16px' }}></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-warning btn-rounded btn-icon p-0"
                                      onClick={this.addPermissionLine}
                                      style={{ width: '26px', height: '26px', minWidth: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                      <i className="mdi mdi-plus" style={{ fontSize: '16px' }}></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="p-1">
                                  <Form.Control
                                    type="text"
                                    className="form-control-sm border-0"
                                    value={perm.name}
                                    onChange={(e) => this.handlePermissionChange(perm.id, e.target.value)}
                                    placeholder="Type Permission Name..."
                                    style={{ background: 'transparent' }}
                                  />
                                </td>
                              </tr>
                            ))}
                            {this.state.permissions.length === 0 && (
                              <tr>
                                <td colSpan="2" className="text-center text-muted py-4 small">No permissions added. Click the + icon to add a new line.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>



                  <div className="mt-4 text-right">
                    <button type="submit" className="btn btn-primary mr-2">Submit</button>
                    <button type="button" className="btn btn-dark" onClick={() => this.props.history.push('/user-pages/user-management')}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterUser;
