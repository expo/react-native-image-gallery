/**
 * Copyright 2015-present 650 Industries. All rights reserved.
 *
 * @providesModule calculateImageDimensions
 */
export default function calculateImageDimensions(item, maxLength) {
  let originalWidth = item.getIn(['asset', 'width']);
  let originalHeight = item.getIn(['asset', 'height']);

  if (originalWidth == null || originalHeight == null) {
    return {
      constrainedHeight: maxLength,
      constrainedWidth: maxLength,
      marginHorizontal: 0,
      marginVertical: 0,
    };
  } else if (originalWidth > originalHeight) {
    let height = (originalHeight / originalWidth) * maxLength;
    return {
      constrainedHeight: height,
      constrainedWidth: maxLength,
      marginHorizontal: 0,
      marginVertical: (maxLength - height) / 2,
    };
  } else {
    let width = (originalWidth / originalHeight) * maxLength;
    return {
      constrainedWidth: width,
      constrainedHeight: maxLength,
      marginHorizontal: (maxLength - width) / 2,
      marginVertical: 0,
    };
  }
}
