import {
  Dimensions,
  NativeModules,
  PixelRatio,
  Platform,
  StyleSheet,
} from 'react-native';

import { Header } from 'react-navigation';
import { Constants } from 'expo';

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
  statusBarHeight: Constants.statusBarHeight,
  timestampWidth: 35,
  window: windowDimensions,
  navigationBarHeight: 44,
  softButtonHeight: 48,
  navigationBarDisplacement: 25,
};

Layout.headerHeight = Header.HEIGHT;

export default Layout;
