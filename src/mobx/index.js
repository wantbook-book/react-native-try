import {makeAutoObservable} from 'mobx';
class RootStore {
  constructor() {
    makeAutoObservable(this);
  }
  phone = null;
  userId = null;
  token = null;
  setUserInfo(phone, token, userId) {
    this.phone = phone;
    this.token = token;
    this.userId = userId;
  }
}

export default new RootStore();
