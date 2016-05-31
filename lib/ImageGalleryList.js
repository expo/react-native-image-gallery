/**
 * Copyright 2015-present 650 Industries. All rights reserved.
 *
 * @providesModule ImageGalleryList
 */
import React, { PropTypes } from 'react';
import ReactNative, {
  View,
} from 'react-native';
let { PureRenderMixin } = ReactNative.addons;
import reactMixin from 'react-mixin';

import ImageGalleryItem from 'ImageGalleryItem';
import Layout from 'Layout';
import ViewPager from 'ViewPager';

export default class ImageGalleryList extends React.Component {
  static propTypes = {
    onPageSelected: PropTypes.func.isRequired,
    list: PropTypes.object,
  };

  render() {
    let { list } = this.props;

    return (
      <ViewPager
        key={list ? list.get('list_id') : 'empty-pager'}
        style={this.props.style}
        ref={view => { this._pager = view; }}
        onPageSelected={this.props.onPageSelected}>

        { /* Ideally we would do this inside of a ListView.. But that is not
             currently supported by ViewPager -- it does not conform to the
             ScrollView interface that ListView expects from
             renderScrollComponent */ }
        {list && list.get('items').map(this._renderItem)}
      </ViewPager>
    );
  }

  _renderItem = (item, i) => {
    let { list } = this.props;

    // note(brentvatne): I'm not sure why but items can get into this state
    // without having an id! Weird. So let's use the array index if they don't
    // have an id.
    let id;
    if (!item || !item.get || !item.get('id') || !item.get('id').toString) {
      id = i.toString();
    } else {
      id = item.get('id').toString();
    }

    return (
      <View style={{flex: 1}} key={id}>
        <ImageGalleryItem
          list={list}
          item={item}
          index={i}
          onPress={this.props.onPressItem}
          width={Layout.window.width}
        />
      </View>
    );
  };

  scrollToPage(index) {
    this._pager.scrollToPage(index);
  }
}

reactMixin(ImageGalleryList.prototype, PureRenderMixin);
