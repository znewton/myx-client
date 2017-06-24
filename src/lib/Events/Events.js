let oneTimeEvents = {};

function addEndEventListener(element, event, _callback, timeout) {
  let endTimer;
  element.addEventListener(event, function(evt) {
    clearTimeout(endTimer);
    endTimer = setTimeout(function() {
      _callback(evt);
    }, timeout);
  });
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
  addOneTimeEvent,
  removeOneTimeEvent,
};
