import React, { Component } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { ApiManager } from '../services/api';

export class CompanyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      editMode: false,
      loading: true,
      companies: [],
      currentCompany: {
        id: '',
        name: '',
        address: '',
        country: '',
        tin: '',
        bin: '',
        phone: '',
        is_active: true,
        logo: '',
        owner_name: '',
        nid: '',
        image: '',
        photo: '',
        trade_license: '',
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString()
      }
    };
  }

  componentDidMount() {
    this.fetchCompanies();
  }

  fetchCompanies = () => {
    this.setState({ loading: true });
    ApiManager.getCompanies()
      .then(data => {
        this.setState({ companies: Array.isArray(data) ? data : [], loading: false });
      })
      .catch(err => {
        console.error('Failed to fetch companies:', err);
        this.setState({ loading: false, companies: [] });
      });
  }

  handleToggleModal = (edit = false, company = null) => {
    if (edit && company) {
      this.setState({ 
        showModal: true, 
        editMode: true, 
        currentCompany: { ...company } 
      });
    } else {
      this.setState({ 
        showModal: !this.state.showModal, 
        editMode: false,
        currentCompany: {
          id: '', name: '', address: '', country: '', tin: '', bin: '', phone: '', is_active: true,
          logo: '', owner_name: '', nid: '', image: '', photo: '', trade_license: '',
          createdAt: new Date().toLocaleDateString(),
          updatedAt: new Date().toLocaleDateString()
        }
      });
    }
  }

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      currentCompany: {
        ...this.state.currentCompany,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  }

  handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => {
        this.setState({
          currentCompany: { ...this.state.currentCompany, [field]: re.target.result }
        });
      };
      reader.readAsDataURL(file);
    }
  }

  handleSave = () => {
    const { editMode, currentCompany } = this.state;
    
    if (editMode) {
      ApiManager.updateCompany(currentCompany.id, currentCompany)
        .then(() => {
          this.fetchCompanies();
          this.handleToggleModal();
        })
        .catch(err => console.error('Update failed:', err));
    } else {
      ApiManager.createCompany(currentCompany)
        .then(() => {
          this.fetchCompanies();
          this.handleToggleModal();
        })
        .catch(err => console.error('Create failed:', err));
    }
  }

  handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      ApiManager.deleteCompany(id)
        .then(() => this.fetchCompanies())
        .catch(err => console.error('Delete failed:', err));
    }
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Company Management </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Master</a></li>
              <li className="breadcrumb-item active" aria-current="page">Company</li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title">All Companies</h4>
                  <button type="button" className="btn btn-primary btn-icon-text" onClick={() => this.handleToggleModal()}>
                    <i className="mdi mdi-plus btn-icon-prepend"></i> Add New Company
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Logo</th>
                        <th>Company Name</th>
                        <th>Owner</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.loading ? (
                        <tr><td colSpan="7" className="text-center py-5">Loading...</td></tr>
                      ) : (
                        this.state.companies.map((company) => (
                          <tr key={company.id}>
                            <td>{company.id}</td>
                            <td>
                              {company.logo ? (
                                <img src={company.logo} alt="logo" style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
                              ) : (
                                <div className="bg-secondary d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', borderRadius: '4px' }}>
                                  <i className="mdi mdi-domain"></i>
                                </div>
                              )}
                            </td>
                            <td>{company.name}</td>
                            <td>{company.owner_name}</td>
                            <td>{company.phone}</td>
                            <td>
                              <label className={`badge badge-${company.is_active ? 'success' : 'danger'}`}>
                                {company.is_active ? 'Active' : 'Inactive'}
                              </label>
                            </td>
                            <td>
                              <button type="button" className="btn btn-outline-warning btn-sm mr-2" onClick={() => this.handleToggleModal(true, company)}>
                                Edit
                              </button>
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => this.handleDelete(company.id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal show={this.state.showModal} onHide={() => this.handleToggleModal()} size="xl" centered>
          <Modal.Header closeButton className="bg-gray-dark">
            <Modal.Title>{this.state.editMode ? 'Edit Company' : 'Add New Company'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-gray-dark">
            <Form>
              <div className="row">
                {/* Left Column - General Info */}
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group>
                        <label>Company Name</label>
                        <Form.Control type="text" name="name" value={this.state.currentCompany.name} onChange={this.handleInputChange} placeholder="Enter Name" />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <label>Owner Name</label>
                        <Form.Control type="text" name="owner_name" value={this.state.currentCompany.owner_name} onChange={this.handleInputChange} placeholder="Enter Owner Name" />
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <Form.Group>
                        <label>Phone</label>
                        <Form.Control type="text" name="phone" value={this.state.currentCompany.phone} onChange={this.handleInputChange} />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <label>Country</label>
                        <Form.Control type="text" name="country" value={this.state.currentCompany.country} onChange={this.handleInputChange} />
                      </Form.Group>
                    </div>
                  </div>

                  <Form.Group className="mt-3">
                    <label>Address</label>
                    <Form.Control as="textarea" rows={2} name="address" value={this.state.currentCompany.address} onChange={this.handleInputChange} />
                  </Form.Group>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <Form.Group>
                        <label>TIN</label>
                        <Form.Control type="text" name="tin" value={this.state.currentCompany.tin} onChange={this.handleInputChange} />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <label>BIN</label>
                        <Form.Control type="text" name="bin" value={this.state.currentCompany.bin} onChange={this.handleInputChange} />
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <Form.Group>
                        <label>NID Number</label>
                        <Form.Control type="text" name="nid" value={this.state.currentCompany.nid} onChange={this.handleInputChange} />
                      </Form.Group>
                    </div>
                    <div className="col-md-6 d-flex align-items-center">
                      <div className="form-check pt-3">
                        <label className="form-check-label">
                          <input type="checkbox" className="form-check-input" name="is_active" checked={this.state.currentCompany.is_active} onChange={this.handleInputChange} /> Is Active <i className="input-helper"></i>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Media Uploads */}
                <div className="col-md-4">
                  <div className="row">
                    {/* Logo */}
                    <div className="col-6 mb-3">
                      <label className="small">Company Logo</label>
                      <div className="border rounded d-flex align-items-center justify-content-center cursor-pointer" style={{ height: '100px', background: 'rgba(255,255,255,0.05)', borderStyle: 'dashed' }} onClick={() => this.logoInput.click()}>
                        {this.state.currentCompany.logo ? <img src={this.state.currentCompany.logo} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="logo" /> : <i className="mdi mdi-camera"></i>}
                      </div>
                      <input type="file" className="d-none" ref={el => this.logoInput = el} onChange={(e) => this.handleFileUpload(e, 'logo')} />
                    </div>

                    {/* Owner Photo */}
                    <div className="col-6 mb-3">
                      <label className="small">Owner Photo</label>
                      <div className="border rounded d-flex align-items-center justify-content-center cursor-pointer" style={{ height: '100px', background: 'rgba(255,255,255,0.05)', borderStyle: 'dashed' }} onClick={() => this.photoInput.click()}>
                        {this.state.currentCompany.photo ? <img src={this.state.currentCompany.photo} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="photo" /> : <i className="mdi mdi-account-box"></i>}
                      </div>
                      <input type="file" className="d-none" ref={el => this.photoInput = el} onChange={(e) => this.handleFileUpload(e, 'photo')} />
                    </div>

                    {/* Company Image */}
                    <div className="col-6 mb-3">
                      <label className="small">Company Image</label>
                      <div className="border rounded d-flex align-items-center justify-content-center cursor-pointer" style={{ height: '100px', background: 'rgba(255,255,255,0.05)', borderStyle: 'dashed' }} onClick={() => this.imageInput.click()}>
                        {this.state.currentCompany.image ? <img src={this.state.currentCompany.image} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="image" /> : <i className="mdi mdi-image"></i>}
                      </div>
                      <input type="file" className="d-none" ref={el => this.imageInput = el} onChange={(e) => this.handleFileUpload(e, 'image')} />
                    </div>

                    {/* Trade License */}
                    <div className="col-6 mb-3">
                      <label className="small">Trade License</label>
                      <div className="border rounded d-flex align-items-center justify-content-center cursor-pointer" style={{ height: '100px', background: 'rgba(255,255,255,0.05)', borderStyle: 'dashed' }} onClick={() => this.licenseInput.click()}>
                        {this.state.currentCompany.trade_license ? <img src={this.state.currentCompany.trade_license} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="license" /> : <i className="mdi mdi-file-document"></i>}
                      </div>
                      <input type="file" className="d-none" ref={el => this.licenseInput = el} onChange={(e) => this.handleFileUpload(e, 'trade_license')} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-4 pt-3 border-top border-secondary">
                <div className="col-6">
                  <small className="text-muted">Created: {this.state.currentCompany.createdAt}</small>
                </div>
                <div className="col-6 text-right">
                  <small className="text-muted">Updated: {this.state.currentCompany.updatedAt}</small>
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-gray-dark border-top-0">
            <Button variant="secondary" onClick={() => this.handleToggleModal()}>Cancel</Button>
            <Button variant="primary" onClick={this.handleSave}>{this.state.editMode ? 'Update Company' : 'Save Company'}</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default CompanyList;
