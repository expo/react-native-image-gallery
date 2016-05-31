/**
 * @providesModule ExampleStore
 */

import { combineReducers, createStore } from 'redux';
import imageGalleryReducer from 'ImageGalleryReducer';

const store = createStore(combineReducers({
  imageGallery: imageGalleryReducer,
}));

export default store;
