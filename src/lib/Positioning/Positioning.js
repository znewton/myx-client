
const TOPLEFT = 0;
const TOP = 1;
const TOPRIGHT = 2;
const LEFT = 3;
const RIGHT = 4;
const BOTTOMLEFT = 5;
const BOTTOM = 6;
const BOTTOMRIGHT = 7;

function updateOrigin(from) {
  let origin = null;
  switch (from) {
    case TOPLEFT:
      origin = 'top-left';
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
  }
  newPosition.origin = updateOrigin(from);
  return newPosition;
}

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
