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
  logout: () => {
    JMessage.logout();
  },
  /**
   *
   * @param {String} username 要获取与谁的历史消息
   * @param {Number} from 从第几条开始
   * @param {Number} limit 一共需要几条
   * @returns
   */
  getHistoryMessage: (username, from, limit) => {
    return new Promise((resolve, reject) => {
      JMessage.getHistoryMessages(
        {type: 'single', username: username, from: from, limit: limit},
        resolve,
        reject,
      );
    });
  },
  getMyInfo: () => {
    return new Promise((resolve, reject) => {
      JMessage.getMyInfo(userInfo => {
        if (userInfo.username === undefined) {
          resolve('未登录');
        } else {
          resolve(userInfo);
        }
      });
    });
  },
  /**
   *
   * @param {String} msg 文本消息
   * @param {String} username 发送给的对象
   * @param {Object} extras 额外参数
   * @returns
   */
  sendTextMsg: (msg, username, extras = {}) => {
    return new Promise((resolve, reject) => {
      JMessage.sendTextMessage(
        {
          type: 'single',
          username: username,
          text: msg,
          extras: extras,
        },
        res => {
          // do something.
          resolve(res);
        },
        err => {
          reject(err);
        },
      );
    });
  },
  /**
   * 发送图片消息
   * @param {String} username 发送对象用户名
   * @param {String} imagePath 图片路径
   * @param {Object} extras 额外参数
   * @returns
   */
  sendImageMsg: (username, imagePath, extras = {}) => {
    return new Promise((resolve, reject) => {
      JMessage.sendImageMessage(
        {type: 'single', username: username, path: imagePath, extras: extras},
        resolve,
        reject,
      );
    });
  },
};
