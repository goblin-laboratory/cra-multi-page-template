export default timeout => {
  return new Promise(resolve => {
    global.setTimeout(resolve, timeout);
  });
};
