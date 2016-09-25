import React, { PropTypes } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
} from 'react-native';

import ImageGalleryPlaceholder from './ImageGalleryPlaceholder';
import { shallowEquals } from './ShallowEquals';
import calculateImageDimensions from './calculateImageDimensions';

export default class ImageGalleryImage extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    fadeInOnLoad: PropTypes.bool,
    width: PropTypes.number,
    isVisible: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);

    this.state = { hideThrobber: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEquals(this.props, nextProps) ||
           !shallowEquals(this.state, nextState);
  }

  render() {
    let { item, width, isVisible } = this.props;

    let imageStyle = {
      width,
      height: width,
      opacity: isVisible ? 1 : 0,
      borderRadius: 0.1,
    };

    if (item.get('image_url')) {
      let imageUri = item.getIn(['asset', 'url']) || item.get('image_url');

      let {
        constrainedWidth,
        constrainedHeight,
        marginHorizontal,
        marginVertical,
      } = calculateImageDimensions(item, width);

      let imageLayout = {
        height: constrainedHeight,
        width: constrainedWidth,
        marginVertical,
        marginHorizontal,
      };

      let isAnimatedImage = item.getIn(['asset', 'type']) === 'animated_image';

      let image;
      if ((isAnimatedImage && this.props.isFocused) || !isAnimatedImage) {
        image = (
          <Image
            onLoadEnd={this._onImageLoad}
            source={{uri: imageUri}}
            style={[imageStyle, imageLayout]}
          />
        );
      }

      let coverImage;
      if (isAnimatedImage) {
        let coverUri = item.getIn(['asset', 'cover', 'url']);
        coverImage = (
          <Image
            source={{uri: coverUri}}
            style={[imageStyle, imageLayout]}
          />
       );
      }

      if (coverImage) {
        image = <View style={styles.absoluteFill}>{image}</View>;
      }

      return (
        <View style={imageStyle}>
          {this._maybeRenderThrobber()}
          {coverImage}
          {image}
        </View>
      );
    } else {
      return <ImageGalleryPlaceholder style={imageStyle} />;
    }
  }

  _onImageLoad = () => {
    this.setState({hideThrobber: true});
  };

  _maybeRenderThrobber() {
    let { isVisible } = this.props;
    let { hideThrobber } = this.state;

    if (hideThrobber || !isVisible) {
      return;
    }

    return (
      <View style={styles.throbberContainer}>
        <ActivityIndicator />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  throbberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#e8e8ec',
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

});
