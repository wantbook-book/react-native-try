import React, {Component} from 'react';
import TabNavigator from 'react-native-tab-navigator';
import SvgUri from 'react-native-svg-uri';
import Friend from './pages/friend/index';
import Group from './pages/group/index';
import Message from './pages/message/index';
import Me from './pages/me/index';
import {messageIcon, friendIcon, meIcon, groupIcon} from './res/fonts/iconSvg';
import request from './utils/request';
import {MY_INFO} from './utils/pathMap';
import {observer, inject} from 'mobx-react';
import JMessage from './utils/JMessage';
import Toast from './utils/toast';
@inject('UserStore')
@observer
class Index extends Component {
  state = {
    selectedTab: 'group',
    pages: [
      {
        selected: 'friend',
        title: '交友',
        renderIcon: () => (
          <SvgUri svgXmlData={friendIcon} width="20" height="20" />
        ),
        renderSelectedIcon: () => (
          <SvgUri svgXmlData={friendIcon} width="20" height="20" />
        ),
        onPress: () => this.setState({selectedTab: 'friend'}),
        component: <Friend />,
      },
      {
        selected: 'group',
        title: '圈子',
        renderIcon: () => (
          <SvgUri svgXmlData={groupIcon} width="20" height="20" />
        ),
        renderSelectedIcon: () => (
          <SvgUri svgXmlData={groupIcon} width="20" height="20" />
        ),
        onPress: () => this.setState({selectedTab: 'group'}),
        component: <Group />,
      },
      {
        selected: 'message',
        title: '消息',
        renderIcon: () => (
          <SvgUri svgXmlData={messageIcon} width="20" height="20" />
        ),
        renderSelectedIcon: () => (
          <SvgUri svgXmlData={messageIcon} width="20" height="20" />
        ),
        onPress: () => this.setState({selectedTab: 'message'}),
        component: <Message />,
      },
      {
        selected: 'me',
        title: '我的',
        renderIcon: () => <SvgUri svgXmlData={meIcon} width="20" height="20" />,
        renderSelectedIcon: () => (
          <SvgUri svgXmlData={meIcon} width="20" height="20" />
        ),
        onPress: () => this.setState({selectedTab: 'me'}),
        component: <Me />,
      },
    ],
  };
  componentDidMount() {
    JMessage.logout();
    //获取用户信息
    request
      .privateGet(MY_INFO)
      .then(res => {
        const info = res.data.data.info;
        //   保存用户信息到mobx
        this.props.UserStore.setUser(info);
        // 极光登录
        return JMessage.login(info.nickname, '123456');
      })
      .then(res => {
        if (res === 0) {
          Toast.smile('欢迎回来', 2000, 'center');
        } else {
          Toast.fail(res.description, 2000, 'center');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    const {pages, selectedTab} = this.state;
    return (
      <TabNavigator>
        {pages.map((v, i) => (
          <TabNavigator.Item
            key={i}
            selected={selectedTab === v.selected}
            title={v.title}
            renderIcon={v.renderIcon}
            renderSelectedIcon={v.renderSelectedIcon}
            onPress={v.onPress}>
            {v.component}
          </TabNavigator.Item>
        ))}
      </TabNavigator>
    );
  }
}
export default Index;
