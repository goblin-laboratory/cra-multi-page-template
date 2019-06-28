import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import showModal from '../utils/showModal';
import delay from '../utils/delay';

const loadingPagePathname = '/';

const jump2login = () => {
  const pathname = global.location.pathname.replace(/\/[^/]*$/, '/login.html');
  const search = queryString.stringify({ from: global.location.href });
  global.location.replace(`${global.location.origin}${pathname}?${search}`);
};

export default {
  namespace: 'app',

  state: {
    userInfo: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'jump2loading', payload: history.location });
      return history.listen(({ pathname, search }) => {
        if (loadingPagePathname === pathname) {
          dispatch({ type: 'load', payload: search });
        }
      });
    },
  },

  effects: {
    *jump2loading({ payload }, { put }) {
      if (loadingPagePathname === payload.pathname) {
        return;
      }
      const parsed = queryString.parse(payload.search);
      const search = queryString.stringify({ ...parsed, pathname: payload.pathname });
      yield put(routerRedux.replace({ pathname: loadingPagePathname, search }));
    },
    *load({ payload }, { put, call }) {
      yield call(delay, 3000);
      const username = localStorage.getItem('username');
      const usertitle = localStorage.getItem('usertitle');
      if (!usertitle) {
        yield put({ type: 'loginFaild' });
        return;
      }
      yield put({ type: 'save', payload: { userInfo: { username, usertitle } } });
      const { pathname, ...parsed } = queryString.parse(payload);
      const search = queryString.stringify(parsed);
      yield put(routerRedux.replace({ pathname, search }));
      if (pathname) {
        yield put(routerRedux.replace({ pathname, search }));
      } else {
        yield put(routerRedux.replace('/dashboard'));
      }
    },
    *loginFaild({ payload }, { call, put }) {
      const content = (payload && payload.content) || '用户未登录，请登录';
      const confirmed = yield call(showModal, 'info', { title: '提示', content, okText: '去登录' });
      if (confirmed) {
        yield put({ type: 'save', payload: { userInfo: null } });
        jump2login();
      }
    },
    *logout({ payload }, { put, call }) {
      const confirmed = yield call(showModal, 'confirm', {
        title: '注销',
        content: '确认要退出登录吗？',
      });
      if (confirmed) {
        localStorage.removeItem('usertitle');
        yield put({ type: 'save', payload: { userInfo: null } });
        jump2login();
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
