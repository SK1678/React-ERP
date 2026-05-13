import React, { Component } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import ApiManager, { BASE_URL } from '../services/api';
import { COUNTRY_LIST, LOCATION_DATA } from '../../locationData';

export class CompanyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
      showModal: false,
      editMode: false,
      viewMode: false,
      loading: true,
      previewImage: null,
      showPreview: false,
      currentCompany: {
        id: '',
        name: '',
        address: '',
        country: '',
        state: '',
        city: '',
        default_language: 'en',
        tin: '',
        bin: '',
        phone: '',
        is_active: true,
        logo: '',
        owner_name: '',
        nid: '',
        favicon: '',
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

  getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('data:')) return path;
    if (path.startsWith('/storage')) return BASE_URL + path;
    return path;
  }

  handleToggleModal = (edit = false, company = null, view = false) => {
    if ((edit || view) && company) {
      this.setState({
        showModal: true,
        editMode: edit,
        viewMode: view,
        currentCompany: {
          ...company,
          createdAt: company.created_at || company.createdAt || new Date().toLocaleDateString(),
          updatedAt: company.updated_at || company.updatedAt || new Date().toLocaleDateString()
        }
      });
    } else {
      this.setState({
        showModal: !this.state.showModal,
        editMode: false,
        viewMode: false,
        currentCompany: {
          id: '', name: '', address: '', country: '', state: '', city: '', default_language: 'en', tin: '', bin: '', phone: '', is_active: true,
          logo: '', owner_name: '', nid: '', favicon: '', photo: '', trade_license: '',
          createdAt: new Date().toLocaleDateString(),
          updatedAt: new Date().toLocaleDateString()
        }
      });
    }
  }

  handleClosePreview = () => {
    this.setState({ showPreview: false, previewImage: null });
  }

  handleOpenPreview = (image) => {
    if (image) {
      this.setState({ showPreview: true, previewImage: image });
    }
  }

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState(prevState => {
      const updatedCompany = {
        ...prevState.currentCompany,
        [name]: type === 'checkbox' ? checked : value
      };

      // Reset State/City if Country changes
      if (name === 'country') {
        updatedCompany.state = '';
        updatedCompany.city = '';
      }
      // Reset City if State changes
      if (name === 'state') {
        updatedCompany.city = '';
      }

      return { currentCompany: updatedCompany };
    });
  }

  handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (e.g., max 15MB)
      const MAX_SIZE = 15 * 1024 * 1024; // 15MB
      if (file.size > MAX_SIZE) {
        alert('File is too large! Maximum allowed size is 15MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (re) => {
        const fileType = file.type;

        // If it's an image, we can try to compress it
        if (fileType.startsWith('image/')) {
          const img = new Image();
          img.src = re.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            this.setState({
              currentCompany: { ...this.state.currentCompany, [field]: compressedBase64 }
            });
          };
        } else {
          // For PDF, Doc, etc., store as is
          this.setState({
            currentCompany: { ...this.state.currentCompany, [field]: re.target.result }
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  handleSave = () => {
    const { editMode, currentCompany } = this.state;

    // Clean up system fields that should not be sent to the API
    const { 
      createdAt, 
      updatedAt, 
      created_at, 
      updated_at, 
      id, 
      ...payload 
    } = currentCompany;

    if (editMode) {
      ApiManager.updateCompany(currentCompany.id, payload)
        .then(() => {
          this.fetchCompanies();
          this.handleToggleModal();
        })
        .catch(err => {
          console.error('Update failed:', err);
          const cleanError = err.message.includes('SQLSTATE') ? 'Server error: File might be too large for database limits.' : err.message;
          alert('Update failed: ' + cleanError);
        });
    } else {
      ApiManager.createCompany(payload)
        .then(() => {
          this.fetchCompanies();
          this.handleToggleModal();
        })
        .catch(err => {
          console.error('Create failed:', err);
          const cleanError = err.message.includes('SQLSTATE') ? 'Server error: File might be too large for database limits.' : err.message;
          alert('Create failed: ' + cleanError);
        });
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
                  <h4 className="card-title"><Trans>Company</Trans></h4>
                  <button type="button" className="btn btn-primary btn-icon-text" onClick={() => this.handleToggleModal()}>
                    <i className="mdi mdi-plus btn-icon-prepend"></i> <Trans>Add New Company</Trans>
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
                                <img src={this.getImageUrl(company.logo)} alt="logo" style={{ width: '40px', borderRadius: '4px' }} />
                              ) : (
                                <div className="bg-secondary d-flex align-items-center justify-content-center" style={{ width: '40px', borderRadius: '4px' }}>
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
                              <button type="button" className="btn btn-outline-info btn-sm mr-2" onClick={() => this.handleToggleModal(false, company, true)}>
                                <Trans>View</Trans>
                              </button>
                              <button type="button" className="btn btn-outline-warning btn-sm mr-2" onClick={() => this.handleToggleModal(true, company)}>
                                <Trans>Edit</Trans>
                              </button>
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => this.handleDelete(company.id)}>
                                <Trans>Delete</Trans>
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
            <Modal.Title>
              {this.state.viewMode ? <Trans>View Company</Trans> : (this.state.editMode ? <Trans>Edit Company</Trans> : <Trans>Add New Company</Trans>)}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-gray-dark">
            <Form>
              <fieldset disabled={this.state.viewMode}>
                <div className="row">
                  {/* Left Column - General Info */}
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group>
                          <label><Trans>Company Name</Trans></label>
                          <Form.Control type="text" name="name" value={this.state.currentCompany.name} onChange={this.handleInputChange} placeholder="Enter Name" />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group>
                          <label><Trans>Owner Name</Trans></label>
                          <Form.Control type="text" name="owner_name" value={this.state.currentCompany.owner_name} onChange={this.handleInputChange} placeholder="Enter Owner Name" />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-4">
                        <Form.Group>
                          <label><Trans>Country</Trans></label>
                          <select className="form-control" name="country" value={this.state.currentCompany.country} onChange={this.handleInputChange}>
                            <option value="">Select Country</option>
                            {COUNTRY_LIST.map(country => (
                              <option key={country} value={country === "---" ? "" : country} disabled={country === "---"}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <label><Trans>State/Division</Trans></label>
                          <select className="form-control" name="state" value={this.state.currentCompany.state} onChange={this.handleInputChange}>
                            <option value="">Select State</option>
                            {LOCATION_DATA[this.state.currentCompany.country] && Object.keys(LOCATION_DATA[this.state.currentCompany.country]).map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <label><Trans>City/District</Trans></label>
                          <select className="form-control" name="city" value={this.state.currentCompany.city} onChange={this.handleInputChange}>
                            <option value="">Select City</option>
                            {this.state.currentCompany.state && LOCATION_DATA[this.state.currentCompany.country]?.[this.state.currentCompany.state] &&
                              LOCATION_DATA[this.state.currentCompany.country][this.state.currentCompany.state].map(city => (
                                <option key={city} value={city}>{city}</option>
                              ))
                            }
                          </select>
                        </Form.Group>
                      </div>
                    </div>

                    <Form.Group className="mt-3">
                      <label><Trans>Address</Trans></label>
                      <Form.Control as="textarea" rows={2} name="address" value={this.state.currentCompany.address} onChange={this.handleInputChange} />
                    </Form.Group>

                    <div className="row mt-3">
                      <div className="col-md-4">
                        <Form.Group>
                          <label><Trans>Phone</Trans></label>
                          <Form.Control type="text" name="phone" value={this.state.currentCompany.phone} onChange={this.handleInputChange} />
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <label><Trans>TIN</Trans></label>
                          <Form.Control type="text" name="tin" value={this.state.currentCompany.tin} onChange={this.handleInputChange} />
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <label><Trans>BIN</Trans></label>
                          <Form.Control type="text" name="bin" value={this.state.currentCompany.bin} onChange={this.handleInputChange} />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <Form.Group>
                          <label><Trans>NID Number</Trans></label>
                          <Form.Control type="text" name="nid" value={this.state.currentCompany.nid} onChange={this.handleInputChange} />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group>
                          <label><Trans>Default Language</Trans></label>
                          <select className="form-control" name="default_language" value={this.state.currentCompany.default_language} onChange={this.handleInputChange}>
                            <option value="en">English</option>
                            <option value="ar">Arabic (عربى)</option>
                          </select>
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-12 d-flex align-items-center">
                        <div className="form-check pt-2">
                          <label className="form-check-label">
                            <input type="checkbox" className="form-check-input" name="is_active" checked={this.state.currentCompany.is_active} onChange={this.handleInputChange} /> <Trans>Is Active</Trans> <i className="input-helper"></i>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Media Uploads */}
                  <div className="col-md-4">
                    <div className="row">
                      {/* Logo */}
                      {/* Company Logo */}
                      <div className="col-6 mb-3">
                        <label className="small"><Trans>Company Logo</Trans></label>
                        <div className="border rounded d-flex align-items-center justify-content-center cursor-pointer" style={{ height: '100px', background: 'rgba(255,255,255,0.05)', borderStyle: 'dashed' }} onClick={() => this.state.viewMode ? this.handleOpenPreview(this.getImageUrl(this.state.currentCompany.logo)) : this.logoInput.click()}>
                          {this.state.currentCompany.logo ? <img src={this.getImageUrl(this.state.currentCompany.logo)} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="logo" /> : <i className="mdi mdi-camera"></i>}
                        </div>
                        <input type="file" accept="image/*" className="d-none" ref={el => this.logoInput = el} onChange={(e) => this.handleFileUpload(e, 'logo')} />
                      </div>

                      {/* Owner Photo */}
                      <div className="col-6 mb-3">
                        <label className="small"><Trans>Owner Photo</Trans></label>
                        <div className="border rounded d-flex align-items-center justify-content-center cursor-pointer" style={{ height: '100px', background: 'rgba(255,255,255,0.05)', borderStyle: 'dashed' }} onClick={() => this.state.viewMode ? this.handleOpenPreview(this.getImageUrl(this.state.currentCompany.photo)) : this.photoInput.click()}>
                          {this.state.currentCompany.photo ? <img src={this.getImageUrl(this.state.currentCompany.photo)} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="photo" /> : <i className="mdi mdi-account-box"></i>}
                        </div>
                        <input type="file" accept="image/*" className="d-none" ref={el => this.photoInput = el} onChange={(e) => this.handleFileUpload(e, 'photo')} />
                      </div>

                      {/* Favicon */}
                      {/* Favicon */}
                      <div className="col-6 mb-3">
                        <label className="small"><Trans>Favicon</Trans></label>
                        <div className="border rounded d-flex align-items-center justify-content-center cursor-pointer" style={{ height: '100px', background: 'rgba(255,255,255,0.05)', borderStyle: 'dashed' }} onClick={() => this.state.viewMode ? this.handleOpenPreview(this.getImageUrl(this.state.currentCompany.favicon)) : this.faviconInput.click()}>
                          {this.state.currentCompany.favicon ? <img src={this.getImageUrl(this.state.currentCompany.favicon)} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="favicon" /> : <i className="mdi mdi-image"></i>}
                        </div>
                        <input type="file" accept="image/*" className="d-none" ref={el => this.faviconInput = el} onChange={(e) => this.handleFileUpload(e, 'favicon')} />
                      </div>

                      {/* Trade License */}
                      <div className="col-6 mb-3">
                        <label className="small"><Trans>Trade License</Trans> (IMG/PDF/DOC)</label>
                        <div className="border rounded d-flex align-items-center justify-content-center cursor-pointer overflow-hidden" style={{ height: '100px', background: 'rgba(255,255,255,0.05)', borderStyle: 'dashed' }} onClick={() => this.state.viewMode ? this.handleOpenPreview(this.getImageUrl(this.state.currentCompany.trade_license)) : this.licenseInput.click()}>
                          {this.state.currentCompany.trade_license ? (
                            this.getImageUrl(this.state.currentCompany.trade_license).includes('data:image/') || this.getImageUrl(this.state.currentCompany.trade_license).match(/\.(jpg|jpeg|png)$/i) ? (
                              <img src={this.getImageUrl(this.state.currentCompany.trade_license)} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="license" />
                            ) : (
                              <div className="text-center">
                                <i className="mdi mdi-file-pdf text-danger" style={{ fontSize: '2rem' }}></i>
                                <p className="small mb-0 text-white">Document</p>
                              </div>
                            )
                          ) : <i className="mdi mdi-file-document"></i>}
                        </div>
                        <input type="file" accept="image/*,.pdf,.doc,.docx" className="d-none" ref={el => this.licenseInput = el} onChange={(e) => this.handleFileUpload(e, 'trade_license')} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-4 pt-3 border-top border-secondary">
                  <div className="col-6">
                    <small className="text-muted">
                      Created: {this.state.currentCompany.createdAt && this.state.currentCompany.createdAt.includes('T')
                        ? new Date(this.state.currentCompany.createdAt).toLocaleString()
                        : this.state.currentCompany.createdAt}
                    </small>
                  </div>
                  <div className="col-6 text-right">
                    <small className="text-muted">
                      Updated: {this.state.currentCompany.updatedAt && this.state.currentCompany.updatedAt.includes('T')
                        ? new Date(this.state.currentCompany.updatedAt).toLocaleString()
                        : this.state.currentCompany.updatedAt}
                    </small>
                  </div>
                </div>
              </fieldset>
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-gray-dark border-top-0">
            <Button variant="secondary" onClick={() => this.handleToggleModal()}>
              {this.state.viewMode ? <Trans>Close</Trans> : <Trans>Cancel</Trans>}
            </Button>
            {!this.state.viewMode && (
              <Button variant="primary" onClick={this.handleSave}>{this.state.editMode ? <Trans>Update Company</Trans> : <Trans>Save Company</Trans>}</Button>
            )}
          </Modal.Footer>
        </Modal>
        {/* Media Preview Modal */}
        <Modal show={this.state.showPreview} onHide={this.handleClosePreview} size="lg" centered>
          <Modal.Header closeButton className="bg-dark border-bottom-0 text-white">
            <Modal.Title><Trans>Media Preview</Trans></Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-center p-0" style={{ minHeight: '400px' }}>
            {this.state.previewImage ? (
              this.state.previewImage.startsWith('data:image/') ? (
                <img src={this.state.previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
              ) : (
                <div className="p-5">
                  <i className="mdi mdi-file-pdf text-danger mb-3" style={{ fontSize: '5rem' }}></i>
                  <h5 className="text-white mb-4"><Trans>Document File</Trans></h5>
                  <a href={this.state.previewImage} download="trade_license" className="btn btn-primary btn-lg">
                    <i className="mdi mdi-download mr-2"></i> <Trans>Download Document</Trans>
                  </a>
                </div>
              )
            ) : (
              <p className="text-white p-5"><Trans>No image available</Trans></p>
            )}
          </Modal.Body>
          <Modal.Footer className="bg-dark border-top-0">
            <Button variant="secondary" onClick={this.handleClosePreview}><Trans>Close</Trans></Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default CompanyList;
