import React, {Component} from 'react';
import log from '../../../utils/log';
import {
  Text,
  StyleSheet,
  View,
  Alert,
  Dimensions,
  Button,
  Platform,
} from 'react-native';
import JMessage from '../../../utils/JMessage';
var RNFS = require('react-native-fs');

import IMUI from 'aurora-imui-react-native';
import {inject, observer} from 'mobx-react';
var InputView = IMUI.ChatInput;
var MessageListView = IMUI.MessageList;
const AuroraIController = IMUI.AuroraIMUIController;
const window = Dimensions.get('window');
let id = 100;
function constructNormalMessage() {
  let message = {
    msgId: (id++).toString(),
  };
  return message;
}
@inject('UserStore')
@observer
class TestRNIMUI extends Component {
  themsgid = 1;
  constructor(props) {
    super(props);
    let initHeight;
    if (Platform.OS === 'ios') {
      initHeight = 46;
    } else {
      initHeight = 100;
    }
    this.state = {
      inputLayoutHeight: initHeight,
      messageListLayout: {flex: 1, width: window.width, margin: 0},
      inputViewLayout: {width: window.width, height: initHeight},
      isAllowPullToRefresh: true,
      navigationBar: {},
    };

    this.updateLayout = this.updateLayout.bind(this);
    this.onMsgClick = this.onMsgClick.bind(this);
    this.messageListDidLoadEvent = this.messageListDidLoadEvent.bind(this);
  }
  componentDidMount() {
    /**
     * Android only
     * Must set menu height once, the height should be equals with the soft keyboard height so that the widget won't flash.
     * 在别的界面计算一次软键盘的高度，然后初始化一次菜单栏高度，如果用户唤起了软键盘，则之后会自动计算高度。
     */
    if (Platform.OS === 'android') {
      this.refs.ChatInput.setMenuContainerHeight(316);
    }
    this.resetMenu();
    AuroraIController.addMessageListDidLoadListener(
      this.messageListDidLoadEvent,
    );
  }

  messageListDidLoadEvent() {
    this.getHistoryMessage();
  }
  //获取历史消息
  getHistoryMessage() {
    JMessage.getHistoryMessage(this.props.route.params.nickname, 0, -1)
      .then(res => {
        let messages = [];

        const myNickname = this.props.UserStore.user.nickname;
        res.forEach(e => {
          //创建新的消息
          let message = {
            msgId: this.themsgid.toString(),
            status: 'send_succeed',
            date: new Date(e.createTime),
            timeString: new Date(e.createTime).toLocaleDateString(),
            isOutgoing: e.from.nickname === myNickname,
            fromUser: {
              userId: '',
              displayName: e.from.nickname,
              avatarPath:
                e.from.nickname === myNickname
                  ? this.props.UserStore.user.avatar
                  : this.props.route.params.avatar,
            },
          };
          this.themsgid++;
          //判断消息类型
          if (e.type === 'image') {
            message.msgType = 'image';
            message.mediaPath = e.thumbPath;
          } else if (e.type === 'text') {
            message.msgType = 'text';
            message.text = e.text;
          }
          messages.push(message);
        });
        AuroraIController.appendMessages(messages);
        AuroraIController.scrollToBottom(true);
      })
      .catch(err => {
        console.log(err);
      });
  }

  onInputViewSizeChange = size => {
    console.log(
      'onInputViewSizeChange height: ' + size.height + ' width: ' + size.width,
    );
    if (this.state.inputLayoutHeight != size.height) {
      this.setState({
        inputLayoutHeight: size.height,
        inputViewLayout: {width: window.width, height: size.height},
        messageListLayout: {flex: 1, width: window.width, margin: 0},
      });
    }
  };

  componentWillUnmount() {
    AuroraIController.removeMessageListDidLoadListener(
      this.messageListDidLoadEvent,
    );
  }

