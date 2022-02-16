import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, Modal} from 'react-native';
import {ImageHeaderScrollView} from 'react-native-image-header-scroll-view';
import {pxToDpWidth} from '../../../utils/stylesKits';
import {Carousel} from 'teaset';
import MyNav from '../../../component/MyNav/index';
import request from '../../../utils/request';
import {FRIEND_DETAIL} from '../../../utils/pathMap';
import IconFont from '../../../component/IconFont';
import SvgUri from 'react-native-svg-uri';
import {heartIcon} from '../../../res/fonts/iconSvg';
import MyButton from '../../../component/MyButton';
import ImageViewer from 'react-native-image-zoom-viewer';
import Toast from '../../../utils/toast';
import JMessage from '../../../utils/JMessage';
import {observer, inject} from 'mobx-react';
import log from '../../../utils/log';
@inject('UserStore')
@observer
class Index extends Component {
  state = {
    detail: null,
    showModal: false,
    images: [],
    currentIndex: 0,
    hasDynamic: true,
    dys: [1, 2],
  };
  isLoading = false;
  images = [
    require('../../../res/swiper1.png'),
    require('../../../res/swiper2.png'),
    require('../../../res/swiper3.png'),
    require('../../../res/swiper4.jpg'),
    require('../../../res/swiper5.jpg'),
    require('../../../res/swiper6.jpg'),
    require('../../../res/swiper7.jpg'),
  ];

