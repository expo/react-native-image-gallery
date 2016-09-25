import React, { PropTypes } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  ViewPagerAndroid,
  View,
} from 'react-native';

import Layout from './Layout';

export default class ViewPager extends React.Component {
  static propTypes = {
    style: View.propTypes.style,
    onPageSelected: PropTypes.func.isRequired,
  };

  render() {
    if (Platform.OS === 'ios') {
      return (
        <ScrollView
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={{backgroundColor: 'transparent'}}
          horizontal
          pagingEnabled
          onMomentumScrollEnd={this._onScrollEnd}
          ref={view => { this._scrollView = view; }}
          removeClippedSubviews
          alwaysBounceHorizontal={false}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          {...this.props}
        />
      );
    } else {
      return (
        <ViewPagerAndroid
          {...this.props}
          ref={view => { this._pager = view; }}
          onPageSelected={this._onPageSelected}
        />
      );
    }
  }

  scrollToPage(index) {
    if (Platform.OS === 'ios') {
      let scrollPositionX = index * Layout.window.width;
      this._scrollView.scrollTo({y: 0, x: scrollPositionX, animated: false});
    } else {
      this._pager.setPageWithoutAnimation(index);
    }
  }

  _onScrollEnd = ({ nativeEvent: { contentOffset: { x } }}) => {
    let index = parseInt(x / Layout.window.width, 10);
    this.props.onPageSelected(index);
  };

  _onPageSelected = ({ nativeEvent: { position }}) => {
    this.props.onPageSelected(position);
  };
}
