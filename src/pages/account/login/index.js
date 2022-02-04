import React, {Component} from 'react';
import {View, Text, Image, StatusBar, StyleSheet} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import {pxToDpWidth} from '../../../utils/stylesKits';
import validator from '../../../utils/validator';
import Toast from '../../../utils/toast';
import request from '../../../utils/request';
import {
  PING,
  ACCOUNT_LOGIN,
  ACCOUNT_VALIDATEVCODE,
} from '../../../utils/pathMap';
import MyButton from '../../../component/MyButton/index';
import {CodeField, Cursor} from 'react-native-confirmation-code-field';
import AsyncStorage from '../../../utils/asyncStorage';
import {inject} from 'mobx-react';
@inject('RootStore')
class Login extends Component {
  state = {
    phoneNumber: '',
    phoneValid: true,
    showLogin: true,
    vCode: '',
    //重新获取验证码按钮倒计时文本
    countdownText: '重新获取验证码(60)',
    //倒计时中按钮不可用
    isInCountdown: false,
  };
  setVCode = vCode => {
    this.setState({
      vCode: vCode,
    });
  };
  phoneOnChange = phone => {
    this.setState({
      phoneNumber: phone,
    });
  };
  //注册事件处理
  register = () => {
    //判断手机号格式是否正确
    const phoneValid = validator.validatePhone(this.state.phoneNumber);
    this.setState({phoneValid: phoneValid});
    //不正确返回
    if (!phoneValid) {
      return;
    }
    //正确发送请求
    request
      .post(ACCOUNT_LOGIN)
      .then(res => {
        if (res.data.code === 200) {
          //请求成功，切换页面
          this.setState({
            showLogin: false,
          });
          this.countDown();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  //重新获取验证码
  getVCodeAgain = () => {
    //重新发送验证码
    //重新倒计时
    this.countDown();
  };
  //验证码填写完成
  vCodeSubmitEditing = () => {
    const {vCode, phoneNumber} = this.state;
    //验证 验证码长度是否合法
    if (vCode.length !== 6) {
      Toast.message('验证码错误', 2000, 'center');
      return;
    }
    //发送验证码和手机号到后台
    request
      .post(ACCOUNT_VALIDATEVCODE)
      .then(res => {
        if (res.data.code !== 200) {
          //验证失败
          Toast.message('验证码错误', 2000, 'center');
          return;
        } else {
          //验证成功
          //存储用户数据
          this.props.RootStore.setUserInfo(
            phoneNumber,
            res.data.data.token,
            res.data.data.user_id,
          );
          //存储用户数据到缓存
          AsyncStorage.storeData('userinfo', {
            phone: phoneNumber,
            token: res.data.data.token,
            userId: res.data.data.user_id,
          });
          if (res.data.data.is_new) {
            //若是新用户，跳转到填写个人信息
            this.props.navigation.navigate('UserInfo');
          } else {
            //若是老用户，跳转到首页
            this.props.navigation.navigate('Index');
          }
        }
      })
      .catch(err => {
        console.log(err);
        Toast.fail('服务器异常', 2000, 'center');
      });
  };
  //渲染登录页面
  renderLogin = () => {
    const {phoneNumber, phoneValid, showLogin} = this.state;
    return (
      <View>
        {/* 提示标题 */}
        <View>
          <Text style={{fontSize: pxToDpWidth(25), fontWeight: 'bold'}}>
            手机号注册登录
          </Text>
        </View>
        {/* 输入框 */}
        <View style={{marginTop: pxToDpWidth(20)}}>
          <Input
            placeholder="请输入手机号"
            value={phoneNumber}
            onChangeText={this.phoneOnChange}
            onSubmitEditing={this.register}
            keyboardType="number-pad"
            maxLength={11}
            errorMessage={phoneValid ? '' : '手机号码格式不正确'}
            leftIcon={{
              type: 'font-awesome',
              name: 'phone',
              size: pxToDpWidth(20),
            }}
          />
        </View>
        {/* 渐变按钮 */}
        <View>
          <MyButton
            onPress={this.register}
            style={{
              borderRadius: pxToDpWidth(20),
              width: '85%',
              height: pxToDpWidth(50),
              alignSelf: 'center',
            }}>
            注册
          </MyButton>
        </View>
      </View>
    );
  };
  //渲染填写验证码页面
  renderVCode = () => {
    const {phoneNumber, vCode, countdownText, isInCountdown} = this.state;
    const CELL_COUNT = 6;
    return (
      <View>
        {/* 文本提示 */}
        <View>
          <Text
            style={{
              fontSize: pxToDpWidth(25),
              fontWeight: 'bold',
              color: '#666',
            }}>
            输入6位验证码
          </Text>
        </View>
        <View style={{marginTop: pxToDpWidth(8)}}>
          <Text style={{fontSize: pxToDpWidth(15), color: '#888'}}>
            已发送到：+86 {phoneNumber}
          </Text>
        </View>
        {/* 验证码输入组件 */}
        <View>
          <CodeField
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            onSubmitEditing={this.vCodeSubmitEditing}
            value={vCode}
            onChangeText={this.setVCode}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </View>
        {/* 重新获取按钮 */}
        <View style={{marginTop: pxToDpWidth(20)}}>
          <MyButton
            disabled={isInCountdown}
            onPress={this.getVCodeAgain}
            style={{
              borderRadius: pxToDpWidth(20),
              width: '85%',
              height: pxToDpWidth(50),
              alignSelf: 'center',
            }}>
            {countdownText}
          </MyButton>
        </View>
      </View>
    );
  };
  //按钮倒计时
  countDown = () => {
    //判断是否还在倒计时
    if (this.state.isInCountdown) {
      return;
    }
    this.setState({
      isInCountdown: true,
    });
    let seconds = 60;
    this.setState({
      countdownText: '重新获取验证码(60s)',
    });
    let timeId = setInterval(() => {
      seconds--;
      this.setState({
        countdownText: `重新获取验证码(${seconds}s)`,
      });
      if (seconds === 0) {
        clearInterval(timeId);
        this.setState({
          countdownText: '重新获取验证码',
          isInCountdown: false,
        });
      }
    }, 1000);
  };
  render() {
    const {phoneNumber, phoneValid, showLogin} = this.state;
    return (
      <View>
        {/* 1.状态栏背景 */}
        <View>
          <StatusBar backgroundColor="transparent" translucent={true} />
        </View>
        {/* 2.背景图片 */}
        <View>
          <Image
            source={require('../../../res/profilebg.jpg')}
            style={{width: '100%', height: pxToDpWidth(200)}}
          />
        </View>
        {/* 3.手机注册登录 */}
        <View style={{padding: pxToDpWidth(20)}}>
          {showLogin ? this.renderLogin() : this.renderVCode()}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    // borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
    color: '#4169E1',
  },
  focusCell: {
    borderColor: '#2b8dbf',
  },
});
export default Login;