  resetMenu() {
    if (Platform.OS === 'android') {
      this.refs.ChatInput.showMenu(false);
      this.setState({
        messageListLayout: {flex: 1, width: window.width, margin: 0},
        navigationBar: {height: 64, justifyContent: 'center'},
      });
      this.forceUpdate();
    } else {
      AuroraIController.hidenFeatureView(true);
    }
  }

  /**
   * Android need this event to invoke onSizeChanged
   */
  onTouchEditText = () => {
    this.refs.ChatInput.showMenu(false);
  };

  onFullScreen = () => {
    console.log('on full screen');
    this.setState({
      messageListLayout: {flex: 0, width: 0, height: 0},
      inputViewLayout: {flex: 1, width: window.width, height: window.height},
      navigationBar: {height: 0},
    });
  };

  onRecoverScreen = () => {
    // this.setState({
    //   inputLayoutHeight: 100,
    //   messageListLayout: { flex: 1, width: window.width, margin: 0 },
    //   inputViewLayout: { flex: 0, width: window.width, height: 100 },
    //   navigationBar: { height: 64, justifyContent: 'center' }
    // })
  };

  onAvatarClick = message => {
    Alert.alert();
    AuroraIController.removeMessage(message.msgId);
  };

  onMsgClick(message) {
    console.log(message);
    Alert.alert('message', JSON.stringify(message));
  }

  onMsgLongClick = message => {
    Alert.alert('message bubble on long press', 'message bubble on long press');
  };

  onStatusViewClick = message => {
    message.status = 'send_succeed';
    AuroraIController.updateMessage(message);
  };

  onBeginDragMessageList = () => {
    this.resetMenu();
    AuroraIController.hidenFeatureView(true);
  };

  onTouchMsgList = () => {
    AuroraIController.hidenFeatureView(true);
  };

  onPullToRefresh = () => {
    console.log('on pull to refresh');
    var messages = [];
    for (var i = 0; i < 14; i++) {
      var message = constructNormalMessage();
      // if (index%2 == 0) {
      message.msgType = 'text';
      message.text = '' + i;
      // }

      if (i % 3 == 0) {
        message.msgType = 'video';
        message.text = '' + i;
        message.mediaPath =
          '/storage/emulated/0/ScreenRecorder/screenrecorder.20180323101705.mp4';
        message.duration = 12;
      }
      messages.push(message);
    }
    AuroraIController.insertMessagesToTop(messages);
    if (Platform.OS === 'android') {
      this.refs.MessageList.refreshComplete();
    }
  };

  onSendText = text => {
    const user = this.props.UserStore.user;
    let message = {
      msgId: this.themsgid.toString(),
      status: 'send_going',
      date: new Date(),
      timeString: new Date().toLocaleDateString(),
      isOutgoing: true,
      fromUser: {
        userId: '',
        displayName: user.nickname,
        avatarPath: user.avatar,
      },
    };
    this.themsgid++;
    message.msgType = 'text';
    message.text = text;
    AuroraIController.appendMessages([message]);
    JMessage.sendTextMsg(text, this.props.route.params.nickname, {
      user: JSON.stringify(user),
    })
      .then(res => {
        //发送成功
        AuroraIController.updateMessage({...message, status: 'send_succeed'});
      })
      .catch(err => {
        log.error(err, 'chat send text');
        AuroraIController.updateMessage({...message, status: 'send_failed'});
      });
  };

  onTakePicture = media => {
    console.log('media ' + JSON.stringify(media));
    var message = constructNormalMessage();
    message.msgType = 'image';
    message.mediaPath = media.mediaPath;
    AuroraIController.appendMessages([message]);
    this.resetMenu();
    AuroraIController.scrollToBottom(true);
  };

  onStartRecordVoice = e => {
    console.log('on start record voice');
  };

  onFinishRecordVoice = (mediaPath, duration) => {
    var message = constructNormalMessage();
    message.msgType = 'voice';
    message.mediaPath = mediaPath;
    message.timeString = 'safsdfa';
    message.duration = duration;
    AuroraIController.appendMessages([message]);
    console.log('on finish record voice');
  };

  onCancelRecordVoice = () => {
    console.log('on cancel record voice');
  };

