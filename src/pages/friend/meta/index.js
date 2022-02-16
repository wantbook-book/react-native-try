import React, {Component} from 'react';
import Swiper from 'react-native-deck-swiper';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import MyNav from '../../../component/MyNav/index';
import request from '../../../utils/request';
import {FRIEND_CARDS} from '../../../utils/pathMap';
import {pxToDpWidth} from '../../../utils/stylesKits';
import IconFont from '../../../component/IconFont';
import {FRIEND_SETLIKE} from '../../../utils/pathMap';
import Toast from '../../../utils/toast';
class Index extends Component {
  state = {
    swipedIndex: 0,
    cards: [],
  };
  params = {
    page: 1,
    pagesize: 10,
  };
  stillHave = true;
  swiperRef = null;
  setLike = isLike => {
    if (isLike) {
      this.swiperRef.swipeRight();
    } else {
      this.swiperRef.swipeLeft();
    }
  };
  onSwipedAll = () => {
    if (this.stillHave) {
      //如果还有数据
      //   请求下一页数据
      this.params.page++;
      request
        .get(FRIEND_CARDS, this.params)
        .then(res => {
          if (res.data) {
            this.setState({
              cards: [...this.state.cards, ...res.data.data.cards],
            });
            console.log('swiped all data');
            console.log(this.state.cards);
            // 判断是否还有数据
            if (
              res.data.data.total <=
              this.params.page * this.params.pagesize
            ) {
              this.stillHave = false;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      Toast.message('没啦~', 2000, 'bottom');
    }
  };
  swiped = (currentIndex, isLike) => {
    const card = this.state.cards[currentIndex];
    const url = FRIEND_SETLIKE.replace(':id', card.nickname).replace(
      ':islike',
      isLike,
    );
    //设置喜欢或不喜欢
    request
      .privateGet(url)
      .then(res => {
        if (res.data) {
          if (res.data.code === 200) {
            Toast.message(res.data.msg, 2000, 'center');
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  componentDidMount() {
    request
      .get(FRIEND_CARDS)
      .then(res => {
        if (res.data) {
          this.setState({
            cards: res.data.data.cards,
          });
          // 判断是否还有数据
          if (res.data.data.total <= this.params.page * this.params.pagesize) {
            this.stillHave = false;
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    if (this.state.cards.length === 0) {
      return <View />;
    }
    return (
      <View>
        <MyNav title="Meta" />
        {/* 封面背景图片 */}
        <ImageBackground
          source={require('../../../res/coverbg.jpg')}
          style={{height: '60%'}}
          imageStyle={{height: '100%'}}>
          {this.state.cards[this.state.swipedIndex] && (
            <Swiper
              key={new Date()}
              ref={ref => (this.swiperRef = ref)}
              cards={this.state.cards}
              verticalSwipe={false}
              renderCard={card => {
                return (
                  <View
                    style={{
                      flex: 0.6,
                      backgroundColor: 'white',
                      borderRadius: pxToDpWidth(5),
                      borderWidth: pxToDpWidth(2),
                      borderColor: '#e8e8e8',
                    }}>
                    {/* 图片 */}
                    <Image
                      source={{uri: card.avatar}}
                      style={{width: '100%', height: '75%'}}
                    />
                    {/* 文字说明 */}
                    <View
                      style={{
                        paddingTop: pxToDpWidth(30),
                        alignItems: 'center',
                      }}>
                      {/* 中间第一行昵称 年龄 */}
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: pxToDpWidth(15),
                          }}>
                          {card.nickname + ' '}
                        </Text>
                        <IconFont
                          name={
                            card.gender === '女' ? 'genderFemale' : 'genderMale'
                          }
                          style={{color: '#EE82EE'}}
                        />
                        <Text>{' ' + card.age + '岁'}</Text>
                      </View>
                      {/* 第二行 情感状态 学业水平 */}
                      <View style={{marginTop: pxToDpWidth(10)}}>
                        <Text>{`${card.marry} | ${card.xueli} | ${
                          Math.abs(card.age_diff) <= 3
                            ? '年龄相仿'
                            : '相差' + card.age_diff + '岁'
                        }`}</Text>
                      </View>
                    </View>
                  </View>
                );
              }}
              onSwiped={cardIndex => {
                this.setState({swipedIndex: this.state.swipedIndex + 1});
              }}
              onSwipedAll={this.onSwipedAll}
              // onSwipedRight={id => console.log(id)}
              onSwipedRight={cardIndex => this.swiped(cardIndex, true)}
              onSwipedLeft={cardIndex => this.swiped(cardIndex, false)}
              cardIndex={this.state.swipedIndex}
              backgroundColor={'transparent'}
              cardVerticalMargin={10}
              stackSize={3}
            />
          )}
        </ImageBackground>
        {/* 不喜欢和喜欢图标按钮 */}
        <View
          style={{
            paddingTop: pxToDpWidth(70),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '60%',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={this.setLike.bind(this, false)}
            style={{
              width: pxToDpWidth(70),
              height: pxToDpWidth(70),
              borderRadius: pxToDpWidth(35),
              backgroundColor: '#FF8C00',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>dislike icon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.setLike.bind(this, true)}
            style={{
              width: pxToDpWidth(70),
              height: pxToDpWidth(70),
              borderRadius: pxToDpWidth(35),
              backgroundColor: '#FF4500',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>like icon</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },
});
export default Index;
