/**
 * Based off of shallowEqual utility in react-redux
 */
export function shallowEqualsIgnoreKeys(objA, objB, keysToIgnore) {
  if (objA === objB) {
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty;
  for (let i = 0; i < keysA.length; i++) {
    if ((keysToIgnore.indexOf(keysA[i]) === -1) &&
        (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

export function shallowEqualsIgnoreKey(objA, objB, keyToIgnore) {
  return shallowEqualsIgnoreKeys(objA, objB, [keyToIgnore]);
}

export function shallowEquals(objA, objB) {
  return shallowEqualsIgnoreKeys(objA, objB, []);
}

export default {
  shallowEquals,
  shallowEqualsIgnoreKey,
  shallowEqualsIgnoreKeys,
};
