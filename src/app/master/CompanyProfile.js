import React, { Component } from 'react';
import ApiManager from '../services/api';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

export class CompanyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: null,
      loading: true
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    ApiManager.getCompany(id)
      .then(data => {
        this.setState({ company: data, loading: false });
      })
      .catch(err => {
        console.error('Failed to fetch company:', err);
        this.setState({ loading: false });
      });
  }

  render() {
    const { company, loading } = this.state;

    if (loading) {
      return (
        <div className="d-flex align-items-center justify-content-center" style={{ height: '80vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }

    if (!company) {
      return (
        <div className="alert alert-danger mx-4 mt-4">
          <Trans>Company not found</Trans>
        </div>
      );
    }

    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> <Trans>Company Profile</Trans> </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/master/company"><Trans>Company List</Trans></Link></li>
              <li className="breadcrumb-item active" aria-current="page"><Trans>Profile</Trans></li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-md-4 grid-margin stretch-card">
            <div className="card text-center">
              <div className="card-body">
                <img src={company.logo || 'https://via.placeholder.com/150'} alt="logo" className="img-lg rounded-circle mb-2" />
                <h4>{company.name}</h4>
                <p className="text-muted">{company.owner_name}</p>
                <p className="mt-4 card-text">
                  {company.address}
                </p>
                <div className={`badge badge-outline-${company.is_active ? 'success' : 'danger'}`}>
                  {company.is_active ? <Trans>Active</Trans> : <Trans>Inactive</Trans>}
                </div>
                <div className="border-top pt-3 mt-3">
                  <div className="row">
                    <div className="col-6">
                      <h6>{new Date(company.created_at).toLocaleDateString()}</h6>
                      <p className="text-muted mb-0"><Trans>Joined</Trans></p>
                    </div>
                    <div className="col-6">
                      <h6>{company.default_language === 'en' ? 'English' : 'Arabic'}</h6>
                      <p className="text-muted mb-0"><Trans>Language</Trans></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-8 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"><Trans>Business Details</Trans></h4>
                <div className="table-responsive">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td><strong><Trans>Phone</Trans></strong></td>
                        <td>{company.phone}</td>
                      </tr>
                      <tr>
                        <td><strong><Trans>TIN</Trans></strong></td>
                        <td>{company.tin}</td>
                      </tr>
                      <tr>
                        <td><strong><Trans>BIN</Trans></strong></td>
                        <td>{company.bin}</td>
                      </tr>
                      <tr>
                        <td><strong><Trans>NID Number</Trans></strong></td>
                        <td>{company.nid}</td>
                      </tr>
                      <tr>
                        <td><strong><Trans>Country</Trans></strong></td>
                        <td>{company.country}</td>
                      </tr>
                      <tr>
                        <td><strong><Trans>State/Division</Trans></strong></td>
                        <td>{company.state}</td>
                      </tr>
                      <tr>
                        <td><strong><Trans>City/District</Trans></strong></td>
                        <td>{company.city}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"><Trans>Legal Documents</Trans></h4>
                <div className="row mt-4 text-center">
                  <div className="col-md-3">
                    <p className="mb-2"><Trans>Owner Photo</Trans></p>
                    <div className="border p-2 rounded bg-dark">
                      <img src={company.photo || 'https://via.placeholder.com/150'} alt="owner" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <p className="mb-2"><Trans>Trade License</Trans></p>
                    <div className="border p-2 rounded bg-dark">
                      <img src={company.trade_license || 'https://via.placeholder.com/150'} alt="license" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <p className="mb-2"><Trans>Favicon</Trans></p>
                    <div className="border p-2 rounded bg-dark">
                      <img src={company.favicon || 'https://via.placeholder.com/150'} alt="favicon" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CompanyProfile;