  onStartRecordVideo = () => {
    console.log('on start record video');
  };

  onFinishRecordVideo = video => {
    // var message = constructNormalMessage()
    // message.msgType = "video"
    // message.mediaPath = video.mediaPath
    // message.duration = video.duration
    // AuroraIController.appendMessages([message])
  };

  onSendGalleryFiles = mediaFiles => {
    const user = this.props.UserStore.user;
    log.log('send image', 'chat:send gallery files');
    //返回的是原图，先进行裁剪，不然耗内存
    // mediaFiles: [{"height": 3240, "mediaPath": "/storage/emulated/0/Download/3qp39eea9d2k2lhigjy1v06f1oqye1h.png", "mediaType": "image", "size": 1193189, "width": 2000}]
    mediaFiles.forEach(e => {
      let message = {
        msgId: this.themsgid.toString(),
        status: 'send_going',
        date: new Date(),
        timeString: new Date().toLocaleDateString(),
        isOutgoing: true,
        fromUser: {
          userId: '',
          displayName: user.nickname,
          avatarPath: user.avatar,
        },
      };
      if (e.mediaType === 'image') {
        message.msgType = 'image';
      } else {
        message.msgType = 'video';
        message.duration = e.duration;
      }
      message.mediaPath = e.mediaPath;
      JMessage.sendImageMsg(this.props.route.params.nickname, e.mediaPath, {
        user: JSON.stringify(user),
      })
        .then(res => {
          //发送成功, res为发送的信息详情
          AuroraIController.updateMessage({...message, status: 'send_succeed'});
        })
        .catch(err => {
          console.log(err);
          //发送失败
          AuroraIController.updateMessage({...message, status: 'send_failed'});
        });
      AuroraIController.appendMessages([message]);
      AuroraIController.scrollToBottom(true);
    });
    this.resetMenu();
  };

  onSwitchToMicrophoneMode = () => {
    AuroraIController.scrollToBottom(true);
  };

  onSwitchToEmojiMode = () => {
    AuroraIController.scrollToBottom(true);
  };
  onSwitchToGalleryMode = () => {
    AuroraIController.scrollToBottom(true);
  };

  onSwitchToCameraMode = () => {
    AuroraIController.scrollToBottom(true);
  };

  onShowKeyboard = keyboard_height => {};

  updateLayout(layout) {
    this.setState({inputViewLayout: layout});
  }

  onInitPress() {
    console.log('on click init push ');
    this.updateAction();
  }

  onClickSelectAlbum = () => {
    console.log('on click select album');
  };

  onCloseCamera = () => {
    console.log('On close camera event');
    this.setState({
      inputLayoutHeight: 100,
      messageListLayout: {flex: 1, width: window.width, margin: 0},
      inputViewLayout: {flex: 0, width: window.width, height: 100},
      navigationBar: {height: 64, justifyContent: 'center'},
    });
  };

