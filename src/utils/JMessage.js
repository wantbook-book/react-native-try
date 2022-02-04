import JMessage from 'jmessage-react-plugin';
export default {
  init: () => {
    JMessage.init({
      appkey: 'a47ba057faff025d90f2a1aa',
      isOpenMessageRoaming: true,
      isProduction: false,
      channel: '',
    });
  },
  register: (username, password) => {
    return new Promise((resolve, reject) => {
      JMessage.register(
        {
          username: username,
          password: password,
        },
        resolve,
        reject,
      );
    });
  },
  login: (username, password) => {
    return new Promise((resolve, reject) => {
      JMessage.login(
        {
          username: username,
          password: password,
        },
        resolve,
        reject,
      );
    });
  },
};
