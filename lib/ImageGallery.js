import React, { PropTypes } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { connect, Provider } from 'react-redux';

import Actions from './Actions';
import Colors from './Colors';
import ImageGalleryAnimatedImage from './ImageGalleryAnimatedImage';
import ImageGalleryHeaderBar from './ImageGalleryHeaderBar';
import ImageGalleryList from './ImageGalleryList';
import {
  OPENING_ANIMATION_IN_PROGRESS,
  OPEN_AND_IDLE,
  CLOSING_ANIMATION_IN_PROGRESS,
  CLOSED_AND_IDLE,
  DRAG_IN_PROGRESS,
} from './ImageGalleryConstants';
import Layout from './Layout';
import { shallowEqualsIgnoreKeys } from './ShallowEquals';
import DefaultStore from './DefaultStore';
import { getBackButtonManager } from '@expo/ex-navigation';

const TOP_OFFSET = Layout.headerHeight;
const USE_NATIVE_DRIVER = false;
// const USE_NATIVE_DRIVER = Platform.OS === 'android' ? true : false;

@connect(data => ImageGallery.getDataProps(data))
class ImageGallery extends React.Component {
  static getDataProps(data) {
    let { imageGallery } = data;

    return {
      animationMeasurements: imageGallery.get('animationMeasurements'),
      userWantsOpen: imageGallery.get('userWantsOpen'),
      lifecycle: imageGallery.get('lifecycle'),
      item: imageGallery.get('item'),
      list: imageGallery.get('list'),
    };
  }

  static childContextTypes = {
    store: PropTypes.object,
  }

  getChildContext() {
    return { store: DefaultStore }
  }

  shouldComponentUpdate(nextProps) {
    return !shallowEqualsIgnoreKeys(
      this.props,
      nextProps,
      ['animationMeasurements', 'item']
    );
  }

