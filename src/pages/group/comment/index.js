import React, {Component} from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import log from '../../../utils/log';
import MyNav from '../../../component/MyNav/index';
import {pxToDpWidth} from '../../../utils/stylesKits';
import date from '../../../utils/date';
import ImageViewer from 'react-native-image-zoom-viewer';
import MyButton from '../../../component/MyButton';
import {GROUP_COMMENTS, GROUP_ADDCOMMENT} from '../../../utils/pathMap';
import request from '../../../utils/request';
class Index extends Component {
  //this.props.route.params
  // {
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
  //     "create_time":"2022-02-25T19:15:15.471847998+08:00",
  //     "age_diff":-2
  // }
  state = {
    currentImageIndex: 0,
    showModal: false,
    images: [],
    comments: [],
    commentText: '',
    showCommentModal: false,
  };
  images = [
    'https://dl.bobopic.com/small/85509839.jpg',
    'https://dl.bobopic.com/small/73070335.jpg',
    'https://dl.bobopic.com/small/75979218.jpg',
    'https://dl.bobopic.com/small/88934564.jpg',
  ];
  componentDidMount() {
    request
      .privateGet(GROUP_COMMENTS)
      .then(res => {
        // [{"comment_id":1,"content":"99","avatar":"ssss","like_count":1,"create_time":"2022-01-22T20:42:48.242314242+08:00","nickname":"hannibal"}]
        this.setState({
          comments: res.data.data.comments,
        });
      })
      .catch(err => {
        log.error(err, 'comment');
      });
  }
  zoomImage = index => {
    const images = this.images.map((v, k) => {
      return {url: v, props: {}};
    });
    this.setState({
      currentImageIndex: index,
      images: images,
      showModal: true,
    });
  };
  onEndEditing = () => {
    //去掉评论两端的空格，
    const commentText = this.state.commentText.trim();
    if (commentText !== '') {
      //评论不为空发送评论,调用接口添加评论
      request
        .privatePost(GROUP_ADDCOMMENT.replace(':id', '动态id'), {
          comment: commentText,
        })
        .then(res => {
          //添加
          this.setState({
            comments: [...this.state.comments, res.data.data.newcomment],
          });
        })
        .catch(err => {
          log.error(err, 'comment:onEndEditing');
        });
    }
    //清空输入，关闭modal
    this.setState({
      commentText: '',
      showCommentModal: false,
    });
  };
  render() {
    const item = this.props.route.params;
    return (
      <View>
        <MyNav title="最新评论" />
        <View
          style={{
            paddingTop: pxToDpWidth(10),
            paddingHorizontal: pxToDpWidth(5),
          }}>
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
          </View>
          {/* 用户头像 昵称 标题 结束 */}
          {/* 动态内容 开始 */}
          <View style={{padding: pxToDpWidth(8)}}>
            {/* 文字部分 开始 */}
            <Text style={{fontSize: pxToDpWidth(18)}}>{item.content}</Text>
            {/* 文字部分 结束 */}
            {/* 图片部分 开始 */}
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {this.images.map((v, k) => {
                return (
                  <TouchableOpacity key={k} onPress={() => this.zoomImage(k)}>
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
          </View>
          {/* 动态内容 结束 */}

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
        {/* 最新评论提示 开始 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: pxToDpWidth(20),
          }}>
          <Text>最新评论</Text>
          <TouchableOpacity
            onPress={() => this.setState({showCommentModal: true})}
            style={{
              backgroundColor: '#a7d1fb',
              borderRadius: pxToDpWidth(5),
              width: pxToDpWidth(60),
              alignItems: 'center',
            }}>
            <Text>评论</Text>
          </TouchableOpacity>
        </View>
        {/* 最新评论提示 结束 */}
        {/* 评论列表 开始 */}
        <ScrollView style={{height: pxToDpWidth(180)}}>
          {this.state.comments.map((v, k) => {
            return (
              <View>
                <View
                  style={{
                    marginTop: pxToDpWidth(20),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: pxToDpWidth(10),
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    {/* 头像 开始 */}
                    <Image
                      source={{uri: v.avatar}}
                      style={{
                        height: pxToDpWidth(50),
                        width: pxToDpWidth(50),
                        borderRadius: pxToDpWidth(25),
                      }}
                    />
                    {/* 头像 结束 */}
                    <View style={{marginLeft: pxToDpWidth(10)}}>
                      {/* 昵称 发送时间 开始 */}
                      <Text>{v.nickname}</Text>
                      <Text>{date(v.create_time).format('lll')}</Text>
                      {/* 昵称 发送时间 结束 */}

                      {/* 评论内容 开始 */}
                      <Text
                        style={{
                          marginTop: pxToDpWidth(5),
                          fontSize: pxToDpWidth(15),
                          color: 'black',
                        }}>
                        {v.content}
                      </Text>
                      {/* 评论内容 结束 */}
                    </View>
                  </View>

                  {/* 右侧点赞图标 开始 */}
                  <View style={{flexDirection: 'row'}}>
                    <Text>点赞Icon</Text>
                    <Text> {v.like_count}</Text>
                  </View>
                  {/* 右侧点赞图标 结束 */}
                </View>
                {/* 分割线 开始 */}
                <View
                  style={{
                    marginTop: pxToDpWidth(7),
                    height: pxToDpWidth(1),
                    borderBottomColor: '#888',
                    borderBottomWidth: pxToDpWidth(1),
                    width: '95%',
                    alignSelf: 'center',
                  }}
                />
                {/* 分割线 结束 */}
              </View>
            );
          })}
        </ScrollView>
        {/* 评论列表 结束 */}
        {/* 评论输入栏 开始 */}
        <Modal
          visible={this.state.showCommentModal}
          animationType="slide"
          //返回动作
          onRequestClose={() => this.setState({showCommentModal: false})}
          transparent={true}>
          <TouchableOpacity
            onPress={() => this.setState({showCommentModal: false})}
            style={{
              zIndex: 0,
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          />
          <View
            style={{
              zIndex: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#ddd',
              paddingVertical: pxToDpWidth(5),
              paddingHorizontal: pxToDpWidth(10),
            }}>
            <TextInput
              autoFocus={true}
              value={this.state.commentText}
              onChangeText={v => this.setState({commentText: v})}
              onEndEditing={this.onEndEditing}
              style={{
                borderWidth: pxToDpWidth(1),
                flex: 5,
                height: pxToDpWidth(40),
                borderRadius: pxToDpWidth(10),
                backgroundColor: 'white',
              }}
              placeholder="请输入评论"
            />
            <TouchableOpacity onPress={this.onEndEditing}>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: pxToDpWidth(14),
                }}>
                发送
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/* 评论输入栏 结束 */}
      </View>
    );
  }
}
export default Index;
