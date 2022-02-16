import React from 'react';
import {Text} from 'react-native';

import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import Recommend from './recommend/index';
import Latest from './latest/index';
import CustomTabBar from './customTabBar/index';
export default () => {
  return (
    <ScrollableTabView initialPage={1} renderTabBar={() => <CustomTabBar />}>
      <Recommend tabLabel="推荐" />
      <Latest tabLabel="最新" />
    </ScrollableTabView>
  );
};
