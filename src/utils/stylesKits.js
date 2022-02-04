import {Dimensions} from 'react-native';
//手机元素宽度/手机宽度 = 元素宽度/设计稿宽度
//=>手机宽度=元素宽度*手机宽度/设计稿宽度
//获取手机宽高
export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
//设计稿默认375
export const pxToDpWidth = elemPx => (screenWidth * elemPx) / 375;
