/**
 * Sample image gallery app
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Immutable from 'immutable';

import Actions from 'Actions';
import Layout from 'Layout';
import ImageGallery from 'ImageGallery';
import ExampleStore from 'ExampleStore';

class ListItem extends Component {

  _openInImageGallery = () => {
    let { list, item } = this.props;

    this._view.measure((rx, ry, w, h, x, y) => {
      ExampleStore.dispatch(Actions.openImageGallery({
        animationMeasurements: {w, h, x, y},
        list,
        item,
      }));
    });
  };

  render() {
    let { list, item } = this.props;

    let width = item.getIn(['asset', 'width']);
    let height = item.getIn(['asset', 'height']);

    let targetWidth = 200.0;
    let multiplier = targetWidth/width;
    let targetHeight = multiplier * height;

    return (
      <TouchableOpacity
        style={{marginBottom: 20}}
        onPress={this._openInImageGallery}>
        <Image
          ref={view => { this._view = view }}
          source={{uri: item.get('image_url')}}
          style={{width: targetWidth, height: targetHeight}} />
      </TouchableOpacity>
    );
  }

}

class FakeContent extends Component {


  render() {
    return (
      <View style={{flex: 1, paddingTop: Platform.OS === 'android' ? 20 : 40, paddingBottom: Platform.OS === 'android' ? 10 : 0}}>
        <View style={{paddingBottom: 10, borderBottomColor: '#eee', borderBottomWidth: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 20, marginLeft: 10}}>My favourite cats</Text>
        </View>

        <ScrollView style={{flex: 1}} contentContainerStyle={{alignItems: 'center', paddingTop: 20}}>
          {list.get('items').map(item => <ListItem key={item.get('id')} list={list} item={item} />)}
        </ScrollView>
      </View>
    );
  }

}

class ImageGalleryExample extends Component {

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <FakeContent />
        </View>

        <ImageGallery store={ExampleStore} />
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

const list = Immutable.fromJS({
  items: [
    {
      id: 'a',
      description: 'This cat is orange! An orange cat! Its eyes are olive though.',
      image_url: 'https://s3-us-west-2.amazonaws.com/examples-exp/image-gallery/cat1.jpg',
      asset: {
        width: 632,
        height: 475,
        type: 'static',
        cover: {
          uri: 'https://s3-us-west-2.amazonaws.com/examples-exp/image-gallery/cat1.jpg',
        }
      }
    },
    {
      id: 'b',
      image_url: 'https://s3-us-west-2.amazonaws.com/examples-exp/image-gallery/cat2.jpg',
      description: 'Look at this cat catching a mouse. Notice that "catch" includes the word "cat". Coincidence?',
      asset: {
        width: 1000,
        height: 764,
        type: 'static',
        cover: {
          uri: 'https://s3-us-west-2.amazonaws.com/examples-exp/image-gallery/cat2.jpg',
        }
      }
    },
    {
      id: 'c',
      image_url: 'https://s3-us-west-2.amazonaws.com/examples-exp/image-gallery/cat3.png',
      description: 'This cat is eating a banana, while dressed as a monkey. Silly cat, you are a cat not a monkey! Congrats on going vegetarian though, be sure to take your b12',
      asset: {
        width: 785,
        height: 785,
        type: 'static',
        cover: {
          uri: 'https://s3-us-west-2.amazonaws.com/examples-exp/image-gallery/cat3.png',
        }
      }
    }
  ],
});

AppRegistry.registerComponent('ImageGalleryExample', () => ImageGalleryExample);
