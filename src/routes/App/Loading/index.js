import React from 'react';
import { Icon } from 'antd';
import styles from './index.module.less';

const Loading = () => (
  <div className={styles.loading}>
    <Icon type="loading" />
  </div>
);

export default Loading;
