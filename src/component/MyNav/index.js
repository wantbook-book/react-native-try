import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {pxToDpWidth} from '../../utils/stylesKits';
import {NavigationContext} from '@react-navigation/native';
class Index extends Component {
  static defaultProps = {
    rightText: '   ',
    onRightPress: () => {},
  };
  static contextType = NavigationContext;
  genBlank = number => {
    let blanks = '';
    for (let i = 0; i < number; i++) {
      blanks += ' ';
    }
    return blanks;
  };

  render() {
    return (
      <View>
        <StatusBar backgroundColor="transparent" translucent={true} />

        <ImageBackground
          style={{
            height: pxToDpWidth(70),
            justifyContent: 'center',
            paddingTop: pxToDpWidth(15),
          }}
          source={require('../../res/navbg.jpg')}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: pxToDpWidth(10),
              paddingHorizontal: pxToDpWidth(10),
            }}>
            {/* 返回按钮 */}
            <TouchableOpacity onPress={this.context.goBack}>
              <Text style={{fontWeight: '600', color: '#8B658B'}}>
                {'<返回'}
              </Text>
            </TouchableOpacity>
            {/* 标题 */}
            <Text
              style={{
                fontSize: pxToDpWidth(20),
                fontWeight: '400',
                color: '#fff',
              }}>
              {this.props.title}
            </Text>
            {/* 占位 */}
            <TouchableOpacity
              onPress={
                this.props.onRightPress || this.defaultProps.onRightPress
              }>
              <Text>{this.props.rightText || this.defaultProps.rightText}</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
export default Index;
