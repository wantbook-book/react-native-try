import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import IconFont from '../../component/IconFont';
import {pxToDpWidth} from '../../utils/stylesKits';
import request from '../../utils/request';
import {FRIEND_RECOMMEND} from '../../utils/pathMap';
import SvgUri from 'react-native-svg-uri';
import {heartIcon} from '../../res/fonts/iconSvg';
import {NavigationContext} from '@react-navigation/native';
class Index extends Component {
  static contextType = NavigationContext;
  state = {
    recommends: [],
  };
  componentDidMount() {
    request.privateGet(FRIEND_RECOMMEND).then(res => {
      this.setState({
        recommends: res.data.data.recommend,
      });
    });
  }
  render() {
    const {recommends} = this.state;
    return (
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          backgroundColor: '#ddd',
        }}>
        {/* 推荐条目 */}
        <View style={{marginTop: pxToDpWidth(10)}}>
          {recommends.map((v, k) => {
            return (
              <TouchableOpacity
                key={k}
                onPress={() => {
                  this.context.navigate('Detail', {id: v.id});
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: pxToDpWidth(8),
                    marginVertical: pxToDpWidth(1),
                    paddingHorizontal: pxToDpWidth(10),
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {/* 图片 */}
                  <View style={{flexDirection: 'row'}}>
                    <View>
                      <Image
                        source={{uri: v.avatar}}
                        style={{
                          width: pxToDpWidth(40),
                          height: pxToDpWidth(40),
                          borderRadius: pxToDpWidth(20),
                        }}
                      />
                    </View>
                    {/* 文字介绍 */}
                    <View style={{paddingLeft: pxToDpWidth(10)}}>
                      {/* 中间第一行昵称 年龄 */}
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text>{v.nickname + ' '}</Text>
                        <IconFont
                          name={
                            v.gender === '女' ? 'genderFemale' : 'genderMale'
                          }
                          style={{color: '#EE82EE'}}
                        />
                        <Text>{' ' + v.age + '岁'}</Text>
                      </View>
                      {/* 第二行 情感状态 学业水平 */}
                      <View style={{marginTop: pxToDpWidth(10)}}>
                        <Text>{`${v.marry} | ${v.xueli} | ${
                          Math.abs(v.age_diff) <= 3
                            ? '年龄相仿'
                            : '相差' + v.age_diff + '岁'
                        }`}</Text>
                      </View>
                    </View>
                  </View>
                  {/* 爱心缘分值 */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <SvgUri svgXmlData={heartIcon} width="20" height="20" />
                    <Text style={{color: '#aaa'}}>{v.fate_value}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}
export default Index;
