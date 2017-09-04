
const TOPLEFT = 0;
const TOP = 1;
const TOPRIGHT = 2;
const LEFT = 3;
const RIGHT = 4;
const BOTTOMLEFT = 5;
const BOTTOM = 6;
const BOTTOMRIGHT = 7;

/**
 * Retrieve the css transform-origin attribute value.
 * 
 * @param {number} from 
 */
function updateOrigin(from) {
  let origin = null;
  switch (from) {
    case TOPLEFT:
      origin = 'top left';
      break;
    case TOP:
      origin = 'top center';
      break;
    case TOPRIGHT:
      origin = 'top right';
      break;
    case LEFT:
      origin = 'left middle';
      break;
    case RIGHT:
      origin = 'right middle';
      break;
    case BOTTOMLEFT:
      origin = 'bottom left';
      break;
    case BOTTOM:
      origin = 'bottom center';
      break;
    case BOTTOMRIGHT:
      origin = 'bottom right';
      break;
    default:
      origin = null;
  }
  return origin;
}

/**
 * Retrieve an exact position based on an element and area of that element.
 * {
 *  top, bottom, left, right, origin
 * }
 * 
 * @param {Object} element 
 * @param {number} from 
 * @return {Object}
 */
function updatePosition(element, from) {
  if(!element) return {};
  let newPosition = {};
  const box = element.getBoundingClientRect();
  switch(from) {
    case TOPLEFT:
      newPosition = {top: box.bottom, left: box.left}
      break;
    case TOP:
      newPosition = {top: box.bottom, left: box.left-box.width/2}
      break;
    case TOPRIGHT:
      newPosition = {top: box.bottom, right: window.innerWidth - box.right}
      break;
    case LEFT:
      newPosition = {top: box.top-box.height/2, left: box.right}
      break;
    case RIGHT:
      newPosition = {top: box.top-box.height/2, right: window.innerWidth - box.right}
      break;
    case BOTTOMLEFT:
      newPosition = {bottom: box.top, left: box.left}
      break;
    case BOTTOM:
      newPosition = {bottom: box.top, left: box.left-box.width/2}
      break;
    case BOTTOMRIGHT:
      newPosition = {bottom: box.top, right: window.innerWidth -  box.right}
      break;
    default:
  }
  newPosition.origin = updateOrigin(from);
  return newPosition;
}

/**
 * Set an element's origins from a specific x and y coordinate.
 * 
 * @param {Object} element 
 * @param {number} x 
 * @param {number} y 
 */
function updateOriginFromCoordinates(element, x, y) {
  if(element) {
    const box = element.getBoundingClientRect();
    return (box.left+box.width/2)+'px '+(box.top+box.height/2)+'px';
  }
  else if (x !== null && x !== undefined && y !== null && y !== undefined) {
    return x+'px '+y+'px';
  }
  return null;
}

module.exports = {
  TOPLEFT: TOPLEFT,
  TOP: TOP,
  TOPRIGHT: TOPRIGHT,
  LEFT: LEFT,
  RIGHT: RIGHT,
  BOTTOMLEFT: BOTTOMLEFT,
  BOTTOM: BOTTOM,
  BOTTOMRIGHT: BOTTOMRIGHT,
  updatePosition: updatePosition,
  updateOrigin: updateOrigin,
  updateOriginFromCoordinates: updateOriginFromCoordinates,
}
