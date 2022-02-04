import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import request from '../../utils/request';
import {FRIEND_TODAYBEST} from '../../utils/pathMap';
import {pxToDpWidth} from '../../utils/stylesKits';
import IconFont from '../../component/IconFont';
import SvgUri from 'react-native-svg-uri';
import {heartIcon} from '../../res/fonts/iconSvg';
class Index extends Component {
  state = {
    todayBest: null,
  };
  componentDidMount() {
    request
      .get(FRIEND_TODAYBEST)
      .then(res => {
        if (res.data) {
          this.setState({
            todayBest: res.data.data.today_best,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    const {todayBest} = this.state;
    if (todayBest) {
      return (
        <View
          style={{width: '95%', alignSelf: 'center', backgroundColor: '#ddd'}}>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: pxToDpWidth(5),
              marginTop: pxToDpWidth(5),
              marginRight: pxToDpWidth(5),
            }}>
            {/* 左侧图片 */}
            <View style={{position: 'relative'}}>
              <Image
                source={{uri: todayBest.avatar}}
                style={{width: pxToDpWidth(80), height: pxToDpWidth(80)}}
              />

              <Text
                style={{
                  borderRadius: pxToDpWidth(3),
                  fontSize: pxToDpWidth(12),
                  position: 'absolute',
                  top: pxToDpWidth(60),
                  backgroundColor: '#FFDAB9',
                  color: '#FF69B4',
                  fontWeight: '100',
                }}>
                今日家人
              </Text>
            </View>
            {/* 右侧部分 */}
            <View
              style={{
                flex: 1,
                marginTop: pxToDpWidth(2),
                marginLeft: pxToDpWidth(2),
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: '#B0C4DE',
              }}>
              <View>
                {/* 中间第一行昵称 年龄 */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text>{todayBest.nickname + ' '}</Text>
                  <IconFont
                    name={
                      todayBest.gender === '女' ? 'genderFemale' : 'genderMale'
                    }
                    style={{color: '#EE82EE'}}
                  />
                  <Text>{' ' + todayBest.age + '岁'}</Text>
                </View>
                {/* 第二行 情感状态 学业水平 */}
                <View style={{marginTop: pxToDpWidth(10)}}>
                  <Text>{`${todayBest.marry} | ${todayBest.xueli} | ${
                    Math.abs(todayBest.age_diff) <= 3
                      ? '年龄相仿'
                      : '相差' + todayBest.age_diff + '岁'
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
                      {todayBest.fate_value}
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
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  }
}
export default Index;
