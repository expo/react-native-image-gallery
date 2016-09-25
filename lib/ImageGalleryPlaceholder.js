import React from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';

import Colors from './Colors';

export default class ImagePlaceholder extends React.Component {

  render() {
    return (
      <Animated.View
        style={[styles.imageBase, this.props.style]}
        pointerEvents="none">
        <View style={styles.placeholderImage} />
      </Animated.View>
    );
  }
}

let styles = StyleSheet.create({
  imageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#deddde',
  },
  imageBase: {
    backgroundColor: Colors.galleryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderImage: {
    width: 85,
    height: 85,
  },
});
