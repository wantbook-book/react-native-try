import React, {Component} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import MyNav from '../../../component/MyNav/index';
import log from '../../../utils/log';
import geo from '../../../utils/geo';
import {pxToDpWidth} from '../../../utils/stylesKits';
import * as ImagePicker from 'react-native-image-picker';
import {ActionSheet} from 'teaset';
import request from '../../../utils/request';
import {GROUP_UPLOADFILE} from '../../../utils/pathMap';
import RNFetchBlob from '../../../utils/RNFetchBlob';
class Index extends Component {
  state = {
    contentText: '',
    longitude: '',
    latitude: '',
    location: '',
    imageContent: ['https://i.bobopic.com/small/80015337.jpg'],
    tmpImages: [],
  };
  constructor() {
    super();

    this.refInput = React.createRef();
  }
  onRightPress = () => {
    const image = this.state.tmpImages[0];
    //先上传图片，返回图片在服务器的uri
    RNFetchBlob.uploadFile(
      GROUP_UPLOADFILE,
      image.fileName,
      image.type,
      image.uri,
    )
      .then(res => {
        log.logObj(res.data, 'publish:rnfecth success');
      })
      .catch(err => {
        log.error(err, 'publish:rnfetch error');
      });

    //上传其他信息
  };
  getLocation = () => {
    geo
      .getCityByLocation()
      .then(res => {
        if (res.data) {
          //有时候会缺少定位权限，虚拟机怪
        } else {
          this.setState({
            longitude: '113.428',
            latitude: '23.128',
            // location: '广东省广州市天河区珠吉街道',
            location: '广东省广州市',
          });
        }
      })
      .catch(err => {
        log.error(err, 'publish:get location');
        this.setState({
          longitude: '113.428',
          latitude: '23.128',
          // location: '广东省广州市天河区珠吉街道',
          location: '广东省广州市',
        });
      });
  };
  selectImageFrom = type => {
    const options = {
      saveToPhotos: false,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra: true,
      selectionLimit: 0,
    };
    ImagePicker.launchImageLibrary(options)
      .then(res => {
        if (res.didCancel) {
          // {"didCancel":true}
          log.log('取消了', 'publish:Select image');
        } else if (res.errorCode) {
          //出错了
          log.logObj(res, 'publish:select image');
        } else {
          // {"assets":[{"id":"rn_image_picker_lib_temp_c82dbd1d-15b1-40d3-9bd8-34a2eb8ef50e.png","height":540,"uri":"file:///data/user/0/com.myapp3/cache/rn_image_picker_lib_temp_c82dbd1d-15b1-40d3-9bd8-34a2eb8ef50e.png","width":500,"timestamp":null,"fileName":"rn_image_picker_lib_temp_c82dbd1d-15b1-40d3-9bd8-34a2eb8ef50e.png","type":"image/png","fileSize":237735}]}
          let tmpImages = this.state.tmpImages;
          log.logObj(res, 'publish:select image success');
          res.assets.map((v, k) => {
            tmpImages.push({
              uri: v.uri,
              type: v.type,
              fileName: v.fileName,
            });
          });

          this.setState({
            tmpImages: tmpImages,
          });
        }
      })
      .catch(err => {
        log.error(err, 'publish:selectimage');
      });
  };
  deleteImageOrNot = index => {
    const deleteImage = () => {
      let tmpImages = this.state.tmpImages;
      tmpImages.splice(index, 1);
      this.setState({
        tmpImages: tmpImages,
      });
    };
    const opts = [{title: '删除', onPress: deleteImage}];
    ActionSheet.show(opts, {title: '取消'});
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <MyNav
          title="发动态"
          rightText="发帖"
          onRightPress={this.onRightPress}
        />
        {/* 输入框 开始 */}
        <TouchableOpacity
          style={{height: '30%', backgroundColor: 'aqua'}}
          onPress={() => {
            this.refInput.focus();
          }}>
          <TextInput
            //获取对象实例方法
            ref={ref => (this.refInput = ref)}
            multiline={true}
            value={this.state.contentText}
            onChangeText={text => this.setState({contentText: text})}
            placeholder="请输入动态内容"
          />
        </TouchableOpacity>
        {/* 输入框 结束 */}
        {/* 定位 开始 */}
        <TouchableOpacity
          onPress={this.getLocation}
          style={{
            marginTop: pxToDpWidth(10),
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Text>定位</Text>
          <Text> {this.state.location || '你在哪里？'}</Text>
        </TouchableOpacity>
        {/* 定位 结束 */}
        {/* 选择的图片显示 开始 */}
        <View
          style={{
            height: this.state.tmpImages.length === 0 ? 0 : pxToDpWidth(50),
          }}>
          <ScrollView horizontal>
            {this.state.tmpImages.map((v, k) => {
              return (
                <TouchableOpacity onPress={this.deleteImageOrNot.bind(this, k)}>
                  <Image
                    source={{uri: v.uri}}
                    style={{
                      width: pxToDpWidth(50),
                      height: pxToDpWidth(50),
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {/* 选择的图片显示 结束 */}
        {/* 工具栏 开始 */}
        <View
          style={{
            marginTop: pxToDpWidth(10),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: '#ddd',
            height: pxToDpWidth(30),
            width: '100%',
          }}>
          <TouchableOpacity onPress={this.selectImageFrom.bind(this, 'photo')}>
            <Text
              style={{
                backgroundColor: '#ADD8E6',
                width: pxToDpWidth(40),
                textAlign: 'center',
                borderRadius: pxToDpWidth(8),
              }}>
              图片
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              style={{
                backgroundColor: '#ADD8E6',
                width: pxToDpWidth(40),
                textAlign: 'center',
                borderRadius: pxToDpWidth(8),
              }}>
              表情
            </Text>
          </TouchableOpacity>
        </View>
        {/* 工具栏 结束 */}
      </View>
    );
  }
}
export default Index;
