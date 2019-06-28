import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import dva from 'dva';
import { hashHistory } from 'dva/router';
import createLoading from 'dva-loading';
// import { createLogger } from 'redux-logger';
import * as serviceWorker from '../serviceWorker';
import './index.module.less';

// 1. Initialize
const app = dva({
  history: hashHistory,
});

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Register global model
app.model(require('../models/app').default);

// 4. Router
// app.router(router);
app.router(require('./routers/app').default);

// 5. Start
app.start('#root');

serviceWorker.register();

export default app._store; // eslint-disable-line
