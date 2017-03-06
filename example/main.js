import Expo from 'expo';
import React from 'react';
import {
  AppRegistry,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  StatusBar,
} from 'react-native';

import Immutable from 'immutable';
import ImageGallery, { openImageGallery } from '@expo/react-native-image-gallery';

class ListItem extends React.Component {
  _openInImageGallery = () => {
    let { item } = this.props;

    this._view.measure((rx, ry, w, h, x, y) => {
      openImageGallery({
        animationMeasurements: {w, h, x, y},
        list,
        item,
      });
    });
  };

  render() {
    let { list, item } = this.props;

    let { width, height } = item;

    let targetWidth = 150.0;
    let multiplier = targetWidth / width;
    let targetHeight = multiplier * height;

    return (
      <TouchableWithoutFeedback onPress={this._openInImageGallery}>
        <Image
          ref={view => { this._view = view }}
          source={{uri: item.imageUrl}}
          style={{width: targetWidth, height: targetHeight, marginBottom: 20}} />
      </TouchableWithoutFeedback>
    );
  }

}

class FakeContent extends React.Component {
  render() {
    return (
      <View style={{flex: 1, paddingTop: 40, paddingBottom: Platform.OS === 'android' ? 10 : 0}}>
        <View style={{paddingBottom: 10, borderBottomColor: '#eee', borderBottomWidth: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 20, marginLeft: 10}}>My favourite brewery</Text>
        </View>

        <ScrollView style={{flex: 1}} contentContainerStyle={{alignItems: 'center', paddingTop: 20}}>
          {list.map(item => <ListItem key={item.imageUrl} item={item} />)}
        </ScrollView>
      </View>
    );
  }
}

class App extends React.Component {

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <FakeContent />
        </View>

        <ImageGallery />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

const list = [
  {
    description: ':O hat etc',
    imageUrl: 'https://scontent-sea1-1.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/14276382_1737295453196749_1335762274_n.jpg?ig_cache_key=MTMzNDMzMDE3NTk0MDQyMDQ4Ng%3D%3D.2',
    width: 480,
    height: 480,
  },
  {
    imageUrl: 'https://scontent-sea1-1.cdninstagram.com/t51.2885-15/e15/14448401_926765740761369_3613737894616760320_n.jpg?ig_cache_key=MTM0NDQ0OTEzNDI0OTIxMzgzNA%3D%3D.2',
    description: 'wood',
    width: 640,
    height: 640,
  },
  {
    imageUrl: 'https://scontent-sea1-1.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/14272256_1576830565957175_619863550_n.jpg?ig_cache_key=MTMzOTMwNzg3OTc3NzI1MTQzMA%3D%3D.2',
    description: 'making beer etc',
    width: 640,
    height: 640,
  }
];

Expo.registerRootComponent(App);
