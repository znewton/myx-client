let oneTimeEvents = {};
let endEvents = {};

function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

function addEndEventListener(element, event, _callback, timeout, name) {
  let endTimer;
  let handler = (evt) => {
    clearTimeout(endTimer);
    endTimer = setTimeout(function() {
      handler(evt);
    }, timeout);
  }
  element.addEventListener(event, handler);
  endEvents[name] = { element: element, event: event, handler: handler };
}

function removeEndEventListener(name) {
  if (!endEvents[name]) return;
  let element = endEvents[name].element;
  let event = endEvents[name].event;
  let handler = endEvents[name].handler;
  element.removeEventListener(event, handler);
  delete endEvents[name];
}

function addOneTimeEvent(element, event, _callback, name) {
  let handler = () => {
      _callback();
      element.removeEventListener(event, handler);
  }
  element.addEventListener(event, handler);
  oneTimeEvents[name] = { element: element, event: event, handler: handler };
}

function removeOneTimeEvent(name) {
  if (!oneTimeEvents[name]) return;
  let element = oneTimeEvents[name].element;
  let event = oneTimeEvents[name].event;
  let handler = oneTimeEvents[name].handler;
  element.removeEventListener(event, handler);
  delete oneTimeEvents[name];
}

module.exports = {
  addEndEventListener,
  removeEndEventListener,
  addOneTimeEvent,
  removeOneTimeEvent,
  debounce,
};
