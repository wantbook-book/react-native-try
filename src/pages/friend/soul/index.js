import React, {Component} from 'react';
import {View, Text, ImageBackground, Image} from 'react-native';
import MyNav from '../../../component/MyNav/index';
import Swiper from 'react-native-deck-swiper';
import MyButton from '../../../component/MyButton/index';
import {pxToDpWidth} from '../../../utils/stylesKits';
import Toast from '../../../utils/toast';
class Index extends Component {
  state = {
    questions: [
      {
        level: 1,
        image: require('../../../res/1.png'),
      },
      {
        level: 2,
        image: require('../../../res/2.png'),
      },
      {
        level: 3,
        image: require('../../../res/3.png'),
      },
    ],
    currentIndex: 0,
  };
  swiperRef = null;
  startTest = () => {
    //   带上问卷等级数据，跳转页面
    this.props.navigation.navigate(
      'SoulTest',
      this.state.questions[this.state.currentIndex],
    );
  };
  onSwipedAll = () => {
    Toast.message('没有啦~');
  };
  render() {
    return (
      <View>
        {/* 导航栏 开始 */}
        <MyNav>测灵魂</MyNav>
        {/* 导航栏 结束 */}
        <View>
          {/* 封面背景图片 开始 */}

          <ImageBackground
            source={require('../../../res/coverbg.jpg')}
            style={{width: '100%', height: '75%'}}
            imageStyle={{height: '100%', width: '100%'}}>
            {this.state.questions[this.state.currentIndex] && (
              <Swiper
                key={new Date()}
                ref={ref => (this.swiperRef = ref)}
                cards={this.state.questions}
                verticalSwipe={false}
                renderCard={card => {
                  return (
                    <View
                      style={{
                        width: '100%',
                        height: '75%',
                      }}>
                      <Image
                        source={card.image}
                        style={{width: '100%', height: '100%'}}
                      />
                    </View>
                  );
                }}
                onSwiped={cardIndex => {
                  this.setState({currentIndex: this.state.currentIndex + 1});
                }}
                onSwipedAll={this.onSwipedAll}
                // onSwipedRight={id => console.log(id)}
                //   onSwipedRight={cardIndex => this.swiped(cardIndex, true)}
                //   onSwipedLeft={cardIndex => this.swiped(cardIndex, false)}
                cardIndex={this.state.currentIndex}
                backgroundColor={'transparent'}
                cardVerticalMargin={10}
                stackSize={3}
              />
            )}
          </ImageBackground>
          {/* 封面背景图片结束 */}
        </View>
        {/* 开始测试按钮 开始 */}
        <View style={{marginTop: pxToDpWidth(20), alignItems: 'center'}}>
          <MyButton
            onPress={this.startTest}
            style={{
              width: '80%',
              height: pxToDpWidth(50),
              borderRadius: pxToDpWidth(25),
            }}>
            开始测试
          </MyButton>
        </View>
        {/* 开始测试按钮 结束 */}
      </View>
    );
  }
}
export default Index;
