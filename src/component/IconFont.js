import React, {Component} from 'react';
import {View, Text} from 'react-native';
import IconMap from '../res/fonts/icoFont';
const IconFont = props => {
  return (
    <View>
      <Text
        onPress={props.onPress}
        style={{fontFamily: 'iconfont', ...props.style}}>
        {IconMap[props.name]}
      </Text>
    </View>
  );
};
export default IconFont;
