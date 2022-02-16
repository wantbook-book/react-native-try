import React, {Component} from 'react';
import {View, Text, ImageBackground, Image, ScrollView} from 'react-native';
import MyNav from '../../../../component/MyNav/index';
import {pxToDpWidth} from '../../../../utils/stylesKits';
import MyButton from '../../../../component/MyButton';
import ListItemSwipeable from 'react-native-elements/dist/list/ListItemSwipeable';
class Index extends Component {
  state = {
    params: null,
  };
  componentDidMount() {
    this.setState({
      params: this.props.route.params,
    });
  }
  content = () => {
    const {params} = this.state;
    if (!params) {
      return <View />;
    }
    const trueLove = params.true_love;
    let images = [];
    for (let i = 0; i < 10; i++) {
      images.push(
        <Image
          source={{uri: trueLove.avatar}}
          style={{
            marginLeft: pxToDpWidth(10),
            width: pxToDpWidth(60),
            height: pxToDpWidth(60),
            borderRadius: pxToDpWidth(30),
          }}
        />,
      );
    }
    return (
      <View>
        {/* 上半部分 开始 */}
        <View style={{flexDirection: 'row'}}>
          {/* 左上方文字提示和专家图片 开始 */}
          <View
            style={{
              marginTop: pxToDpWidth(10),
              marginLeft: pxToDpWidth(5),
              alignItems: 'flex-start',
            }}>
            {/* 测试结果提示文字 开始 */}
            <Text
              style={{
                letterSpacing: pxToDpWidth(6),
                fontSize: pxToDpWidth(15),
              }}>
              灵魂基因测定单
            </Text>
            {/* 测试结果提示文字 结束 */}
            {/* 专家图片 开始 */}
            <Image
              source={require('../../../../res/doctor.png')}
              style={{
                marginTop: pxToDpWidth(10),
                width: pxToDpWidth(150),
                height: pxToDpWidth(200),
              }}
            />
            {/* 专家图片 结束 */}
          </View>
          {/* 左上方文字提示和专家图片 结束 */}
          {/* 右上方昵称和说明文字 开始 */}
          <View
            style={{
              flex: 1,
              marginTop: pxToDpWidth(40),
              marginHorizontal: pxToDpWidth(5),
            }}>
            {/* 昵称 开始 */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text>[</Text>
              <Text
                style={{
                  backgroundColor: '#8B898999',
                  fontSize: pxToDpWidth(18),
                  color: '#9400D3',
                }}>
                {trueLove.nickname}
              </Text>
              <Text>]</Text>
            </View>
            {/* 昵称 结束 */}
            {/* 说明文字 开始 */}
            <ScrollView
              style={{marginTop: pxToDpWidth(10), height: pxToDpWidth(160)}}>
              <Text
                style={{
                  backgroundColor: '#8B898999',
                  color: '#9400D3',
                  fontSize: pxToDpWidth(14),
                }}>
                {params.content}
              </Text>
            </ScrollView>
            {/* 说明文字 结束 */}
          </View>
          {/* 右上方昵称和说明文字 结束 */}
        </View>
        {/* 上半部分 结束 */}
        {/* 中间分析部分 开始 */}
        <View
          style={{
            marginTop: pxToDpWidth(10),
            paddingHorizontal: pxToDpWidth(10),
          }}>
          <View
            style={{
              alignSelf: 'center',
              backgroundColor: '#8B898999',
              height: pxToDpWidth(120),
              width: '100%',
            }}
          />
        </View>
        {/* 中间分析部分 结束 */}
        {/* 下半部分 开始 */}
        <View>
          {/* 头像显示 开始*/}

          <ScrollView
            horizontal={true}
            style={{
              marginTop: pxToDpWidth(10),
            }}
            contentContainerStyle={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {images}
          </ScrollView>
          {/* 头像显示 结束*/}
          {/* 继续测试按钮 开始 */}
          <MyButton
            onPress={() => this.props.navigation.navigate('Soul')}
            style={{
              marginTop: pxToDpWidth(10),
              height: pxToDpWidth(50),
              width: '80%',
              borderRadius: pxToDpWidth(25),
              alignSelf: 'center',
            }}>
            继续测试
          </MyButton>
          {/* 继续测试按钮 结束 */}
        </View>
        {/* 下半部分 结束 */}
      </View>
    );
  };
  render() {
    return (
      <View>
        {/* 导航栏 开始 */}
        <MyNav title="测试结果" />
        {/* 导航栏 结束 */}
        {/* 总背景图片 开始 */}
        <ImageBackground
          source={require('../../../../res/resultbg.jpg')}
          style={{width: '100%', height: '100%'}}
          imageStyle={{opacity: 0.7}}>
          {this.content()}
        </ImageBackground>
        {/* 总背景图片 结束 */}
      </View>
    );
  }
}
export default Index;