  /**
   * Switch to record video mode or not
   */
  switchCameraMode = isRecordVideoMode => {
    console.log(
      'Switching camera mode: isRecordVideoMode: ' + isRecordVideoMode,
    );
    // If record video mode, then set to full screen.
    if (isRecordVideoMode) {
      this.setState({
        messageListLayout: {flex: 0, width: 0, height: 0},
        inputViewLayout: {flex: 1, width: window.width, height: window.height},
        navigationBar: {height: 0},
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={this.state.navigationBar} ref="NavigatorView">
          <Text>{this.props.route.params.nickname}</Text>
          {/* <Button
            style={styles.sendCustomBtn}
            title={this.props.route.params.nickname}
            onPress={() => {
              if (Platform.OS === 'ios') {
                var message = constructNormalMessage();
                message.msgType = 'custom';
                message.content = `
                <h5>This is a custom message. </h5>
                <img src="file://${RNFS.MainBundlePath}/default_header.png"/>
                `;
                console.log(message.content);
                message.contentSize = {height: 100, width: 200};
                message.extras = {extras: 'fdfsf'};
                AuroraIController.appendMessages([message]);
                AuroraIController.scrollToBottom(true);
              } else {
                var message = constructNormalMessage();
                message.msgType = 'custom';
                message.msgId = '10';
                message.status = 'send_going';
                message.isOutgoing = true;
                message.content = `
                <body bgcolor="#ff3399">
                  <h5>This is a custom message. </h5>
                  <img src="/storage/emulated/0/XhsEmoticonsKeyboard/Emoticons/wxemoticons/icon_040_cover.png"></img>
                </body>`;
                message.contentSize = {height: 100, width: 200};
                message.extras = {extras: 'fdfsf'};
                var user = {
                  userId: '1',
                  displayName: '',
                  avatarPath: '',
                };
                user.displayName = '0001';
                user.avatarPath = 'ironman';
                message.fromUser = user;
                AuroraIController.appendMessages([message]);
              }
            }}
          /> */}
        </View>
        <MessageListView
          style={this.state.messageListLayout}
          ref="MessageList"
          isAllowPullToRefresh={true}
          onAvatarClick={this.onAvatarClick}
          onMsgClick={this.onMsgClick}
          onStatusViewClick={this.onStatusViewClick}
          onTouchMsgList={this.onTouchMsgList}
          onTapMessageCell={this.onTapMessageCell}
          onBeginDragMessageList={this.onBeginDragMessageList}
          onPullToRefresh={this.onPullToRefresh}
          avatarSize={{width: 50, height: 50}}
          avatarCornerRadius={25}
          messageListBackgroundColor={'#f3f3f3'}
          sendBubbleTextSize={18}
          sendBubbleTextColor={'#000000'}
          sendBubblePadding={{left: 10, top: 10, right: 15, bottom: 10}}
          datePadding={{left: 5, top: 5, right: 5, bottom: 5}}
          dateBackgroundColor={'#F3F3F3'}
          photoMessageRadius={5}
          maxBubbleWidth={0.7}
          videoDurationTextColor={'#ffffff'}
          dateTextColor="#000000"
        />
        <InputView
          style={this.state.inputViewLayout}
          ref="ChatInput"
          onSendText={this.onSendText}
          onTakePicture={this.onTakePicture}
          onStartRecordVoice={this.onStartRecordVoice}
          onFinishRecordVoice={this.onFinishRecordVoice}
          onCancelRecordVoice={this.onCancelRecordVoice}
          onStartRecordVideo={this.onStartRecordVideo}
          onFinishRecordVideo={this.onFinishRecordVideo}
          onSendGalleryFiles={this.onSendGalleryFiles}
          onSwitchToEmojiMode={this.onSwitchToEmojiMode}
          onSwitchToMicrophoneMode={this.onSwitchToMicrophoneMode}
          onSwitchToGalleryMode={this.onSwitchToGalleryMode}
          onSwitchToCameraMode={this.onSwitchToCameraMode}
          onShowKeyboard={this.onShowKeyboard}
          onTouchEditText={this.onTouchEditText}
          onFullScreen={this.onFullScreen}
          onRecoverScreen={this.onRecoverScreen}
          onSizeChange={this.onInputViewSizeChange}
          closeCamera={this.onCloseCamera}
          switchCameraMode={this.switchCameraMode}
          showSelectAlbumBtn={true}
          showRecordVideoBtn={false}
          onClickSelectAlbum={this.onClickSelectAlbum}
          inputPadding={{left: 30, top: 10, right: 10, bottom: 10}}
          galleryScale={0.6} //default = 0.5
          compressionQuality={0.6}
          cameraQuality={0.7} //default = 0.5
          customLayoutItems={{
            left: [],
            right: ['send'],
            bottom: ['voice', 'gallery', 'emoji', 'camera'],
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sendCustomBtn: {},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  inputView: {
    backgroundColor: 'green',
    width: window.width,
    height: 100,
  },
  btnStyle: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#3e83d7',
    borderRadius: 8,
    backgroundColor: '#3e83d7',
  },
});
export default TestRNIMUI;
