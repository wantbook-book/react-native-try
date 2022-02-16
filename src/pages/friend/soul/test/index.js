import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import MyNav from '../../../../component/MyNav/index';
import request from '../../../../utils/request';
import {
  FRIEND_QUESTIONS,
  FRIEND_SUBMITANSWERS,
} from '../../../../utils/pathMap';
import {pxToDpWidth} from '../../../../utils/stylesKits';
import {observer, inject} from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';
import Toast from '../../../../utils/toast';

@inject('UserStore')
@observer
class Index extends Component {
  state = {
    questionnaire: null,
    currentIndex: 0,
  };
  numberToCC = ['一', '二', '三', '四'];
  answerList = '';
  chooseAnswer = answer => {
    //记录用户选择的答案
    this.answerList = this.answerList + answer + ',';
    //如果最后一题了就提交所有答案

    if (
      this.state.currentIndex + 1 ===
      this.state.questionnaire.questions.length
    ) {
      request
        .privatePost(
          FRIEND_SUBMITANSWERS.replace(':id', this.state.questionnaire.id + ''),
          {answers: this.answerList.substring(0, this.answerList.length - 1)},
        )
        .then(res => {
          Toast.message(res.data.msg, 2000, 'center');
          //   跳转到结果页面
          this.props.navigation.navigate('SoulTestResult', res.data.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
    // 下一题
    this.setState({
      currentIndex: this.state.currentIndex + 1,
    });
  };
  questionPart = () => {
    if (!this.state.questionnaire) {
      return <View />;
    }
    const questions = this.state.questionnaire.questions;
    const {currentIndex} = this.state;
    if (!questions[currentIndex]) {
      return <View />;
    }
    return (
      <View>
        {/* 题目序号提示 开始 */}
        <View
          style={{
            position: 'absolute',
            top: pxToDpWidth(40),
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: pxToDpWidth(25),
              color: '#A020F0',
              fontWeight: 'bold',
            }}>
            第{this.numberToCC[currentIndex]}题
          </Text>
          <Text
            style={{
              color: '#9370DB',
              opacity: 0.9,
              fontSize: pxToDpWidth(18),
            }}>
            ({currentIndex + 1}/{questions.length})
          </Text>
        </View>
        {/* 题目序号提示 结束 */}
        {/* 题目 开始 */}
        <View
          style={{
            position: 'absolute',
            alignSelf: 'center',
            top: pxToDpWidth(130),
          }}>
          {/* 问题 开始 */}
          <View>
            <Text
              style={{
                backgroundColor: '#ffffff99',
                fontSize: pxToDpWidth(18),
                fontWeight: '550',
                color: '#000',
              }}>
              {questions[currentIndex].qs_title}
            </Text>
          </View>
          {/* 问题 结束 */}
          {/* 答案 开始 */}
          <View style={{marginTop: pxToDpWidth(40)}}>
            {questions[currentIndex].answers.map((v, k) => {
              return (
                <View key={k} style={{marginTop: pxToDpWidth(20)}}>
                  <TouchableOpacity
                    onPress={this.chooseAnswer.bind(this, v.ans_No)}>
                    <LinearGradient
                      style={{
                        width: '100%',
                        height: pxToDpWidth(30),
                        borderRadius: pxToDpWidth(5),
                        justifyContent: 'center',
                        paddingLeft: pxToDpWidth(15),
                      }}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      colors={['#00BFFF', '#00BFFF00']}>
                      <Text
                        style={{
                          fontSize: pxToDpWidth(15),
                          fontWeight: '550',
                          color: '#333',
                        }}>
                        {`${v.ans_No}. ${v.ans_title}`}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          {/* 答案 结束 */}
        </View>
        {/* 题目 结束 */}
      </View>
    );
  };
  //传递来的数据在this.props.route.params
  componentDidMount() {
    const params = this.props.route.params;
    const url = FRIEND_QUESTIONS.replace(':id', params.level - 1 + '');
    request
      .privateGet(url)
      .then(res => {
        if (res.data.code === 200) {
          this.setState({
            questionnaire: res.data.data.questionnaire,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const level = this.props.route.params.level;
    const levelstr = level === 1 ? '初级' : level === 2 ? '中级' : '高级';
    const user = this.props.UserStore.user;
    return (
      <View>
        {/* 导航栏 */}
        <MyNav title={levelstr + '测试题'}>测试</MyNav>
        {/* 背景图片 开始 */}
        <ImageBackground
          source={require('../../../../res/testbg.jpg')}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
          imageStyle={{
            opacity: 0.7,
          }}>
          <View>
            {/* 左标签 开始*/}
            <View
              style={{
                position: 'absolute',
                top: pxToDpWidth(40),
                left: -pxToDpWidth(80),
                paddingLeft: pxToDpWidth(90),
                alignItems: 'center',
                justifyContent: 'center',
                width: pxToDpWidth(160),
                height: pxToDpWidth(60),
                backgroundColor: '#1E90FF',
                borderRadius: pxToDpWidth(30),
              }}>
              <Image
                source={{
                  uri: user.avatar,
                }}
                style={{
                  width: pxToDpWidth(60),
                  height: pxToDpWidth(60),
                  borderRadius: pxToDpWidth(30),
                }}
              />
            </View>
            {/* 左标签 结束*/}

            {/* 右标签 开始*/}
            <View
              style={{
                position: 'absolute',
                top: pxToDpWidth(40),
                right: -pxToDpWidth(80),
                alignItems: 'center',
                justifyContent: 'center',
                paddingRight: pxToDpWidth(80),
                width: pxToDpWidth(160),
                height: pxToDpWidth(60),
                backgroundColor: '#1E90FF',
                borderRadius: pxToDpWidth(30),
              }}>
              <Text
                style={{
                  fontSize: pxToDpWidth(20),
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                {levelstr}
              </Text>
            </View>
            {/* 右标签 结束*/}
          </View>
          {this.questionPart()}
        </ImageBackground>
        {/* 背景图片 结束 */}
      </View>
    );
  }
}
export default Index;
