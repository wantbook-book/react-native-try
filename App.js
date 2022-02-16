import React, {Component} from 'react';
import Nav from './src/nav';
import Geo from './src/utils/geo';
import {View, Button} from 'react-native';
import {Provider} from 'mobx-react';
import RootStore from './src/mobx/index';
import JMessage from './src/utils/JMessage';
import AsyncStorage from './src/utils/asyncStorage';
import UserStore from './src/mobx/userStore';
class App extends Component {
  state = {
    hasInitedGeo: false,
  };
  async componentDidMount() {
    JMessage.init();

    AsyncStorage.getData('userinfo')
      .then(data => {
        if (data) {
          RootStore.setUserInfo(data.phone, data.token, data.userId);
        }
      })
      .catch(err => {
        console.log(err);
      });
    await Geo.initGeo();
    this.setState({
      hasInitedGeo: true,
    });
  }
  render() {
    return this.state.hasInitedGeo ? (
      <Provider UserStore={UserStore} RootStore={RootStore}>
        <Nav />
      </Provider>
    ) : (
      <View />
    );
    // return <Demo />;
  }
}

export default App;
