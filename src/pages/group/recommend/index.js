import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
  GROUP_RECOMMEND,
  GROUP_LIKE,
  GROUP_NOINTEREST,
} from '../../../utils/pathMap';
import request from '../../../utils/request';
import log from '../../../utils/log';
import {pxToDpWidth} from '../../../utils/stylesKits';
import date from '../../../utils/date';
import JMessage from '../../../utils/JMessage';
import {observer, inject} from 'mobx-react';
import {ActionSheet} from 'teaset';
import {NavigationContext} from '@react-navigation/native';
@inject('UserStore')
@observer
class Index extends Component {
  static contextType = NavigationContext;
  state = {
    //推荐的动态
    list: [],
    showModal: false,
    currentImageIndex: 0,
    images: [],
    likeOrNot: [],
  };
  stillHave = true;
  sending = false;
  uid = 0;
  images = [
    'https://dl.bobopic.com/small/85509839.jpg',
    'https://dl.bobopic.com/small/73070335.jpg',
    'https://dl.bobopic.com/small/75979218.jpg',
    'https://dl.bobopic.com/small/88934564.jpg',
    // require('../../../res/swiper1.png'),
    // require('../../../res/swiper2.png'),
    // require('../../../res/swiper3.png'),
    // require('../../../res/swiper4.jpg'),
    // require('../../../res/swiper5.jpg'),
    // require('../../../res/swiper6.jpg'),
    // require('../../../res/swiper7.jpg'),
  ];
  componentDidMount() {
    request
      .privateGet(GROUP_RECOMMEND)
      .then(res => {
        //判断是否还有数据
        this.stillHave = true;
        this.setState({
          //[ {
          //     "phone":"12345678901",
          //     "nickname":"Ema@",
          //     "avatar":"https://dl.bobopic.com/small/83213730.jpg",
          //     "age":20,
          //     "distance":20,
          //     "marry":"单身",
          //     "education":"本科",
          //     "content":"今天天气很好，阳光很温暖，在街上，我遇见了他...",
          //     "star_count":10,
          //     "comment_count":5,
          //     "like_count":20,
          //     "create_time":"2022-03-04T07:51:13.519188479+08:00",
          //     "age_diff":-2
          // },
          //]
          list: res.data.data.list,
        });
        const length = this.state.list.length;
        let likeOrNot = [];
        for (let i = 0; i < length; i++) {
          //刚获得动态时，都显示还没点赞过
          likeOrNot.push(false);
        }
      })
      .catch(err => {
        log.error(err, 'group:recommend');
      });
  }
  zoomImage = index => {
    const images = this.images.map((v, k) => {
      return {url: v, props: {}};
    });
    //设置this.images为当前动态的相册集
    this.setState({
      currentImageIndex: index,
      showModal: true,
      images: images,
    });
  };
  onEndReached = () => {
    //判断是否还有数据
    if (!this.stillHave) {
      return;
    }
    //节流：已经有请求在发送，就不发送请求
    if (this.sending) {
      return;
    }
    this.sending = true;
    request
      .privateGet(GROUP_RECOMMEND)
      .then(res => {
        //请求发送完毕
        this.sending = false;
        //还有数据吗
        this.stillHave = false;
        this.setState({
          list: [...this.state.list, ...res.data.data.list],
        });
      })
      .catch(err => {
        log.error(err, 'group recommend:end reached');
      });
  };
  likeOrNot = index => {
    //判断是点赞还是取消点赞（应在后端判断点赞的人列表中有无自己，没有的话是点赞，有的话是取消）
    likeOrNot = this.state.likeOrNot[index];
    let likeOrNot = this.state.likeOrNot;
    likeOrNot[index] = !likeOrNot[index];
    //更改list数据,点赞数加1或减1
    let list = this.state.list;
    if (likeOrNot[index]) {
      list[index].like_count++;
    } else {
      list[index].like_count--;
    }
    //发送addlike请求
    request
      .privateGet(GROUP_LIKE.replace(':id', index.toString()))
      .then(res => {
        //点赞成功
        if (likeOrNot[index]) {
          //如果是喜欢的话才发送

          //极光发送点赞消息
          const user = this.props.UserStore.user;
          return JMessage.sendTextMsg(
            user.nickname + '喜欢了你的' + index + '动态',
            list[index].nickname,
            {user: JSON.stringify(user)},
          );
        }
      })
      .then(res => {
        //发送消息成功
        this.setState({
          list: list,
          likeOrNot: likeOrNot,
        });
      })
      .catch(err => {
        log.error(err, 'recommend:likeornot');
      });
  };
  handleMore = index => {
    const noInterest = () => {
      request
        .privateGet(GROUP_NOINTEREST.replace(':id', index.toString()))
        .then(res => {
          //不敢兴趣成功
          log.log(JSON.stringify(res.data), 'recommend:handlemore');
        })
        .catch(err => {
          log.error(err, 'recommend:nointerest');
        });
    };
    let items = [
      {title: '举报', onPress: () => alert('举报')},
      {title: '不感兴趣', onPress: () => noInterest()},
    ];
    ActionSheet.show(items, {title: '取消'});
  };
  goToComment = item => {
    this.context.navigate('Comment', item);
  };
  render() {
    const {list} = this.state;
    return (
      <>
        <FlatList
          onEndReachedThreshold={0.1}
          onEndReached={this.onEndReached}
          data={list}
          keyExtractor={v => this.uid++}
          renderItem={({item, index}) => {
            return (
              <>
                <View key={index} style={{padding: pxToDpWidth(10)}}>
                  {/* 用户头像 昵称 标题 开始 */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={{uri: item.avatar}}
                        style={{
                          width: pxToDpWidth(40),
                          height: pxToDpWidth(40),
                          borderRadius: pxToDpWidth(20),
                        }}
                      />
                      <Text
                        style={{
                          marginLeft: pxToDpWidth(10),
                          fontSize: pxToDpWidth(15),
                        }}>
                        {item.nickname}
                      </Text>
                    </View>
                    <View />
                    {/* 右侧菜单图标 开始 */}
                    <TouchableOpacity
                      style={{marginRight: pxToDpWidth(10)}}
                      onPress={this.handleMore.bind(this, index)}>
                      <Text
                        style={{fontWeight: '2000', fontSize: pxToDpWidth(20)}}>
                        :
                      </Text>
                    </TouchableOpacity>
                    {/* 右侧菜单图标 结束 */}
                  </View>
                  {/* 用户头像 昵称 标题 结束 */}
                  {/* 动态内容 开始 */}
                  <View style={{padding: pxToDpWidth(8)}}>
                    {/* 文字部分 开始 */}
                    <Text style={{fontSize: pxToDpWidth(18)}}>
                      {item.content}
                    </Text>
                    {/* 文字部分 结束 */}
                    {/* 图片部分 开始 */}
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                      {this.images.map((v, k) => {
                        return (
                          <TouchableOpacity
                            key={k}
                            onPress={() => this.zoomImage(k)}>
                            <Image
                              key={k}
                              source={{uri: v}}
                              // source={v}
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
                    {/* 距离 发出时间显示 开始 */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: pxToDpWidth(10),
                      }}>
                      <Text>距离{item.distance}米</Text>
                      <Text style={{marginLeft: pxToDpWidth(10)}}>
                        {date(item.create_time).fromNow()}
                      </Text>
                    </View>
                    {/* 距离 发出时间显示 结束 */}
                    {/* 评论点赞栏 开始 */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: pxToDpWidth(10),
                        paddingHorizontal: pxToDpWidth(10),
                      }}>
                      <TouchableOpacity
                        style={{flexDirection: 'row'}}
                        onPress={this.likeOrNot.bind(this, index)}>
                        <Text
                          style={{
                            color: this.state.likeOrNot[index] ? 'red' : '#888',
                          }}>
                          点赞icon
                        </Text>
                        <Text> {item.like_count}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={this.goToComment.bind(this, item)}>
                        <Text>评论icon {item.comment_count}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text>StarIcon {item.star_count}</Text>
                      </TouchableOpacity>
                    </View>
                    {/* 评论点赞栏 结束 */}
                  </View>
                  {/* 动态内容 结束 */}
                  {/* 分割线 开始 */}
                  <View
                    style={{
                      borderColor: '#888',
                      borderBottomWidth: pxToDpWidth(1),
                      height: pxToDpWidth(1),
                      width: '95%',
                      marginBottom: pxToDpWidth(10),
                      alignSelf: 'center',
                    }}
                  />
                  {/* 分割线 结束 */}
                  {/* 大图显示 开始 */}
                  <Modal visible={this.state.showModal} transparent={true}>
                    <ImageViewer
                      onClick={() => this.setState({showModal: false})}
                      imageUrls={this.state.images}
                      index={this.state.currentImageIndex}
                    />
                  </Modal>
                  {/* 大图显示 结束 */}
                </View>
                {index === list.length - 1 && !this.stillHave && (
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text>没有更多了~</Text>
                  </View>
                )}
              </>
            );
          }}
        />
        {/* 发布按钮 开始 */}
        <View style={{position: 'relative'}}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: pxToDpWidth(40),
              right: '10%',
            }}
            onPress={() => {
              this.context.navigate('Publish');
            }}>
            <LinearGradient
              colors={['#87CEEB', '#8470FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: pxToDpWidth(60),
                height: pxToDpWidth(60),
                borderRadius: pxToDpWidth(30),
              }}>
              <Text style={{fontSize: pxToDpWidth(18)}}>发布</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {/* 发布按钮 结束 */}
      </>
    );
  }
}
export default Index;
