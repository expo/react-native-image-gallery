import React, { PropTypes } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  View,
} from 'react-native';

import { connect } from 'react-redux';

import {
  OPENING_ANIMATION_IN_PROGRESS,
  OPEN_AND_IDLE,
  DRAG_IN_PROGRESS,
} from './ImageGalleryConstants';
import Colors from './Colors';
import ImageGalleryImage from './ImageGalleryImage';
import { shallowEquals, shallowEqualsIgnoreKeys } from './ShallowEquals';

class ImageGalleryItem extends React.Component {

  static propTypes = {
    item: PropTypes.object,
    index: PropTypes.number,
    activeItem: PropTypes.object,
    activeItemIndex: PropTypes.number,
    initialItem: PropTypes.object,
    list: PropTypes.object,
    lifecycle: PropTypes.string,
    width: PropTypes.number,
    userWantsOpen: PropTypes.bool,
    renderDescription: PropTypes.func,
  };

  static getDataProps(data) {
    let { imageGallery } = data;

    return {
      activeItemIndex: imageGallery.get('itemIndex'),
      activeItem: imageGallery.get('item'),
      initialItem: imageGallery.get('initialItem'),
      userWantsOpen: imageGallery.get('userWantsOpen'),
      lifecycle: imageGallery.get('lifecycle'),
    };
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      shouldRender: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    let keysToIgnore = ['list'];

    if (nextProps.lifecycle === DRAG_IN_PROGRESS) {
      if (nextProps.activeItem !== this.props.item) {
        return false;
      }
    }

    if (nextProps.lifecycle === OPEN_AND_IDLE) {
      if (this.props.index === nextProps.activeItemIndex) {
        return true;
      }
    }

    return !shallowEqualsIgnoreKeys(this.props, nextProps, keysToIgnore) ||
           !shallowEquals(this.state, nextState);
  }

  componentWillMount() {
    if (this._shouldRender(this.props)) {
      this.setState({shouldRender: true});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.shouldRender && this._shouldRender(nextProps)) {
      this.setState({shouldRender: true});
    }
  }

  /* Extremely basic logic for determining what should render and when */
  _shouldRender(nextProps) {
    if (nextProps.activeItemIndex === this.props.index) {
      return true;
    }

    if (nextProps.lifecycle === OPEN_AND_IDLE) {
      if (nextProps.activeItemIndex - 1 === this.props.index ||
          nextProps.activeItemIndex + 1 === this.props.index) {
        return true;
      }
    }

    return false;
  }

  render() {
    let { item, index, list, width, lifecycle, renderDescription } = this.props;
    let description;

    if (renderDescription) {
      description = renderDescription(item.get('description'));
    } else {
      description = (
        <View style={{flex: 1, backgroundColor: '#fff', padding: 20}}>
          <Text>{item.get('description')}</Text>
        </View>
      );
    }

    if (this.state.shouldRender) {
      return (
        <View key={index} style={[{width}, styles.itemContainer]}>
          <TouchableWithoutFeedback onPress={this.props.onPress}>
            <View style={[{width, height: width}, styles.imageContainer]}>
              {lifecycle !== OPENING_ANIMATION_IN_PROGRESS || Platform.OS === 'ios' ?
                this._renderImage() : null}
            </View>
          </TouchableWithoutFeedback>

          {description}
        </View>
      );
    } else {
      return (
        <View key={index} style={[{width}, styles.itemContainer]}>
          <View style={[{width, height: width}, styles.imageContainer]} />
          <View style={{flex: 1, backgroundColor: '#fff'}} />
        </View>
      );
    }
  }

  _renderImage() {
    let {
      activeItemIndex,
      index,
      initialItem,
      item,
      lifecycle,
      width,
    } = this.props;

    return (
      <ImageGalleryImage
        isVisible={lifecycle === OPEN_AND_IDLE}
        isFocused={activeItemIndex === index}
        fadeInOnLoad={initialItem !== item}
        item={item}
        width={width}
      />
    );
  }
}

export default connect(
  data => ImageGalleryItem.getDataProps(data),
)(ImageGalleryItem);

let styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    backgroundColor: Colors.galleryBackground,
  },
  imageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#deddde',
  },
  listItemContainerStyle: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
