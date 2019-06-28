import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import BasicLayout from '../../layouts/BasicLayout';

const RouterConfig = ({ history, app }) => (
  <LocaleProvider locale={zhCN}>
    <Router history={history}>
      <Switch>
        <Route path="(.*)" render={props => <BasicLayout {...props} app={app} />} />
      </Switch>
    </Router>
  </LocaleProvider>
);

RouterConfig.propTypes = {
  app: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default RouterConfig;
