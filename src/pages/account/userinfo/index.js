import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import {pxToDpWidth} from '../../../utils/stylesKits';
import SvgUri from 'react-native-svg-uri';
import {maleSvg, femaleSvg} from '../../../res/fonts/iconSvg';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment/min/moment-with-locales';
import Geo from '../../../utils/geo';
import MyButton from '../../../component/MyButton';
import Picker from 'react-native-picker';
import CityJson from '../../../res/city.json';
import Toast from '../../../utils/toast';
import ImagePicker from 'react-native-image-crop-picker';
import {Overlay} from 'teaset';
import {inject, observer} from 'mobx-react';
import request from '../../../utils/request';
import JMessage from '../../../utils/JMessage';
import {
  ACCOUNT_UPLOADAVATAR,
  ACCOUNT_VALIDATEVCODE,
  ACCOUNT_UPLOADINFO,
} from '../../../utils/pathMap';
@inject('RootStore')
@observer
class Index extends Component {
  state = {
    nickname: '',
    gender: 'male',
    birthday: new Date(),
    city: '',
    avatar: '',
    longitude: '',
    latitude: '',
    address: '',
    show: false,
    birthdayPicked: false,
  };
  chooseGender = gender => {
    this.setState({
      gender: gender,
    });
  };
  setAvatar = async () => {
    //判断信息是否填写完整
    const {nickname, birthdayPicked, city} = this.state;
    if (!nickname || !birthdayPicked || !city) {
      Toast.sad('用户信息填写不完整', 2000, 'center');
      return;
    }
    //使用图片裁剪插件进行头像编辑
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });
    const overlayRef = null;
    //设计扫描头像效果
    let overlayView = (
      <Overlay.View
        style={{flex: 1, backgroundColor: '#000'}}
        modal={true}
        overlayOpacity={0}
        ref={v => (overlayRef = v)}>
        <View
          style={{
            marginTop: pxToDpWidth(30),
            alignSelf: 'center',
            width: pxToDpWidth(334),
            height: pxToDpWidth(334),
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex: 100,
              opacity: 0.3,
            }}
            source={require('../../../res/scan.gif')}
          />
          <Image
            source={{uri: image.path}}
            style={{width: '60%', height: '60%'}}
          />
        </View>
      </Overlay.View>
    );
    Overlay.show(overlayView);
    //将信息发送到后端
    this.uploadAvatar(image)
      .then(res => {
        if (res.data.code !== 200) {
          Toast.fail('上传头像失败');
          return;
        } else {
          //上传用户信息
          const params = this.state;
          const info = {
            nickname: params.nickname,
            gender: params.gender,
            birthday: params.birthday,
            city: params.city,
            avatar: res.data.data.avatar_path,
            longitude: params.longitude,
            latitude: params.latitude,
            address: params.address,
          };
          return request.post(ACCOUNT_UPLOADINFO, info);
        }
      })
      .then(res => {
        if (res.data.code !== 200) {
          Toast.fail('上传个人信息失败');
          return;
        } else {
        }
        //上传个人信息成功
        //调用极光服务,注册极光账号
        return JMessage.register(
          this.state.nickname,
          this.props.RootStore.phone,
        );
      })
      .then(res => {
        if (res !== 0) {
          //注册失败
          Toast.fail('注册极光账号失败');
        } else {
          //注册成功
          //关闭校验浮层
          overlayRef.close();
          Toast.smile('完善个人信息成功', 2000, 'center');
          //跳转到交友-首页
          this.props.navigation.navigate('Index');
        }
      })
      .catch(err => {
        console.log(err);
        Toast.fail('服务器异常');
      });
  };
  uploadAvatar = async image => {
    let formData = new FormData();
    // console.log('uri: ', image.path);
    // console.log('type: ', image.mime);
    const name = image.path.split('/').pop();
    // console.log('name: ', name);
    formData.append('avatar', {
      uri: image.path,
      type: image.mime,
      name: name,
    });
    return request.privatePost(ACCOUNT_UPLOADAVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  //显示城市picker选择城市
  showCityPicker = () => {
    Picker.init({
      pickerData: CityJson,
      selectedValue: ['北京', '北京'],
      wheelFlex: [1, 1, 0], // 显示省和市
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择城市',
      onPickerConfirm: data => {
        // data =  [广东，广州，天河]
        this.setState({
          city: data[1],
        });
      },
    });
    Picker.show();
  };
  async componentDidMount() {
    moment.locale('zh-cn');
    const res = await Geo.getCityByLocation();

    if (res.data) {
      const location =
        res.data.regeocode.addressComponent.streetNumber.location.split(',');
      this.setState({
        city: res.data.regeocode.addressComponent.city.replace('市', ''),
        address: res.data.regeocode.formatted_address,
        longitude: location[0],
        latitude: location[1],
      });
    } else {
      this.setState({
        city: 'xxx',
        address: 'xxxxxxx',
      });
    }
  }
  render() {
    const {gender, nickname, city, birthdayPicked, birthday, show} = this.state;
    return (
      <View style={{padding: pxToDpWidth(20)}}>
        {/* 提示标题 */}
        <View>
          <View>
            <Text
              style={{
                fontSize: pxToDpWidth(20),
                fontWeight: 'bold',
                color: '#777',
              }}>
              填写资料
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: pxToDpWidth(20),
                fontWeight: 'bold',
                color: '#777',
              }}>
              提升我的魅力
            </Text>
          </View>
        </View>
        {/* 性别头像选择 */}
        <View
          style={{
            marginTop: pxToDpWidth(20),
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '60%',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={this.chooseGender.bind(this, 'male')}
            style={{
              width: pxToDpWidth(60),
              height: pxToDpWidth(60),
              borderRadius: pxToDpWidth(30),
              backgroundColor: gender === 'male' ? '#FF6A6A' : '#bbb',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <SvgUri svgXmlData={maleSvg} width="44" height="44" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.chooseGender.bind(this, 'female')}
            style={{
              width: pxToDpWidth(60),
              height: pxToDpWidth(60),
              borderRadius: pxToDpWidth(30),
              backgroundColor: gender === 'female' ? 'red' : '#bbb',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <SvgUri svgXmlData={femaleSvg} width="44" height="44" />
          </TouchableOpacity>
        </View>
        {/* 昵称 生日 地点输入框 */}
        {/* 昵称 */}
        <View style={{justifyContent: 'center'}}>
          <TextInput
            style={{
              height: pxToDpWidth(40),
              margin: pxToDpWidth(12),
              borderBottomWidth: pxToDpWidth(2),
              paddingLeft: pxToDpWidth(10),
              alignSelf: 'center',
              width: '80%',
              fontSize: pxToDpWidth(15),
            }}
            onChangeText={nickname => this.setState({nickname})}
            value={nickname}
            placeholder="请输入昵称"
          />
        </View>
        {/* 生日选择 */}
        <View>
          <View
            style={{
              margin: pxToDpWidth(15),
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'flex-start',
              height: pxToDpWidth(20),
              width: '80%',
              borderBottomWidth: pxToDpWidth(2),
              borderColor: '#000000',
            }}>
            {/* <Text>Data</Text> */}
            <TouchableOpacity
              style={{height: pxToDpWidth(35)}}
              onPress={() => {
                this.setState({show: true});
              }}>
              <Text
                style={{
                  fontSize: pxToDpWidth(14),
                  marginLeft: pxToDpWidth(10),
                }}>
                {birthdayPicked
                  ? moment(birthday).format('LL')
                  : '选择出生年月'}
              </Text>
            </TouchableOpacity>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={birthday}
              mode="date"
              locale="zh-cn"
              display="spinner"
              onChange={(event, time) =>
                this.setState({
                  show: Platform.OS === 'ios',
                  birthday: time,
                  birthdayPicked: true,
                })
              }
            />
          )}
        </View>
        {/* 城市定位 */}
        <View>
          <TouchableOpacity onPress={this.showCityPicker}>
            <TextInput
              editable={false}
              style={{
                width: '80%',
                height: pxToDpWidth(35),
                borderBottomWidth: pxToDpWidth(2),
                alignSelf: 'center',
                fontSize: pxToDpWidth(14),
                paddingLeft: pxToDpWidth(10),
              }}
              value={'当前定位：' + city}
            />
          </TouchableOpacity>
        </View>
        {/* 确定设置按钮 */}
        <View>
          <MyButton
            onPress={this.setAvatar}
            style={{
              marginTop: pxToDpWidth(15),
              borderRadius: pxToDpWidth(20),
              width: '85%',
              height: pxToDpWidth(50),
              alignSelf: 'center',
            }}>
            设置头像
          </MyButton>
        </View>
      </View>
    );
  }
}
export default Index;
