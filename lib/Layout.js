import {
  Dimensions,
  NativeModules,
  PixelRatio,
  Platform,
  StyleSheet,
} from 'react-native';

import { Constants } from 'exponent';

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

if (Platform.OS === 'android') {
  Layout.navigationBarHeight = 58;
} else {
  Layout.navigationBarHeight = 44;
}

Layout.headerHeight = Layout.navigationBarHeight + Layout.statusBarHeight;

export default Layout;
