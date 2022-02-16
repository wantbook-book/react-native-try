import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackgroundComponent,
} from 'react-native';
import request from '../../../utils/request';
import {FRIEND_LOCALSEARCH} from '../../../utils/pathMap';
import {
  pxToDpWidth,
  screenHeight,
  screenWidth,
} from '../../../utils/stylesKits';
import {locationIcon} from '../../../res/fonts/iconSvg';
import FilterPannel from './filterPannel';
import IconFont from '../../../component/IconFont';
import {Overlay} from 'teaset';
class Index extends Component {
  state = {
    local: [],
  };
  params = {
    distance: 2,
    gender: '男',
  };
  FarLevel = {
    L1: {width: pxToDpWidth(60), height: pxToDpWidth(90)},
    L2: {width: pxToDpWidth(50), height: pxToDpWidth(75)},
    L3: {width: pxToDpWidth(40), height: pxToDpWidth(60)},
    L4: {width: pxToDpWidth(30), height: pxToDpWidth(45)},
    L5: {width: pxToDpWidth(20), height: pxToDpWidth(30)},
    L6: {width: pxToDpWidth(14), height: pxToDpWidth(21)},
  };
  decideFarLevel = distance => {
    if (distance < 100) {
      return 'L1';
    } else if (distance < 300) {
      return 'L2';
    } else if (distance < 800) {
      return 'L3';
    } else if (distance < 1500) {
      return 'L4';
    } else if (distance < 5000) {
      return 'L5';
    } else {
      return 'L6';
    }
  };
  filterHandle = () => {
    let overlayViewRef = null;
    const {page, pageSize, ...others} = this.state;
    let overlayView = (
      <Overlay.View
        style={{alignItems: 'center', justifyContent: 'center'}}
        modal={true}
        overlayOpacity={0.3}
        ref={v => (overlayViewRef = v)}>
        <FilterPannel
          onSubmitFilter={this.submitFilter}
          params={others}
          close={() => overlayViewRef.close()}
        />
      </Overlay.View>
    );
    Overlay.show(overlayView);
  };
  //   子组件向本组件传递数据
  submitFilter = params => {
    this.params = params;
    // 筛选 重新请求
    request
      .privateGet(FRIEND_LOCALSEARCH, this.params)
      .then(res => {
        if (res.data.data) {
          this.setState({
            local: res.data.data.local,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  componentDidMount() {
    request
      .privateGet(FRIEND_LOCALSEARCH, this.params)
      .then(res => {
        if (res.data.data) {
          this.setState({
            local: res.data.data.local,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    const {local} = this.state;
    return (
      <View>
        <StatusBar backgroundColor={'transparent'} translucent={true} />
        <ImageBackground
          source={require('../../../res/local_search.gif')}
          style={{
            height: '100%',
            width: '100%',
            position: 'relative',
          }}>
          {/* 右上角筛选图标 开始 */}
          <View
            style={{
              position: 'absolute',
              right: pxToDpWidth(30),
              top: pxToDpWidth(20),
              backgroundColor: 'white',
              opacity: 0.8,
              width: pxToDpWidth(40),
              height: pxToDpWidth(40),
              borderRadius: pxToDpWidth(20),
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}>
            <IconFont
              onPress={this.filterHandle}
              name="select"
              style={{color: '#1E90FF', fontSize: pxToDpWidth(30)}}
            />
          </View>
          {/* 右上角筛选图标 结束 */}
          {/* 好友定位图标 */}
          {local.map((v, k) => {
            const {width, height} =
              this.FarLevel[this.decideFarLevel(v.distance)];
            const tx = Math.random() * (screenWidth - width);
            const ty =
              Math.random() *
                (screenHeight - height - pxToDpWidth(20) - pxToDpWidth(90)) +
              pxToDpWidth(20);

            return (
              <TouchableOpacity
                style={{position: 'absolute', top: ty, left: tx}}>
                {/* 定位图标 开始*/}
                <ImageBackground
                  key={k}
                  source={require('../../../res/position3.png')}
                  style={{
                    width: width,
                    height: height,
                    opacity: 0.8,
                    resizeMode: 'stretch',
                    position: 'relative',
                    alignItems: 'center',
                  }}>
                  {/* 昵称 开始*/}
                  <View style={{position: 'absolute', top: -pxToDpWidth(18)}}>
                    <Text style={{color: 'white'}}>{v.nickname}</Text>
                  </View>
                  {/* 昵称 结束*/}
                  <View
                    style={{
                      width: width,
                      height: width,
                      borderRadius: width / 2,
                      backgroundColor: '#FF83FA',
                    }}>
                    {/* 头像 开始、 */}
                    <ImageBackground
                      soure={require('../../../res/coverbg.jpg')}
                      style={{
                        width: width,
                        height: height,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: pxToDpWidth(30),
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: pxToDpWidth(width / 4.5),
                        }}>
                        好丑
                      </Text>
                    </ImageBackground>
                    {/* 头像 结束、 */}
                  </View>
                </ImageBackground>
                {/* 定位图标 结束*/}
              </TouchableOpacity>
            );
          })}
          {/* 下方提示文字 开始*/}
          <View
            style={{
              position: 'absolute',
              bottom: pxToDpWidth(50),
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Text style={{fontSize: pxToDpWidth(16), color: '#8B8989'}}>
              您附近有
              <Text
                style={{
                  fontSize: pxToDpWidth(22),
                  color: '#FF3030',
                  fontWeight: 'bold',
                }}>
                {this.state.local.length}
              </Text>
              个好友
            </Text>
            <Text style={{fontSize: pxToDpWidth(16), color: '#8B8989'}}>
              选择聊聊
            </Text>
          </View>
          {/* 下方提示文字 结束*/}
        </ImageBackground>
      </View>
    );
  }
}
export default Index;
