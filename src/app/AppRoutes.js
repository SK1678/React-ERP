import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';

const Dashboard = lazy(() => import('./dashboard/Dashboard'));

const Buttons = lazy(() => import('./basic-ui/Buttons'));
const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));
const Typography = lazy(() => import('./basic-ui/Typography'));

const BasicElements = lazy(() => import('./form-elements/BasicElements'));

const BasicTable = lazy(() => import('./tables/BasicTable'));
const StoreList = lazy(() => import('./master/StoreList'));
const DepartmentList = lazy(() => import('./master/DepartmentList'));
const DesignationList = lazy(() => import('./master/DesignationList'));


const Mdi = lazy(() => import('./icons/Mdi'));

const ChartJs = lazy(() => import('./charts/ChartJs'));

const Error404 = lazy(() => import('./error-pages/Error404'));
const Error500 = lazy(() => import('./error-pages/Error500'));

const Login = lazy(() => import('./user-pages/Login'));
const Register1 = lazy(() => import('./user-pages/Register'));
const UserManagement = lazy(() => import('./user-pages/UserManagement'));
const RegisterUser = lazy(() => import('./user-pages/RegisterUser'));



const CompanyList = lazy(() => import('./master/CompanyList'));

class AppRoutes extends Component {
  render() {
    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />

          <Route path="/basic-ui/buttons" component={Buttons} />
          <Route path="/basic-ui/dropdowns" component={Dropdowns} />
          <Route path="/basic-ui/typography" component={Typography} />

          <Route path="/form-Elements/basic-elements" component={BasicElements} />

          <Route path="/tables/basic-table" component={ BasicTable } />
          <Route path="/master/store-list" component={ StoreList } />
          <Route path="/master/company" component={ CompanyList } />
          <Route path="/user-pages/department" component={ DepartmentList } />
          <Route path="/user-pages/designation" component={ DesignationList } />

          <Route path="/icons/mdi" component={Mdi} />

          <Route path="/charts/chart-js" component={ChartJs} />


          <Route path="/user-pages/login-1" component={Login} />
          <Route path="/user-pages/register-1" component={Register1} />
          <Route path="/user-pages/user-management" component={ UserManagement } />
          <Route path="/user-pages/register-user" component={ RegisterUser } />


          <Route path="/error-pages/error-404" component={Error404} />
          <Route path="/error-pages/error-500" component={Error500} />


          <Redirect to="/dashboard" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;