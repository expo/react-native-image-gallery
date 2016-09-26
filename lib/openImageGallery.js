import Actions from './Actions';
import DefaultStore from './DefaultStore';
import Immutable from 'immutable';
import { Asset } from 'exponent';

function transformToInternalStructure(images) {
  let internalImageFormat = images.map((info, i) => {
    let image;

    if (info.image) {
      let assetInfo = Asset.fromModule(info.image);
      image = {...info, imageUrl: assetInfo.uri, width: assetInfo.width, height: assetInfo.height};
    } else {
      image = info;
    }

    return {
      id: image.imageUrl,
      image_url: image.imageUrl,
      description: image.description,
      width: image.width,
      height: image.height,
      asset: {
        type: 'static',
        width: image.width,
        height: image.height,
        cover: {
          uri: image.imageUrl,
        },
      }
    }
  });

  return Immutable.fromJS({items: internalImageFormat, list_id: (new Date()).toISOString()});
}

export default function openImageGallery(options) {
  let selectedItemIndex = options.list.indexOf(options.item);
  let list = transformToInternalStructure(options.list);
  let item = list.get('items').get(selectedItemIndex);

  DefaultStore.dispatch(Actions.openImageGallery({
    ...options,
    list,
    item,
  }));
}
