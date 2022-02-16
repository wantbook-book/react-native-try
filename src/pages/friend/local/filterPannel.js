import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import IconFont from '../../../component/IconFont';
import {pxToDpWidth} from '../../../utils/stylesKits';
import SvgUri from 'react-native-svg-uri';
import {maleSvg, femaleSvg} from '../../../res/fonts/iconSvg';
import {Slider} from 'react-native-elements';
import MyButton from '../../../component/MyButton/index';
class Index extends Component {
  state = {
    gender: '男',
    distance: null,
  };
  confirm = () => {
    this.props.onSubmitFilter(this.state);
    this.props.close();
  };
  chooseGender = gender => {
    this.setState({
      gender: gender,
    });
  };

  render() {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: '#fff',
          width: '100%',
          height: '60%',
          paddingHorizontal: pxToDpWidth(10),
          paddingVertical: pxToDpWidth(8),
        }}>
        {/* 顶层标题 关闭按钮 开始*/}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text />
          <Text style={{fontSize: pxToDpWidth(20), fontWeight: 'bold'}}>
            筛选
          </Text>
          <IconFont
            style={{fontSize: pxToDpWidth(20)}}
            name="close"
            onPress={this.props.close}
          />
        </View>
        {/* 顶层标题 关闭按钮 结束*/}
        {/* 性别筛选 开始*/}
        <View
          style={{
            marginTop: pxToDpWidth(20),
            paddingHorizontal: pxToDpWidth(10),
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Text style={{flex: 1, fontSize: pxToDpWidth(15)}}>性别：</Text>
          <View
            style={{
              flex: 3,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={this.chooseGender.bind(this, '男')}
              style={{
                width: pxToDpWidth(60),
                height: pxToDpWidth(60),
                borderRadius: pxToDpWidth(30),
                backgroundColor:
                  this.state.gender === '男' ? '#FF6A6A' : '#bbb',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <SvgUri svgXmlData={maleSvg} width="44" height="44" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.chooseGender.bind(this, '女')}
              style={{
                width: pxToDpWidth(60),
                height: pxToDpWidth(60),
                borderRadius: pxToDpWidth(30),
                backgroundColor:
                  this.state.gender === '女' ? '#FF6A6A' : '#bbb',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <SvgUri svgXmlData={femaleSvg} width="44" height="44" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 距离选择 */}
        <View
          style={{paddingLeft: pxToDpWidth(10), marginTop: pxToDpWidth(10)}}>
          <Text style={{fontSize: pxToDpWidth(15)}}>{`距离：${
            this.state.distance || 0
          }m`}</Text>
          <Slider
            minimumValue={0}
            maximumValue={5000}
            step={2}
            value={this.state.distance}
            onValueChange={value => this.setState({distance: value})}
            thumbStyle={{
              backgroundColor: 'red',
              width: 20,
              height: 20,
            }}
          />
        </View>

        {/* 确认筛选按钮 */}
        <View
          style={{marginTop: pxToDpWidth(10), paddingLeft: pxToDpWidth(10)}}>
          <MyButton
            onPress={this.confirm}
            style={{
              width: '100%',
              height: pxToDpWidth(50),
              borderRadius: pxToDpWidth(20),
            }}>
            确认
          </MyButton>
        </View>
      </View>
    );
  }
}
export default Index;
