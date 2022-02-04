import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import request from '../../utils/request';
import {FRIEND_VISITORS} from '../../utils/pathMap';
import {pxToDpWidth} from '../../utils/stylesKits';
class Index extends Component {
  state = {
    visitors: [],
  };
  componentDidMount() {
    request
      .privateGet(FRIEND_VISITORS)
      .then(res => {
        this.setState({
          visitors: res.data.data.visitors,
        });
        console.log(this.state);
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: pxToDpWidth(5),
        }}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: pxToDpWidth(14)}}>
            最近有{this.state.visitors.length}人来访，快去查看...
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          {this.state.visitors.map((v, i) => {
            return (
              <Image
                // source={{uri: 'http://10.10.0.2'+'/upload/image.jpg'}} //服务器ip + 图片地址
                source={{uri: v.avatar}}
                style={{
                  width: pxToDpWidth(40),
                  height: pxToDpWidth(40),
                  borderRadius: pxToDpWidth(20),
                }}
              />
            );
          })}
          <Text>&gt;</Text>
        </View>
      </View>
    );
  }
}
export default Index;
