import {
  ImageHeaderScrollView,
  TriggeringView,
} from 'react-native-image-header-scroll-view';
import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StatusBar} from 'react-native';
import {pxToDpWidth} from '../../utils/stylesKits';
import FriendHead from './friendHead';
import Visitor from './visitor';
import TodayBest from './todaybest';
import Recommend from './recommend';
import IconFont from '../../component/IconFont';
import FilterPannel from './FilterPannel';
import {Overlay} from 'teaset';
// Inside of a component's render() method:
class Index extends Component {
  state = {
    page: 1,
    pagesize: 10,
    gender: '男',
    distance: 100,
    lastLogin: '',
    city: '',
    education: '',
  };
  submitFilter = params => {
    this.setState({
      gender: params.gender,
      distance: params.distance,
      lastLogin: params.lastLogin,
      city: params.city,
      education: params.education,
    });
  };
  filterHandle = () => {
    let overlayViewRef = null;
    const {page, pageSize, ...others} = this.state;
    let overlayView = (
      <Overlay.View
        style={{alignItems: 'center', justifyContent: 'center'}}
        modal={true}
        overlayOpacity={0.3}
        ref={v => (overlayViewRef = v)}>
        <FilterPannel
          onSubmitFilter={this.submitFilter}
          params={others}
          close={() => overlayViewRef.close()}
        />
      </Overlay.View>
    );
    Overlay.show(overlayView);
  };

  render() {
    return (
      <ImageHeaderScrollView
        maxHeight={pxToDpWidth(130)}
        minHeight={pxToDpWidth(44)}
        headerImage={require('../../res/headfriend.jpg')}
        renderForeground={() => (
          <View style={{alignSelf: 'center', paddingTop: pxToDpWidth(20)}}>
            <StatusBar backgroundColor={'transparent'} translucent={true} />
            <FriendHead />
          </View>
        )}>
        <View style={{height: 1000, marginTop: pxToDpWidth(10)}}>
          <Visitor />
          <View style={{marginTop: pxToDpWidth(8)}}>
            <TodayBest />
          </View>
          {/* 推荐筛选栏 */}
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: pxToDpWidth(10),
              paddingVertical: pxToDpWidth(4),
              backgroundColor: '#ddd',
              width: '95%',
            }}>
            <Text>推荐</Text>
            <IconFont onPress={this.filterHandle} name="select" />
          </View>
          <Recommend />
        </View>
      </ImageHeaderScrollView>
    );
  }
}
export default Index;
