/**
 * Copyright 2015-present 650 Industries. All rights reserved.
 *
 * @providesModule PlatformLoadingIndicator
 */
'use strict';

import React from 'react';
import {
  ActivityIndicatorIOS,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  View,
} from 'react-native';

export default class PlatformLoadingIndicator extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {
          Platform.OS === 'ios' ?
            <ActivityIndicatorIOS {...this.props} /> :
            <ProgressBarAndroid styleAttr="Small" {...this.props} />
        }
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
