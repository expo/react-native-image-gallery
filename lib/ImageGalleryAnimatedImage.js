/**
 * Copyright 2015-present 650 Industries. All rights reserved.
 *
 * @providesModule ImageGalleryAnimatedImage
 */
import React, { PropTypes } from 'react';
import ReactNative, {
  Animated,
  Image,
  StyleSheet,
  Platform,
  View,
} from 'react-native';
let { PureRenderMixin } = ReactNative.addons;

import reactMixin from 'react-mixin';
import { connect } from 'react-redux';

import ImageGalleryPlaceholder from 'ImageGalleryPlaceholder';
import Layout from 'Layout';
import calculateImageDimensions from 'calculateImageDimensions';

class ImageGalleryAnimatedImage extends React.Component {

  static propTypes = {
    animationMeasurements: PropTypes.object,
    isDragging: PropTypes.bool,
    isImageGalleryOpen: PropTypes.bool,
    /* Is visible when zooming in, dragging, or animating out */
    isVisible: PropTypes.bool,
    item: PropTypes.object,
    panValue: PropTypes.object,
  };

  static getDataProps(data) {
    let { imageGallery } = data;

    return {
      item: imageGallery.get('item'),
    };
  }

  render() {
    if (this.props.isDragging || this.props.isImageGalleryOpen) {
      return this._renderDraggingState();
    } else {
      return this._renderAutoState();
    }
  }

  _renderDraggingState() {
    let {
      item,
      isVisible,
      panValue,
    } = this.props;

    let uri = item && item.get('image_url');
    let source = uri ? {uri} : null;
    let translateY = panValue;
    let style = [styles.image, {
      opacity: isVisible ? 1 : 0,
      top: Layout.headerHeight,
      transform: [{translateY}],
    }];

    if (uri) {
      let {
        constrainedWidth,
        constrainedHeight,
        marginHorizontal,
        marginVertical,
      } = calculateImageDimensions(item, Layout.window.width);

      return (
        <Animated.View pointerEvents="none" style={style}>
          <Image
            key={source.uri}
            renderToHardwareTextureAndroid
            fadeDuration={0}
            source={source}
            style={[styles.image, {
              height: constrainedHeight,
              width: constrainedWidth,
              marginVertical,
              marginHorizontal,
            }]}
          />
        </Animated.View>
      );
    } else {
      return (
        <ImageGalleryPlaceholder style={style} />
      );
    }
  }

  _renderAutoState() {
    let {
      animationMeasurements,
      item,
      isVisible,
      zoomInOutValue,
    } = this.props;

    let uri = item && item.get('image_url');
    let source = uri ? {uri} : null;

    if (!animationMeasurements || !source) {
      return <View />;
    }

    let {
      constrainedWidth,
      constrainedHeight,
      marginHorizontal,
      marginVertical,
    } = calculateImageDimensions(item, Layout.window.width);

    let { x, y, w, h } = animationMeasurements;
    let initialScaleX, initialScaleY, scaleX, scaleY, translateX, translateY;

    initialScaleX = parseFloat(w) / constrainedWidth;
    initialScaleY = parseFloat(h) / constrainedHeight;

    scaleX = zoomInOutValue.interpolate({
      inputRange: [0, 1],
      outputRange: [initialScaleX, 1.0],
    });

    scaleY = zoomInOutValue.interpolate({
      inputRange: [0, 1],
      outputRange: [initialScaleY, 1.0],
    });

    translateX = zoomInOutValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        ((w - constrainedWidth) / 2) + x,
        (Layout.window.width - constrainedWidth) / 2,
      ],
    });

    translateY = zoomInOutValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        ((h - constrainedHeight) / 2) + y + Layout.statusBarHeight,
        Layout.headerHeight + marginVertical + Layout.statusBarHeight,
      ],
    });

    return (
      <Animated.View pointerEvents="none"
        style={[
          styles.image, {
            width: constrainedWidth,
            height: constrainedHeight,
            opacity: isVisible ? 1 : 0,
            transform: [
              { translateX },
              { translateY },
              { scaleX },
              { scaleY },
            ],
          },
        ]}>
        <Animated.Image
          key={source.uri}
          renderToHardwareTextureAndroid
          fadeDuration={0}
          source={source}
          style={[styles.image, {width: constrainedWidth, height: constrainedHeight}]}
        />
      </Animated.View>
    );
  }
}

reactMixin(ImageGalleryAnimatedImage.prototype, PureRenderMixin);
export default connect(
  data => ImageGalleryAnimatedImage.getDataProps(data),
)(ImageGalleryAnimatedImage);

let styles = StyleSheet.create({
  image: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: Layout.window.width,
    height: Layout.window.width,
  },
});