  static propTypes = {
    animationMeasurements: PropTypes.object,
    userWantsOpen: PropTypes.bool,
    item: PropTypes.object,
    list: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      zoomInOutValue: new Animated.Value(0),
      panValue: new Animated.Value(0),
      innerContentValue: new Animated.Value(0),
    };
  }

  componentWillMount() {
    if (USE_NATIVE_DRIVER) {
      this.state.innerContentValue.__makeNative();
      this.state.zoomInOutValue.__makeNative();
      this.state.panValue.__makeNative();
    }

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._onMoveShouldSetPanResponder,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderTerminationRequest: true,
      onPanResponderTerminate: this._onPanResponderEnd,
      onPanResponderRelease: this._onPanResponderEnd,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.lifecycle === OPENING_ANIMATION_IN_PROGRESS) {
      this._updateScrollPositionFromProps(nextProps);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.lifecycle === OPENING_ANIMATION_IN_PROGRESS) {
      this._updateScrollPositionFromProps(this.props);
    }

    requestAnimationFrame(() => {
      if (!prevProps.userWantsOpen && this.props.userWantsOpen) {
        this._enableBackButtonOverride();
        this._animateZoomIn(this.props);
      } else if (prevProps.userWantsOpen && !this.props.userWantsOpen) {
        if (this.props.lifecycle !== CLOSED_AND_IDLE) {
          this._animateAutomatedSlideOut();
        }
      }
    });
  }

  render() {
    let { userWantsOpen, list, lifecycle } = this.props;
    let { innerContentValue, zoomInOutValue } = this.state;
    let isVisible = lifecycle !== CLOSED_AND_IDLE;
    let isDragging =
      lifecycle === DRAG_IN_PROGRESS ||
      lifecycle === CLOSING_ANIMATION_IN_PROGRESS;

    /* note(brentvatne): no idea why 7 is necessary here, shouldn't it just be
    * the tabBarHeight? */
    const SOME_NUMBER_I_DONT_UNDERSTAND = 7;
    const topClippingOffset = isDragging ? 0 : TOP_OFFSET - Layout.statusBarHeight;
    const bottomClippingOffset = isDragging ?
      -topClippingOffset :
      -topClippingOffset + Layout.tabBarHeight + SOME_NUMBER_I_DONT_UNDERSTAND - Layout.statusBarHeight;

    return (
      <View
        style={[styles.container, {opacity: isVisible ? 1 : 0}]}
        pointerEvents={userWantsOpen ? 'auto' : 'none'}
        {...this._panResponder.panHandlers}>

        <Animated.View
          style={[styles.underlay, {opacity: zoomInOutValue, top: isDragging ? 0 : undefined}]}
        />

        <Animated.View style={{flex: 1, opacity: innerContentValue}}>
          <ImageGalleryList
            list={list}
            ref={view => { this._list = view; }}
            onPageSelected={this._onPageSelected}
            onPressItem={this._closeGallery}
            style={styles.list}
            renderDescription={this.props.renderDescription}
          />

          <ImageGalleryHeaderBar
            style={styles.headerBar}
            animatedOpacity={this.state.zoomInOutValue}
            renderRight={this.props.renderHeaderRight}
            onPressDone={this._closeGallery}
          />
        </Animated.View>

        { /* note(brentvatne): These two wrapper views are required to clip the
             animated image, to create the impression that it is going
             underneath the navbar */ }
        <View style={[styles.fullSize,
          { top: topClippingOffset,
            bottom: bottomClippingOffset,
            overflow: 'hidden',
            height: this._isAnimatedImageVisible() ? undefined : 0,
          }]}>
          <View style={[styles.fullSize, {transform: [{translateY: isDragging ? 0 : -TOP_OFFSET}]}]}>
            <ImageGalleryAnimatedImage
              animationMeasurements={this.props.animationMeasurements}
              isDragging={isDragging}
              isVisible={this._isAnimatedImageVisible()}
              isImageGalleryOpen={lifecycle === OPEN_AND_IDLE}
              panValue={this.state.panValue}
              zoomInOutValue={this.state.zoomInOutValue}
            />
          </View>
        </View>

        {isVisible && <StatusBar barStyle="default" />}
      </View>
    );
  }

  // Scroll the gallery to the item whose image was tapped on.
  _updateScrollPositionFromProps(props) {
    let { list, item } = props;
    let index = list.get('items').indexOf(item);
    this._list.scrollToPage(index);
  }

  _animateZoomIn = (props = this.props) => {
    let { zoomInOutValue, innerContentValue } = this.state;
    let animationConfig = {
      toValue: 1,
      duration: 200,
      easing: Easing.inOut(Easing.linear),
      useNativeDriver: USE_NATIVE_DRIVER,
    };

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(innerContentValue, animationConfig),
        Animated.timing(zoomInOutValue, animationConfig),
      ]).start(({finished}) => {
        if (!finished) {
          return;
        }

        requestAnimationFrame(() => {
          this.props.dispatch(Actions.updateImageGalleryLifecycle(OPEN_AND_IDLE));
        });
      });
    });
  };

  _animateAutomatedSlideOut = () => {
    Animated.timing(this.state.innerContentValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();

    this._animateSlideOut(5, 1, 150);
  };

  _animateSlideOut = (vy, dy, duration = 150) => {
    let { panValue, zoomInOutValue } = this.state;
    let boundary = Layout.window.height;

    let zoomAnimationConfig = {
      toValue: 0,
      duration,
      easing: Easing.inOut(Easing.linear),
      useNativeDriver: USE_NATIVE_DRIVER,
    };

    let toValue;
    if (Math.abs(vy) <= 5) {
      // very very still so just use dy
      toValue = dy <= 0 ? -boundary : boundary;
    } else {
      // just moved by a reasonable amount, so just vy
      toValue = vy < 0 ? -boundary : boundary;
    }

    let panAnimationConfig = {
      toValue,
      velocity: vy,
      bounciness: 0,
      useNativeDriver: USE_NATIVE_DRIVER,
    };

    Animated.spring(panValue, panAnimationConfig).start();

    setTimeout(() => {
      Animated.timing(zoomInOutValue, zoomAnimationConfig).start(({finished}) => {
        this.props.dispatch(
          Actions.updateImageGalleryLifecycle(CLOSED_AND_IDLE)
        );

        this._disableBackButtonOverride();

        // Reset the now hidden gallery to its original position
        panValue.setValue(0);
        zoomInOutValue.setValue(0);
      });
    }, duration);
  };

  _closeGallery = () => {
    let { lifecycle } = this.props;

    if (lifecycle === OPEN_AND_IDLE) {
      this.props.dispatch(Actions.closeImageGallery());
    }
  };

  _isAnimatedImageVisible() {
    return [
      CLOSED_AND_IDLE,
      OPEN_AND_IDLE,
    ].indexOf(this.props.lifecycle) === -1;
  }

  _onPageSelected = index => {
    let activeItem = this.props.list.get('items').get(index);
    this.props.dispatch(Actions.focusImageGalleryItem(activeItem));
  };

  _onMoveShouldSetPanResponder = (e, {moveY, dx, dy}) => {
    const topOfDescriptionBox =
      Layout.window.width + // Images are 1:1 aspect ratio, full screen width
      Layout.headerHeight;

    if (this.props.lifecycle !== OPEN_AND_IDLE) {
      return false;
    }

    let y0 = moveY - dy;
    if (y0 >= Layout.headerHeight &&
        moveY >= Layout.headerHeight &&
        y0 <= topOfDescriptionBox &&
        moveY <= topOfDescriptionBox &&
        Math.abs(dy) > (Math.abs(dx) * 2)) {
      return true;
    }
  };

  _onPanResponderGrant = (e, gestureState) => {
    // There appears to be a bug with iOS PanResponder/ScrollView where the
    // PanResponder is able to try to take responder status away from a
    // scrolling ScrollView, and all it does is fire grant then that's it
    // -- no terminate or anything. So we have to do the initialization for
    // the gesture in onPanResponderMove -- if we were to do it here then
    // when the formerly mentioned edge-case occurs we would end up in a
    // start where the gesture was initialized but never canceled.
    this._responderGranted = true;
  };

  _onPanResponderMove = (e, {dy}) => {
    if (this._responderGranted) {
      Animated.timing(this.state.innerContentValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();

      this.state.panValue.setOffset(this.state.panValue._value);
      this.state.panValue.setValue(0);
      this.props.dispatch(Actions.updateImageGalleryLifecycle(DRAG_IN_PROGRESS));
      this._responderGranted = false;
    }

    // This calculation is based off of some manual tweaking to get the opacity
    // looking right as you move further away from the center towards the top
    // or bottom
    let opacity = 1 - (Math.abs(dy / parseFloat(Layout.window.height / 2))) / 2;

    // Update the underlay opacity
    this.state.zoomInOutValue.setValue(opacity);
    // Update the actual pan position
    this.state.panValue.setValue(dy);
  };

  _onPanResponderEnd = (e, {moveX, moveY, dx, dy, vx, vy}) => {
    let { innerContentValue, panValue, zoomInOutValue } = this.state;
    panValue.flattenOffset();

    const duration = 300;
    const throwThreshold = 150;

    // The iOS logic should be what we use on both platforms --but-- Android does not
    // calculate the vy in the same way! This is a bug
    let shouldAnimateOut = false;
    if (Platform.OS === 'android' && (dy >= throwThreshold || dy <= -throwThreshold)) {
      shouldAnimateOut = true;
    } else if (Platform.OS === 'ios' && ((vy >= 1 || vy <= -1) || (dy >= throwThreshold || dy <= -throwThreshold))) {
      shouldAnimateOut = true;
    }

    if (shouldAnimateOut) {
      this._animateSlideOut(vy, dy);
    } else {
      Animated.spring(panValue, {toValue: 0, speed: 30, bounciness: 8, useNativeDriver: USE_NATIVE_DRIVER }).start();
      Animated.parallel([
        Animated.timing(innerContentValue, {toValue: 1, duration, useNativeDriver: USE_NATIVE_DRIVER }),
        Animated.timing(zoomInOutValue, {toValue: 1, duration, useNativeDriver: USE_NATIVE_DRIVER }),
      ]).start(({finished}) => {
        if (finished) {
          this.props.dispatch(Actions.updateImageGalleryLifecycle(OPEN_AND_IDLE));
        }
      });
    }
  };

  // We can't assume that we are using ex-navigation
  _enableBackButtonOverride() {
    if (Platform.OS === 'android') {
      getBackButtonManager().pushListener(() => {
        this._closeGallery();
        return true;
      });
    }
  }

  _disableBackButtonOverride() {
    if (Platform.OS === 'android') {
      getBackButtonManager().ensureGlobalListener();
    }
  }
}

export default class ImageGalleryContainer extends React.Component {
  render() {
    return (
      <Provider store={DefaultStore}>
        <ImageGallery {...this.props} />
      </Provider>
    );
  }
}

let styles = StyleSheet.create({
  fullSize: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  underlay: {
    position: 'absolute',
    top: TOP_OFFSET,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.galleryBackground,
  },
  headerBar: {
    backgroundColor: Colors.barBackground,
    borderBottomWidth: 1 * StyleSheet.hairlineWidth,
    borderBottomColor: Colors.barBorder,
    height: Layout.headerHeight,
    paddingTop: Layout.statusBarHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    position: 'absolute',
    top: Layout.headerHeight,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
});
