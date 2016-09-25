import ActionTypes from './ActionTypes';

export default class Actions {

  static preloadImageGallery({list}) {
    return {
      type: ActionTypes.PRELOAD_IMAGE_GALLERY,
      list,
    };
  }

  static openImageGallery(payload) {
    return {
      type: ActionTypes.OPEN_IMAGE_GALLERY,
      ...payload,
    };
  }

  static closeImageGallery() {
    return {
      type: ActionTypes.CLOSE_IMAGE_GALLERY,
    };
  }

  static updateImageGalleryLifecycle(newState) {
    return {
      type: ActionTypes.UPDATE_IMAGE_GALLERY_LIFECYCLE,
      lifecycle: newState,
    };
  }

  static focusImageGalleryItem(item) {
    return {
      type: ActionTypes.FOCUS_IMAGE_GALLERY_ITEM,
      item,
    };
  }

}
