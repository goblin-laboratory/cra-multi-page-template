import React from 'react';
import dva from 'dva';
import createHistory from 'history/createHashHistory';

// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
// app.use({});

// 3. Register global model
// app.model(require('../models/index').default);

// 4. Router
app.router(() => <div>Test</div>);

// 5. Start
app.start('#root');
