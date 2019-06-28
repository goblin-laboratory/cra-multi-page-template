import { Modal } from 'antd';

const showModal = (type, opts) => {
  let modal = null;
  const promise = new Promise(resolve => {
    modal = Modal[type]({
      ...opts,
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  }).finally(() => {
    modal = null;
    delete promise.modal;
  });
  promise.modal = modal;
  promise.clear = () => {
    if (modal) {
      try {
        modal.destory();
      } catch (errMsg) {
        // debugger;
      }
    }
    modal = null;
    delete promise.modal;
  };
  return promise;
};

export default showModal;
