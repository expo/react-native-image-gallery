import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import Immutable from 'immutable';
import ImageGallery, { openImageGallery } from '@expo/react-native-image-gallery';

class ListItem extends React.Component {
  _openInImageGallery = () => {
    let { item } = this.props;

    this._view.measure((rx, ry, w, h, x, y) => {
      openImageGallery({
        animationMeasurements: { w, h, x, y },
        list,
        item,
      });
    });
  };

  render() {
    let { item } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this._openInImageGallery}>
        <Image
          ref={view => { this._view = view }}
          source={{ uri: item.imageUrl }}
          style={styles.thumbnail} />
      </TouchableWithoutFeedback>
    );
  }

}

class ImageGrid extends React.Component {
  render() {
    return (
      <View style={styles.imagegrid}>
        <View style={styles.header}>
          <Text style={styles.heading}>Example Image Gallery</Text>
        </View>

        <ScrollView contentContainerStyle={styles.layout}>
          {list.map(item => <ListItem key={item.imageUrl} item={item} />)}
        </ScrollView>
      </View>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ImageGrid />

        <ImageGallery />

        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
var THUMBNAILS_PER_ROW = 2;
var THUMBNAIL_SPACING = 10;
var THUMBNAIL_SIZE = ((DEVICE_WIDTH - (THUMBNAIL_SPACING * ((THUMBNAILS_PER_ROW * 2) + 2))) / THUMBNAILS_PER_ROW);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  thumbnail: {
    margin: THUMBNAIL_SPACING,
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
  },
  header: {
    padding: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
  },
  imagegrid: {
    flex: 1,
  },
  layout: {
    margin: THUMBNAIL_SPACING,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
});

const list = [
  {
    description: 'Image 1',
    imageUrl: 'http://placehold.it/480x480&text=Image%201',
    width: 480,
    height: 480,
  },
  {
    description: 'Image 2',
    imageUrl: 'http://placehold.it/640x640&text=Image%202',
    width: 640,
    height: 640,
  },
  {
    description: 'Image 3',
    imageUrl: 'http://placehold.it/640x640&text=Image%203',
    width: 640,
    height: 640,
  }
];
