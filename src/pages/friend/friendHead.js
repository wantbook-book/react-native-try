import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import {pxToDpWidth} from '../../utils/stylesKits';
import {brainIcon, locationIcon, loveIcon} from '../../res/fonts/iconSvg';
import {NavigationContext} from '@react-navigation/native';
class Head extends Component {
  static contextType = NavigationContext;
  goTo = name => {
    //   this.context === this.props.navigation
    this.context.navigate(name);
  };
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '80%',
        }}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => this.goTo('Meta')}>
            <View
              style={{
                width: pxToDpWidth(60),
                height: pxToDpWidth(60),
                borderRadius: pxToDpWidth(30),
                backgroundColor: '#FFA500',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: pxToDpWidth(5),
              }}>
              <SvgUri
                svgXmlData={loveIcon}
                width="40"
                height="40"
                fill="#fff"
              />
            </View>
          </TouchableOpacity>
          <Text style={{fontSize: pxToDpWidth(16)}}>元宇宙</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => this.goTo('Local')}>
            <View
              style={{
                width: pxToDpWidth(60),
                height: pxToDpWidth(60),
                borderRadius: pxToDpWidth(30),
                backgroundColor: '#FF8C00',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: pxToDpWidth(5),
              }}>
              <SvgUri
                svgXmlData={locationIcon}
                width="40"
                height="40"
                fill="#fff"
              />
            </View>
          </TouchableOpacity>
          <Text style={{fontSize: pxToDpWidth(16)}}>搜附近</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => this.goTo('Soul')}>
            <View
              style={{
                width: pxToDpWidth(60),
                height: pxToDpWidth(60),
                borderRadius: pxToDpWidth(30),
                backgroundColor: '#FF7F50',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: pxToDpWidth(5),
              }}>
              <SvgUri
                svgXmlData={brainIcon}
                width="40"
                height="40"
                fill="#fff"
              />
            </View>
          </TouchableOpacity>
          <Text style={{fontSize: pxToDpWidth(16)}}>测灵魂</Text>
        </View>
      </View>
    );
  }
}
export default Head;
