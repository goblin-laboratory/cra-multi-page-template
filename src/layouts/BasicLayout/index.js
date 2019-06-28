import React from 'react';
import { Switch, Redirect, Route } from 'dva/router';
import Loading from '../../routes/App/Loading';
import Dashboard from '../../routes/App/Dashboard';
import styles from './index.module.less';

// const Loading = React.lazy(() => import('../../routes/App/Loading'));
// const Dashboard = React.lazy(() => import('../../routes/App/Dashboard'));

const BasicLayout = () => (
  <div className={styles.center}>
    <Switch>
      <Route path="/" exact component={Loading} />
      <Route path="/dashboard" component={Dashboard} />
      <Redirect from="(.*)" to="/" />
    </Switch>
  </div>
);

export default BasicLayout;
