import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './pages/account/login/index';
import UserInfo from './pages/account/userinfo/index';
import Demo from './pages/demo';
import Index from './tabbar';
import AsyncStorage from './utils/asyncStorage';
import Toast from './utils/toast';
import {inject, observer} from 'mobx-react';
import Meta from './pages/friend/meta/index';
import Local from './pages/friend/local/index';
import Soul from './pages/friend/soul/index';
import SoulTest from './pages/friend/soul/test/index';
import SoulTestResult from './pages/friend/soul/testResult/index';
import Detail from './pages/friend/detail/index';
import Chat from './pages/message/chat/index';
import Comment from './pages/group/comment/index';
import Publish from './pages/group/publish/index';
import Demo2 from './pages/imagepicker_demo/index';
const Stack = createNativeStackNavigator();

@inject('RootStore')
@observer
class Nav extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.RootStore);
    this.state = {
      initialRouteName: this.props.RootStore.token ? 'Index' : 'Login',
    };
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          //   initialRouteName={this.state.initialRouteName}
          initialRouteName="Publish"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Demo" component={Demo} />
          <Stack.Screen name="Demo2" component={Demo2} />
          <Stack.Screen name="Publish" component={Publish} />
          <Stack.Screen name="Comment" component={Comment} />
          <Stack.Screen name="Index" component={Index} />
          <Stack.Screen name="Meta" component={Meta} />
          <Stack.Screen name="Local" component={Local} />
          <Stack.Screen name="Soul" component={Soul} />
          <Stack.Screen name="SoulTest" component={SoulTest} />
          <Stack.Screen name="SoulTestResult" component={SoulTestResult} />
          <Stack.Screen name="Detail" component={Detail} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="UserInfo" component={UserInfo} />
          {/* <Stack.Screen name="Demo" component={Demo} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Nav;
