import React, { Component } from 'react'
import { ApiManager } from '../services/api';

export class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      searchTerm: '',
      deptFilter: '',
      locFilter: '',
      filteredUsers: []
    }
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = () => {
    ApiManager.getUsers()
      .then(data => {
        const users = (data && data.length > 0) ? data : this.getDummyData();
        this.setState({ users, filteredUsers: users });
      })
      .catch(err => {
        console.error('Failed to fetch users:', err);
        const users = this.getDummyData();
        this.setState({ users, filteredUsers: users });
      });
  }

  getDummyData() {
    return [
      { id: 1, name: 'Henry Klein', email: 'henry@example.com', role: 'Admin', status: 'Active', joined: '04 Dec 2019', dept: 'IT', loc: 'Head Office' },
      { id: 2, name: 'Estella Bryan', email: 'estella@example.com', role: 'User', status: 'Pending', joined: '15 Jan 2020', dept: 'Sales', loc: 'Warehouse' },
      { id: 3, name: 'Lucy Abbott', email: 'lucy@example.com', role: 'Editor', status: 'Active', joined: '22 Feb 2020', dept: 'Marketing', loc: 'Retail' },
      { id: 4, name: 'Peter Gill', email: 'peter@example.com', role: 'User', status: 'Inactive', joined: '11 Mar 2020', dept: 'IT', loc: 'Warehouse' },
      { id: 5, name: 'Sallie Reyes', email: 'sallie@example.com', role: 'Admin', status: 'Active', joined: '05 Apr 2020', dept: 'Sales', loc: 'Head Office' },
    ];
  }

  handleFilterChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value }, this.applyFilters);
  }

  applyFilters = () => {
    const { users, searchTerm, deptFilter, locFilter } = this.state;
    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = deptFilter === '' || user.dept === deptFilter;
      const matchesLoc = locFilter === '' || user.loc === locFilter;
      return matchesSearch && matchesDept && matchesLoc;
    });
    this.setState({ filteredUsers: filtered });
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> User Management </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Users</a></li>
              <li className="breadcrumb-item active" aria-current="page">List</li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card" style={{ overflow: 'visible' }}>
              <div className="card-body" style={{ overflow: 'visible' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="card-title mb-1">All Registered Users</h4>
                    <p className="card-description mb-0"> Manage your application users </p>
                  </div>
                  <button className="btn btn-primary btn-icon-text" onClick={() => this.props.history.push('/user-pages/register-user')}>
                    <i className="mdi mdi-plus btn-icon-prepend"></i> Add New User
                  </button>
                </div>

                <div className="row mb-4 sticky-top pt-2 pb-2" style={{ top: '70px', background: 'var(--card-bg)', zIndex: 999, margin: '0 -1.25rem', padding: '0.5rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div className="col-md-4">
                    <div className="form-group mb-0">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-primary border-primary text-white">
                            <i className="mdi mdi-magnify"></i>
                          </span>
                        </div>
                        <input 
                          type="text" 
                          name="searchTerm"
                          className="form-control" 
                          placeholder="Search Name or Email..." 
                          value={this.state.searchTerm}
                          onChange={this.handleFilterChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <select 
                      name="deptFilter"
                      className="form-control" 
                      value={this.state.deptFilter}
                      onChange={this.handleFilterChange}
                    >
                      <option value="">All Departments</option>
                      <option value="IT">IT</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select 
                      name="locFilter"
                      className="form-control" 
                      value={this.state.locFilter}
                      onChange={this.handleFilterChange}
                    >
                      <option value="">All Locations</option>
                      <option value="Head Office">Head Office</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th> User </th>
                        <th> Email </th>
                        <th> Department </th>
                        <th> Location </th>
                        <th> Role </th>
                        <th> Status </th>
                        <th> Joined </th>
                        <th> Action </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.filteredUsers.length > 0 ? (
                        this.state.filteredUsers.map((user, index) => (
                          <tr key={user.id}>
                            <td className="py-1">
                              <img src={require(`../../assets/images/faces/face${(index % 10) + 1}.jpg`)} alt="user" />
                              <span className="pl-2 font-weight-bold">{user.name}</span>
                            </td>
                            <td> {user.email} </td>
                            <td> <span className="text-muted">{user.dept}</span> </td>
                            <td> <span className="text-muted">{user.loc}</span> </td>
                            <td> {user.role} </td>
                            <td>
                              <label className={`badge badge-${
                                user.status === 'Active' ? 'success' : 
                                user.status === 'Pending' ? 'warning' : 'danger'
                              }`}>
                                {user.status}
                              </label>
                            </td>
                            <td> {user.joined} </td>
                            <td>
                              <button className="btn btn-outline-warning btn-icon-text btn-sm mr-2" onClick={() => this.props.history.push('/user-pages/register-user')}>
                                <i className="mdi mdi-pencil btn-icon-prepend"></i> Edit
                              </button>
                              <button className="btn btn-outline-danger btn-icon-text btn-sm">
                                <i className="mdi mdi-delete btn-icon-prepend"></i> Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-5">
                            <i className="mdi mdi-account-off display-4 text-muted mb-3 d-block"></i>
                            <p className="text-muted">No users found matching your filters.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserManagement
