import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import IconFont from '../../component/IconFont';
import {pxToDpWidth} from '../../utils/stylesKits';
import SvgUri from 'react-native-svg-uri';
import {maleSvg, femaleSvg} from '../../res/fonts/iconSvg';
import Picker from 'react-native-picker';
import {Slider} from 'react-native-elements';
import CityJson from '../../res/city.json';
import MyButton from '../../component/MyButton/index';
class Index extends Component {
  state = {
    gender: '男',
    lastLogin: null,
    distance: null,
    education: null,
    province: null,
    city: null,
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
  selectCity = () => {
    Picker.init({
      pickerData: CityJson,
      selectedValue: [this.state.province, this.state.city],
      wheelFlex: [1, 1, 0], // 显示省和市
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择城市',
      onPickerConfirm: data => {
        // data =  [广东，广州，天河]
        this.setState({
          province: data[0],
          city: data[1],
        });
      },
    });
    Picker.show();
  };
  selectLoginTime = () => {
    Picker.init({
      pickerData: ['1小时', '1天', '1周', '不限制'],
      selectedValue: [this.state.lastLogin],
      wheelFlex: [1], // 显示省和市
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择最近登录时间',
      onPickerConfirm: data => {
        console.log(data);
        this.setState({
          lastLogin: data[0],
        });
      },
    });
    Picker.show();
  };
  selectEducation = () => {
    Picker.init({
      pickerData: [
        '小学',
        '初中',
        '高中',
        '本科',
        '大专',
        '研究生',
        '博士',
        '博士后',
        '不限制',
      ],
      selectedValue: [this.state.education],
      wheelFlex: [1], // 显示省和市
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择教育水平',
      onPickerConfirm: data => {
        console.log(data);
        this.setState({
          education: data[0],
        });
      },
    });
    Picker.show();
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
        {/* 顶层标题 关闭按钮 */}
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
        {/* 性别筛选 */}
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
        {/* 近期登录时间筛选 */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: pxToDpWidth(10),
            paddingHorizontal: pxToDpWidth(10),
          }}>
          <Text style={{fontSize: pxToDpWidth(15)}}>近期登录时间：</Text>
          <View>
            <Text
              onPress={this.selectLoginTime}
              style={{fontSize: pxToDpWidth(15)}}>
              {this.state.lastLogin || '请选择'}
            </Text>
          </View>
        </View>
        {/* 距离选择 */}
        <View
          style={{paddingLeft: pxToDpWidth(10), marginTop: pxToDpWidth(10)}}>
          <Text style={{fontSize: pxToDpWidth(15)}}>{`距离：${
            this.state.distance || 0
          }km`}</Text>
          <Slider
            minimumValue={0}
            maximumValue={60}
            step={1}
            value={this.state.distance}
            onValueChange={value => this.setState({distance: value})}
            thumbStyle={{
              backgroundColor: 'red',
              width: 20,
              height: 20,
            }}
          />
        </View>
        {/* 居住地选择 */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: pxToDpWidth(10),
            paddingHorizontal: pxToDpWidth(10),
          }}>
          <Text style={{fontSize: pxToDpWidth(15)}}>居住地：</Text>
          <View>
            <Text onPress={this.selectCity} style={{fontSize: pxToDpWidth(15)}}>
              {this.state.city || '请选择'}
            </Text>
          </View>
        </View>
        {/* 学历选择 */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: pxToDpWidth(10),
            paddingHorizontal: pxToDpWidth(10),
          }}>
          <Text style={{fontSize: pxToDpWidth(15)}}>学历：</Text>
          <View>
            <Text
              onPress={this.selectEducation}
              style={{fontSize: pxToDpWidth(15)}}>
              {this.state.education || '请选择'}
            </Text>
          </View>
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
