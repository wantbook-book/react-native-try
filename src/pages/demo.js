import React, {Component} from 'react';
import {View, Button} from 'react-native';
import JMessage from '../utils/JMessage';
import Toast from '../utils/toast';
class Index extends Component {
  demoClick = () => {
    JMessage.logout();
    JMessage.login('Ema@', '123456')
      .then(res => {
        if (res === 0) {
          // 登录成功
          return JMessage.sendTextMsg('hi, i am Ema :)', 'hannibal');
        }
      })
      .then(res => {
        //发送成功
        Toast.smile('发送成功', 2000, 'center');
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    return (
      <View>
        <Button title="button" onPress={this.demoClick} />
      </View>
    );
  }
}
export default Index;