  componentDidMount() {
    request
      .privateGet(FRIEND_DETAIL.replace(':id', this.props.route.params.id))
      .then(res => {
        this.setState({
          detail: res.data.data,
        });
        //detail info
        //{"age": 21, "age_diff": 0, , "fate_value": 96, "gender": "女", "marry": "未婚", "nickname": "Ema@", "xueli": "本科","avatar": "https://dl.bobopic.com/small/83213730.jpg", "dynamic": {"album": ["https://dl.bobopic.com/small/91740365.jpg", "https://dl.bobopic.com/small/82974459.jpg", "https://dl.bobopic.com/small/82980705.jpg", "https://dl.bobopic.com/small/92128983.jpg"], "content": "谁准你站起来了"}}
      })
      .catch(err => {
        console.log(err);
      });
  }
  goToChat = () => {
    //   获取当前用户信息
    // const user = this.props.UserStore.user;

    //   跳转聊天页面
    this.props.navigation.navigate('Chat', this.state.detail);
  };
  sendLike = () => {
    //获取登录用户信息
    const user = this.props.UserStore.user;
    // 获取发送对象 用户名
    const username = this.state.detail.nickname;
    // 将个人信息放入
    JMessage.sendTextMsg(user.nickname + ' 喜欢了你', username, {
      user: JSON.stringify(user),
    })
      .then(res => {
        //   喜欢成功
        Toast.smile('喜欢了Ta~', 1000, 'center');
      })
      .catch(err => {
        console.log(JSON.stringify(err.description));
      });
  };
  onScroll = ({nativeEvent}) => {
    log.log(JSON.stringify(nativeEvent), 'friend:detial');
    //判断是否触底
    if (
      nativeEvent.contentSize.height - //内容高度,这个页面所有的内容
        nativeEvent.layoutMeasurement.height - //可视内容高度，滚动条内容开始的距顶部高度
        nativeEvent.contentOffset.y < //滚动条距离顶部高度，最上方是0
      1
    ) {
      //   如果还有动态
      if (this.state.hasDynamic) {
        //获取更多动态
        Toast.message('加载中', 2000, 'bottom');
        if (!this.isLoading) {
          this.isLoading = true;
          //如果没有请求正在发送，则发送请求
          request
            .privateGet(
              FRIEND_DETAIL.replace(':id', this.props.route.params.id),
            )
            .then(res => {
              const dys = this.state.dys;
              const last = dys[dys.length];
              dys.push(last + 1);
              dys.push(last + 2);
              this.setState({dys: dys});
              this.isLoading = false;
              return;
            })
            .catch(err => {
              console.log(err);
            });
        }
      } else {
        Toast.message('到底啦', 2000, 'bottom');
      }
    }
  };
  //显示大图
  zoomImage = index => {
    const images = this.state.detail.dynamic.album.map((v, k) => {
      return {url: v, props: {}};
    });
    this.setState({
      showModal: true,
      currentIndex: index,
      images: images,
    });
    console.log('zoom image');
    console.log(this.state);
  };
  //渲染动态条目
  dynamic = key => {
    const dynamic = this.state.detail.dynamic;
    return (
      <View style={{padding: pxToDpWidth(10)}}>
        {/* 用户头像 昵称 标题 开始 */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: this.state.detail.avatar}}
            style={{
              width: pxToDpWidth(40),
              height: pxToDpWidth(40),
              borderRadius: pxToDpWidth(20),
            }}
          />
          <Text
            style={{marginLeft: pxToDpWidth(10), fontSize: pxToDpWidth(15)}}>
            {this.state.detail.nickname}
          </Text>
        </View>
        {/* 用户头像 昵称 标题 结束 */}
        {/* 动态内容 开始 */}
        <View style={{padding: pxToDpWidth(8)}}>
          {/* 文字部分 开始 */}
          <Text style={{fontSize: pxToDpWidth(18)}}>{dynamic.content}</Text>
          {/* 文字部分 结束 */}
          {/* 图片部分 开始 */}
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {dynamic.album.map((v, k) => {
              return (
                <TouchableOpacity key={k} onPress={() => this.zoomImage(k)}>
                  <Image
                    key={k}
                    source={{uri: v}}
                    style={{
                      marginTop: pxToDpWidth(5),
                      marginRight: pxToDpWidth(5),
                      width: pxToDpWidth(100),
                      height: pxToDpWidth(100),
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          {/* 图片部分 结束 */}
        </View>
        {/* 动态内容 结束 */}
      </View>
    );
  };

  render() {
    const {detail} = this.state;
    if (!detail) {
      return <View />;
    }
    return (
      <View style={{flex: 1}}>
        {/* 导航栏 开始 */}
        <MyNav title="个人详情" />
        {/* 导航栏 结束 */}
        {/* 轮播图 开始 */}
        <ImageHeaderScrollView
          maxHeight={pxToDpWidth(200)}
          minHeight={pxToDpWidth(44)}
          style={{position: 'relative'}}
          onScroll={e => this.onScroll(e)}
          renderForeground={() => (
            <Carousel
              control
              style={{
                height: pxToDpWidth(200),
                width: '100%',
              }}>
              {this.images.map((v, k) => {
                return (
                  <Image
                    key={k}
                    style={{width: '100%', height: pxToDpWidth(200)}}
                    resizeMode="cover"
                    source={v}
                  />
                );
              })}
            </Carousel>
          )}>
          {/* 轮播图 结束 */}
          {/* 下侧介绍文字 开始 */}
          <View
            style={{
              flex: 1,
              marginTop: pxToDpWidth(2),
              marginLeft: pxToDpWidth(2),
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: pxToDpWidth(10),
              alignItems: 'center',
              backgroundColor: '#B0C4DE',
            }}>
            <View>
              {/* 中间第一行昵称 年龄 */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text>{detail.nickname + ' '}</Text>
                <IconFont
                  name={detail.gender === '女' ? 'genderFemale' : 'genderMale'}
                  style={{color: '#EE82EE'}}
                />
                <Text>{' ' + detail.age + '岁'}</Text>
              </View>
              {/* 第二行 情感状态 学业水平 */}
              <View style={{marginTop: pxToDpWidth(10)}}>
                <Text>{`${detail.marry} | ${detail.xueli} | ${
                  Math.abs(detail.age_diff) <= 3
                    ? '年龄相仿'
                    : '相差' + detail.age_diff + '岁'
                }`}</Text>
              </View>
            </View>
            {/* 爱心缘分值 */}
            <View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    position: 'relative',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <SvgUri svgXmlData={heartIcon} width="34" height="34" />
                  <Text style={{position: 'absolute', color: '#E0FFFF'}}>
                    {detail.fate_value}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: pxToDpWidth(12),
                    marginTop: pxToDpWidth(3),
                    color: '#ee0000',
                  }}>
                  缘分值
                </Text>
              </View>
            </View>
          </View>
          {/* 下侧介绍文字 结束 */}
          {/* 动态标题栏 开始 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: pxToDpWidth(10),
            }}>
            {/* 左侧动态气泡 开始 */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: pxToDpWidth(15)}}>动态</Text>
              <View
                style={{
                  marginLeft: pxToDpWidth(5),
                  width: pxToDpWidth(20),
                  height: pxToDpWidth(20),
                  borderRadius: pxToDpWidth(10),
                  backgroundColor: 'red',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: pxToDpWidth(12), color: '#fff'}}>
                  3
                </Text>
              </View>
            </View>
            {/* 左侧动态气泡 结束 */}
            {/* 右侧按钮 开始 */}
            <View style={{flexDirection: 'row'}}>
              <MyButton
                onPress={this.goToChat}
                color={['#F4A460', '#FF7F50']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  width: pxToDpWidth(100),
                  height: pxToDpWidth(40),
                  borderRadius: pxToDpWidth(20),
                }}
                textStyle={{fontSize: pxToDpWidth(15), fontWeight: 'bold'}}>
                聊一下
              </MyButton>
              <MyButton
                onPress={this.sendLike}
                color={['#FFB5C5', '#FF34B3']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  width: pxToDpWidth(100),
                  height: pxToDpWidth(40),
                  borderRadius: pxToDpWidth(20),
                  marginLeft: pxToDpWidth(10),
                }}
                textStyle={{fontSize: pxToDpWidth(15), fontWeight: 'bold'}}>
                喜欢
              </MyButton>
            </View>
            {/* 右侧按钮 结束 */}
          </View>
          {/* 动态标题栏 结束 */}
          {/* 分割线 开始 */}
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              height: pxToDpWidth(1),
              //   backgroundColor: 'red',
              borderBottomColor: '#999',
              borderBottomWidth: pxToDpWidth(2),
            }}
          />
          {/* 分割线 开始 */}
          {/* 动态条目 开始 */}
          {this.state.dys.map((v, k) => {
            return (
              <View>
                {this.dynamic(k)}
                {/* 分割线 */}
                <View
                  style={{
                    borderColor: '#888',
                    borderBottomWidth: pxToDpWidth(1),
                    height: pxToDpWidth(1),
                    width: '95%',
                    marginVertical: pxToDpWidth(10),
                    alignSelf: 'center',
                  }}
                />
              </View>
            );
          })}
          {/* 动态条目 结束 */}
          {/* 大图显示 开始 */}
          <Modal visible={this.state.showModal} transparent={true}>
            <ImageViewer
              onClick={() => this.setState({showModal: false})}
              imageUrls={this.state.images}
              index={this.state.currentIndex}
            />
          </Modal>
          {/* 大图显示 结束 */}
        </ImageHeaderScrollView>
      </View>
    );
  }
}
export default Index;
