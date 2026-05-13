import React, { Component } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import ApiManager, { BASE_URL } from '../services/api';
import { COUNTRY_LIST, LOCATION_DATA } from '../../locationData';

export class StoreList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      editMode: false,
      loading: true,
      stores: [],
      companies: [],
      currentStore: {
        id: '',
        company_id: '',
        parentStore: '',
        name: '',
        logo: '',
        prefix: '',
        code: '',
        tin: '',
        bin: '',
        address: '',
        country: '',
        state: '',
        city: '',

        type: 'head office',
        phone: '',
        pinCode: '',
        startTime: '09:00',
        endTime: '18:00',
        weekend: 'Sunday',
        isActive: true,
        isInventoryLocation: true,
        shareCustomerDetails: false,
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString()
      }
    };
  }

  componentDidMount() {
    this.fetchStores();
    this.fetchCompanies();
  }

  fetchCompanies = () => {
    ApiManager.getCompanies()
      .then(response => {
        this.setState({ companies: response || [] });
      })
      .catch(err => console.error('Failed to fetch companies for store list:', err));
  }

  fetchStores = () => {
    this.setState({ loading: true });
    ApiManager.getStores()
      .then(data => {
        this.setState({ stores: Array.isArray(data) ? data : [], loading: false });
      })
      .catch(err => {
        console.error('Failed to fetch stores:', err);
        this.setState({ loading: false, stores: [] });
      });
  }

  handleToggleModal = (edit = false, store = null) => {
    if (edit && store) {
      // Map backend snake_case to frontend camelCase for the form
      const mappedStore = {
        ...store,
        isActive: store.is_active,
        isInventoryLocation: store.is_inventory_location,
        shareCustomerDetails: store.share_customer_details,
        startTime: store.start_time,
        endTime: store.end_time,
        createdAt: store.created_at ? new Date(store.created_at).toLocaleString() : new Date().toLocaleDateString(),
        updatedAt: store.updated_at ? new Date(store.updated_at).toLocaleString() : new Date().toLocaleDateString()
      };
      this.setState({ showModal: true, editMode: true, currentStore: mappedStore });
    } else {
      this.setState({ 
        showModal: !this.state.showModal, 
        editMode: false,
        currentStore: {
          id: '', company_id: '', parentStore: '', name: '', logo: '', prefix: '', code: '', tin: '', bin: '', address: '', country: '', state: '', city: '',

          type: 'head office', phone: '', pinCode: '', startTime: '09:00', endTime: '18:00', weekend: 'Sunday',
          isActive: true, isInventoryLocation: true, shareCustomerDetails: false,
          createdAt: new Date().toLocaleDateString(),
          updatedAt: new Date().toLocaleDateString()
        }
      });
    }

  }

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Auto-populate Logo, TIN, and BIN when Company is selected
    if (name === 'company_id') {
      const selectedCompany = this.state.companies.find(c => c.id.toString() === value.toString());
      if (selectedCompany) {
        this.setState({
          currentStore: {
            ...this.state.currentStore,
            company_id: value,
            logo: selectedCompany.logo || this.state.currentStore.logo,
            tin: selectedCompany.tin || this.state.currentStore.tin,
            bin: selectedCompany.bin || this.state.currentStore.bin,
            country: selectedCompany.country || this.state.currentStore.country,
            state: selectedCompany.state || this.state.currentStore.state,
            city: selectedCompany.city || this.state.currentStore.city
          }
        });
        return;
      }
    }

    if (name === 'country') {
      this.setState({
        currentStore: {
          ...this.state.currentStore,
          country: value,
          state: '',
          city: ''
        }
      });
      return;
    }

    if (name === 'state') {
      this.setState({
        currentStore: {
          ...this.state.currentStore,
          state: value,
          city: ''
        }
      });
      return;
    }

    this.setState({

      currentStore: {
        ...this.state.currentStore,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  }

  handleSave = () => {
    const { editMode, currentStore } = this.state;
    
    // Mapping frontend fields to backend snake_case
    const payload = {
      ...currentStore,
      is_active: currentStore.isActive ? 1 : 0,
      is_inventory_location: currentStore.isInventoryLocation ? 1 : 0,
      share_customer_details: currentStore.shareCustomerDetails ? 1 : 0,
      start_time: currentStore.startTime,
      end_time: currentStore.endTime
    };

    // Remove system-managed timestamps so Laravel handles them natively.
    // This strictly prevents created_at from changing on update.
    delete payload.created_at;
    delete payload.updated_at;
    delete payload.createdAt;
    delete payload.updatedAt;

    if (editMode) {
      ApiManager.updateStore(currentStore.id, payload)
        .then(() => {
          this.fetchStores();
          this.handleToggleModal();
        })
        .catch(err => console.error('Update failed:', err));
    } else {
      ApiManager.createStore(payload)
        .then(() => {
          this.fetchStores();
          this.handleToggleModal();
        })
        .catch(err => console.error('Create failed:', err));
    }
  }

  handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      ApiManager.deleteStore(id)
        .then(() => this.fetchStores())
        .catch(err => console.error('Delete failed:', err));
    }
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Store List </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Master</a></li>
              <li className="breadcrumb-item active" aria-current="page">Store List</li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title">Manage Stores</h4>
                  <button type="button" className="btn btn-primary btn-icon-text" onClick={() => this.handleToggleModal()}>
                    <i className="mdi mdi-plus btn-icon-prepend"></i> Add New Store
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Store Name</th>
                        <th>Store Code</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.loading ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        this.state.stores.length > 0 ? (
                          this.state.stores.map((store) => (
                            <tr key={store.id}>
                              <td>{store.id}</td>
                              <td>{store.name}</td>
                              <td>{store.code}</td>
                              <td><label className="badge badge-info">{store.type}</label></td>
                              <td>
                                <div className="custom-control custom-switch">
                                    <input 
                                      type="checkbox" 
                                      className="custom-control-input" 
                                      id={`customSwitch${store.id}`} 
                                      checked={!!store.is_active} 
                                      readOnly
                                    />
                                    <label className="custom-control-label" htmlFor={`customSwitch${store.id}`}>
                                      {store.is_active ? 'Active' : 'Inactive'}
                                    </label>
                                </div>
                              </td>
                              <td>
                                <button type="button" className="btn btn-outline-warning btn-icon-text btn-sm mr-2" onClick={() => this.handleToggleModal(true, store)}>
                                  <i className="mdi mdi-pencil btn-icon-prepend"></i> Edit
                                </button>
                                <button type="button" className="btn btn-outline-danger btn-icon-text btn-sm" onClick={() => this.handleDelete(store.id)}>
                                  <i className="mdi mdi-delete btn-icon-prepend"></i> Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-5">No stores found.</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <Modal show={this.state.showModal} onHide={() => this.handleToggleModal()} size="lg" centered>
          <Modal.Header closeButton className="bg-gray-dark">
            <Modal.Title>{this.state.editMode ? 'Edit Store' : 'Add New Store'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-gray-dark">
            <Form>
              <div className="row">
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-6">
                      <Form.Group>
                        <label>Store ID (Auto)</label>
                        <Form.Control type="text" disabled placeholder="System Generated" />
                      </Form.Group>
                    </div>
                    <div className="col-6">
                      <Form.Group>
                        <label>Company</label>
                        <select className="form-control" name="company_id" value={this.state.currentStore.company_id || ''} onChange={this.handleInputChange}>
                          <option value="">Select Company</option>
                          {this.state.companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </Form.Group>
                    </div>
                  </div>
                  <Form.Group>
                    <label>Parent Store (Optional)</label>
                    <select className="form-control" name="parentStore" value={this.state.currentStore.parentStore} onChange={this.handleInputChange}>
                      <option value="">None</option>
                      {this.state.stores.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </Form.Group>
                  <Form.Group>
                    <label>Store Name</label>
                    <Form.Control type="text" name="name" value={this.state.currentStore.name} onChange={this.handleInputChange} placeholder="Enter Store Name" />
                  </Form.Group>
                </div>
                <div className="col-md-4 text-center">
                   <label className="d-block">Store Logo</label>
                   <div 
                      className="border rounded d-flex align-items-center justify-content-center cursor-pointer" 
                      style={{ height: '150px', background: 'rgba(255,255,255,0.05)', borderStyle: 'dashed' }}
                      onClick={() => document.getElementById('logoUpload').click()}
                    >
                      {this.state.currentStore.logo ? (
                        <img 
                          src={this.state.currentStore.logo.startsWith('/storage') ? BASE_URL + this.state.currentStore.logo : this.state.currentStore.logo} 
                          alt="logo" 
                          style={{ maxWidth: '100%', maxHeight: '100%' }} 
                        />
                      ) : (
                        <div className="text-muted text-center">
                          <i className="mdi mdi-camera display-4 d-block mb-1"></i>
                          <small>Upload Logo</small>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      id="logoUpload" 
                      className="d-none" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            this.setState({
                              currentStore: { ...this.state.currentStore, logo: re.target.result }
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-6">
                      <Form.Group>
                        <label>Prefix</label>
                        <Form.Control type="text" name="prefix" value={this.state.currentStore.prefix} onChange={this.handleInputChange} placeholder="ST" />
                      </Form.Group>
                    </div>
                    <div className="col-6">
                      <Form.Group>
                        <label>Store Code</label>
                        <Form.Control type="text" name="code" value={this.state.currentStore.code} onChange={this.handleInputChange} placeholder="001" />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <Form.Group>
                        <label>TIN</label>
                        <Form.Control type="text" name="tin" value={this.state.currentStore.tin} onChange={this.handleInputChange} />
                      </Form.Group>
                    </div>
                    <div className="col-6">
                      <Form.Group>
                        <label>BIN</label>
                        <Form.Control type="text" name="bin" value={this.state.currentStore.bin} onChange={this.handleInputChange} />
                      </Form.Group>
                    </div>
                  </div>
                  <Form.Group>
                    <label>Store Type</label>
                    <select className="form-control" name="type" value={this.state.currentStore.type} onChange={this.handleInputChange}>
                      <option value="head office">Head Office</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Retail">Retail</option>
                      <option value="Restaurant">Restaurant</option>
                    </select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <label>Address</label>
                    <Form.Control as="textarea" rows={3} name="address" value={this.state.currentStore.address} onChange={this.handleInputChange} />
                  </Form.Group>
                  <Form.Group>
                    <label>Country</label>
                    <select className="form-control" name="country" value={this.state.currentStore.country || ''} onChange={this.handleInputChange}>
                      <option value="">Select Country</option>
                      {COUNTRY_LIST.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </Form.Group>
                  <div className="row">
                    <div className="col-6">
                      <Form.Group>
                        <label>State</label>
                        <select className="form-control" name="state" value={this.state.currentStore.state || ''} onChange={this.handleInputChange} disabled={!this.state.currentStore.country}>
                          <option value="">Select State</option>
                          {this.state.currentStore.country && Object.keys(LOCATION_DATA[this.state.currentStore.country] || {}).map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </Form.Group>
                    </div>
                    <div className="col-6">
                      <Form.Group>
                        <label>City</label>
                        <select className="form-control" name="city" value={this.state.currentStore.city || ''} onChange={this.handleInputChange} disabled={!this.state.currentStore.state}>
                          <option value="">Select City</option>
                          {this.state.currentStore.state && (LOCATION_DATA[this.state.currentStore.country]?.[this.state.currentStore.state] || []).map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <Form.Group>
                        <label>Phone</label>
                        <Form.Control type="text" name="phone" value={this.state.currentStore.phone} onChange={this.handleInputChange} />
                      </Form.Group>
                    </div>
                    <div className="col-6">
                      <Form.Group>
                        <label>Pin Code</label>
                        <Form.Control type="text" name="pinCode" value={this.state.currentStore.pinCode} onChange={this.handleInputChange} />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <Form.Group>
                        <label>Start Time</label>
                        <Form.Control type="time" name="startTime" value={this.state.currentStore.startTime} onChange={this.handleInputChange} />
                      </Form.Group>
                    </div>
                    <div className="col-6">
                      <Form.Group>
                        <label>End Time</label>
                        <Form.Control type="time" name="endTime" value={this.state.currentStore.endTime} onChange={this.handleInputChange} />
                      </Form.Group>
                    </div>
                  </div>
                  <Form.Group>
                    <label>Weekend</label>
                    <select className="form-control" name="weekend" value={this.state.currentStore.weekend} onChange={this.handleInputChange}>
                      <option>Sunday</option>
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>None</option>
                    </select>
                  </Form.Group>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-4">
                  <div className="form-check">
                    <label className="form-check-label">
                      <input type="checkbox" className="form-check-input" name="isActive" checked={this.state.currentStore.isActive} onChange={this.handleInputChange} /> Is Active <i className="input-helper"></i>
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check">
                    <label className="form-check-label">
                      <input type="checkbox" className="form-check-input" name="isInventoryLocation" checked={this.state.currentStore.isInventoryLocation} onChange={this.handleInputChange} /> Inventory Location <i className="input-helper"></i>
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check">
                    <label className="form-check-label">
                      <input type="checkbox" className="form-check-input" name="shareCustomerDetails" checked={this.state.currentStore.shareCustomerDetails} onChange={this.handleInputChange} /> Share Customers <i className="input-helper"></i>
                    </label>
                  </div>
                </div>
              </div>

              <div className="row mt-4 pt-3 border-top border-secondary">
                <div className="col-6">
                  <small className="text-muted">Created: </small>
                  <span className="small font-weight-bold">{this.state.currentStore.createdAt}</span>
                </div>
                <div className="col-6 text-right">
                  <small className="text-muted">Updated: </small>
                  <span className="small font-weight-bold">{this.state.currentStore.updatedAt}</span>
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-gray-dark border-top-0">
            <Button variant="secondary" onClick={() => this.handleToggleModal()}>Cancel</Button>
            <Button variant="primary" onClick={this.handleSave}>{this.state.editMode ? 'Update Store' : 'Save Store'}</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default StoreList;
