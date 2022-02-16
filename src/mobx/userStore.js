import {makeAutoObservable} from 'mobx';
class UserStore {
  constructor() {
    makeAutoObservable(this);
  }
  user = {
    avatar: 'https://dl.bobopic.com/small/89437956.jpg',
    nickname: 'hannibal',
  };
  setUser(user) {
    this.user = user;
  }
}

export default new UserStore();
