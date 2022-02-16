import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {pxToDpWidth} from '../../../utils/stylesKits';
class Index extends Component {
  render() {
    const {tabs, goToPage, activeTab} = this.props;
    console.log(this.props);
    return (
      <ImageBackground
        source={require('../../../res/navbg.jpg')}
        style={{
          height: pxToDpWidth(60),
          justifyContent: 'space-evenly',
          flexDirection: 'row',
        }}>
        {tabs.map((v, i) => {
          return (
            <TouchableOpacity
              key={i}
              onPress={() => {
                goToPage(i);
              }}
              style={{
                justifyContent: 'center',
                borderBottomColor: '#fff',
                borderBottomWidth: i === activeTab ? pxToDpWidth(3) : 0,
              }}>
              <Text
                style={{
                  fontSize: i === activeTab ? pxToDpWidth(22) : pxToDpWidth(18),
                  color: '#fff',
                }}>
                {v}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ImageBackground>
    );
  }
}
export default Index;
