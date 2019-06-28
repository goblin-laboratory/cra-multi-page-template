import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import { Result } from 'ant-design-pro';
import styles from './index.module.less';

const Dashboard = ({ dispatch, userInfo }) => {
  const onLogout = React.useCallback(() => {
    dispatch({ type: 'app/logout' });
  }, [dispatch]);

  return (
    <Card className={styles.dashboard}>
      <Result
        type="success"
        title="登录成功"
        description={
          <>
            <div>用户名: {userInfo.username}</div>
            <div>昵称: {userInfo.usertitle}</div>
          </>
        }
        actions={<Button onClick={onLogout}>注销</Button>}
      />
    </Card>
  );
};

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(state => ({
  userInfo: state.app.userInfo,
}))(Dashboard);
