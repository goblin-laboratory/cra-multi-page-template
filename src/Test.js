import React, { Component } from 'react';
import { Button } from 'antd';
import styles from './Test.module.less';

class Test extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.primaryText}>Primary Text</div>
        <div><Button type="primary">Primary Text</Button></div>
      </div>
    );
  }
}

export default Test;
