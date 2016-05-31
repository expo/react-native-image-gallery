/**
 * Copyright 2015-present 650 Industries. All rights reserved.
 *
 * @providesModule Layout
 */
import {
  Dimensions,
  NativeModules,
  PixelRatio,
  Platform,
  StyleSheet,
} from 'react-native';

let windowDimensions = Dimensions.get('window');
let isSmallDevice = (windowDimensions.width <= 320);

let Layout = {
  isSmallDevice,
  pixel: 1 / PixelRatio.get(),
  narrowSeparator: StyleSheet.hairlineWidth,
  separator: 1,
  tabBarHeight: 49,
  navigationBarDisplacement: 0,
  footerHeight: 49,
  marginHorizontal: isSmallDevice ? 10 : 15,
  statusBarHeight: Platform.OS === 'ios' ? 25 : 0,
  timestampWidth: 35,
  window: windowDimensions,
  navigationBarHeight: 44,
  softButtonHeight: 48,
  navigationBarDisplacement: 25,
};

if (Platform.OS === 'android') {
  Layout.navigationBarHeight = 58;
  Layout.headerHeight = Layout.navigationBarHeight;
} else {
  Layout.navigationBarHeight = 44;
  Layout.headerHeight = Layout.navigationBarHeight + Layout.statusBarHeight;
}

export default Layout;
