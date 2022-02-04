import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Toast, Theme} from 'teaset';
let customKey = null;
// 打开

Toast.showLoading = text => {
  if (customKey) {
    return;
  }
  customKey = Toast.show({
    text,
    icon: <ActivityIndicator size="large" color={Theme.toastIconTintColor} />,
    position: 'center',
    duration: 600000,
  });
};

// 关闭
Toast.hideLoading = () => {
  if (!customKey) {
    return;
  }
  Toast.hide(customKey);
  customKey = null;
};
export default Toast;
