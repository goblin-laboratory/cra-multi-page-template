import React from 'react';
import { Switch, Redirect, Route } from 'dva/router';
// import { Card } from 'antd';
import Login from '../../routes/Login';
import styles from './index.module.less';

const LoginLayout = () => (
  <div className={styles.center}>
    <Switch>
      <Route path="/" exact component={Login} />
      <Redirect from="(.*)" to="/" />
    </Switch>
  </div>
);

export default LoginLayout;
