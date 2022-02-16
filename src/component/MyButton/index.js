import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {pxToDpWidth} from '../../utils/stylesKits';
class MyButton extends Component {
  static defaultProps = {
    style: {},
    textStyle: {},
    disabled: false,
  };
  render() {
    return (
      <TouchableOpacity
        disabled={this.props.disabled}
        onPress={this.props.onPress}
        style={{
          ...this.props.style,
          overflow: 'hidden',
        }}>
        <LinearGradient
          start={this.props.start || {x: 0, y: 1}}
          end={this.props.end || {x: 0, y: 0}}
          colors={this.props.color || ['#2f7aac', '#3f57cf', '#114092']}
          style={styles.linearGradient}>
          <Text style={{...styles.buttonText, ...this.props.textStyle}}>
            {this.props.children}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

// Within your render function

// Later on in your styles..
var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: pxToDpWidth(15),
    paddingRight: pxToDpWidth(15),
    borderRadius: pxToDpWidth(5),
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: pxToDpWidth(18),
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: pxToDpWidth(10),
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});
export default MyButton;
