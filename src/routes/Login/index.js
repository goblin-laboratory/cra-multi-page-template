import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Form, Card, Input, Icon, Button, notification } from 'antd';
import delay from '../../utils/delay';
import styles from './index.module.less';

const Login = ({ form }) => {
  const [loading, setLoading] = React.useState(false);
  const unmoutedRef = React.useRef(false);

  const onSubmit = React.useCallback(async values => {
    setLoading(true);
    await delay(1000);
    if (!unmoutedRef || unmoutedRef.current) {
      return;
    }
    if ('admin' !== values.username || '123456' !== values.password) {
      notification.error({ message: '用户名/密码错误' });
      setLoading(false);
      return;
    }
    localStorage.setItem('username', values.username);
    localStorage.setItem('usertitle', values.usertitle);
    notification.success({ message: '登录成功' });
    const { from } = queryString.parse(global.location.search);
    if (from) {
      global.location.replace(decodeURIComponent(from));
      return;
    }
    const pathname = global.location.pathname.replace(/\/[^/]*$/, '/');
    global.location.replace(`${global.location.origin}${pathname}`);
  }, []);

  React.useEffect(() => {
    return () => {
      unmoutedRef.current = true;
    };
  }, []);

  return (
    <Card className={styles.login}>
      <Form
        onSubmit={e => {
          e.preventDefault();
          form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
              onSubmit(values);
            }
          });
        }}
      >
        <Form.Item>
          {form.getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(<Input prefix={<Icon type="user" />} placeholder="请输入用户名" autoComplete="off" />)}
        </Form.Item>
        <Form.Item>
          {form.getFieldDecorator('usertitle', {
            rules: [{ required: true, message: '请输入用户昵称' }],
          })(<Input prefix={<Icon type="user" />} placeholder="请输入用户昵称" autoComplete="off" />)}
        </Form.Item>
        <Form.Item>
          {form.getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(<Input prefix={<Icon type="idcard" />} type="password" placeholder="请输入密码" autoComplete="off" />)}
        </Form.Item>
        <Form.Item help="用户名/密码：admin/123456">
          <Button type="primary" htmlType="submit" loading={loading} block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

Login.propTypes = {
  form: PropTypes.object.isRequired,
};

export default Form.create()(React.memo(Login));
