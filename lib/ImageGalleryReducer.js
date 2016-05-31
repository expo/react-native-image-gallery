/**
 * Copyright 2015-present 650 Industries. All rights reserved.
 *
 * @providesModule ImageGalleryReducer
 */
import Immutable from 'immutable';
import ActionTypes from 'ActionTypes';

import {
  OPENING_ANIMATION_IN_PROGRESS,
  CLOSED_AND_IDLE,
  CLOSING_ANIMATION_IN_PROGRESS,
} from 'ImageGalleryConstants';

const { Map } = Immutable;

function emptyState() {
  return Map({lifecycle: CLOSED_AND_IDLE});
}

class ImageGalleryReducer {
  static reduce(state = emptyState(), action) {
    if (!ImageGalleryReducer[action.type]) {
      return state;
    }
    return ImageGalleryReducer[action.type](state, action);
  }

  static [ActionTypes.OPEN_IMAGE_GALLERY](state, action) {
    let { list, item, animationMeasurements } = action;
    let itemIndex = list.get('items').indexOf(item);

    if (state.get('lifecycle') !== CLOSED_AND_IDLE) {
      return state;
    }

    return state.withMutations(map => {
      return map.set('list', list)
                .set('item', item)
                .set('initialItem', item)
                .set('itemIndex', itemIndex)
                .set('lifecycle', OPENING_ANIMATION_IN_PROGRESS)
                .set('animationMeasurements', animationMeasurements)
                .set('userWantsOpen', true);
    });
  }

  static [ActionTypes.PRELOAD_IMAGE_GALLERY](state, action) {
    let { list } = action;
    let item = list.get(0);

    return state.withMutations(map => {
      return map.set('list', list)
                .set('item', item)
                .set('initialItem', item)
                .set('itemIndex', 0)
                .set('lifecycle', CLOSED_AND_IDLE)
                .set('userWantsOpen', false);
    });
  }

  static [ActionTypes.UPDATE_IMAGE_GALLERY_LIFECYCLE](state, action) {
    return state.withMutations(map => {
      return map.set('lifecycle', action.lifecycle)
                .set('userWantsOpen', action.lifecycle === CLOSED_AND_IDLE ? false : state.get('userWantsOpen'));
    });
  }

  static [ActionTypes.CLOSE_IMAGE_GALLERY](state, action) {
    if (state.get('lifecycle') === CLOSED_AND_IDLE) {
      console.warn('Fired CLOSED_IMAGE_GALLERY with the gallery already closed!');
      return state;
    }

    return state.withMutations(map => {
      return map.remove('userWantsOpen')
                .set('lifecycle', CLOSING_ANIMATION_IN_PROGRESS);
    });
  }

  static [ActionTypes.FOCUS_IMAGE_GALLERY_ITEM](state, action) {
    let itemIndex = state.get('list').get('items').indexOf(action.item);

    return state.withMutations(map => {
      return map.set('item', action.item)
                .set('itemIndex', itemIndex);
    });
  }

  static [ActionTypes.UPDATE_IMAGE_GALLERY_ANIMATION_MEASUREMENTS](state, action) {
    return state.set('animationMeasurements', action.animationMeasurements);
  }

  static [ActionTypes.RESET](state, action) {
    return emptyState();
  }
}

export default ImageGalleryReducer.reduce;
