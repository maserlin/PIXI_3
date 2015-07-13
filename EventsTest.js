var Events;
(function (Events) {
    var Dispatcher = (function () {
        function Dispatcher() {
        }
        Dispatcher.addEventListener = function (eventType, handler) {
            if (!this._handlers[eventType]) {
                this._handlers[eventType] = [];
            }

            if (this._handlers[eventType].indexOf(handler) == -1) {
                this._handlers[eventType].push(handler);
            } else {
                console.log('[EventDispatcher::addEventListener] |WARN| This handler :' + handler.name + ' has already been mapped to ', eventType);
            }
        };

        Dispatcher.removeEventListener = function (eventType, handler) {
            var eventHandlers = this._handlers[eventType];
            if (eventHandlers) {
                delete this._handlers[eventType];
            } else {
                console.log('[EventDispatcher::removeEventListener] |WARN| No handlers have been set for event type: ', eventType);
            }
        };

        Dispatcher.dispatchEvent = function (event) {
            var eventHandlers = this._handlers[event.type];
            if (eventHandlers) {
                eventHandlers.forEach(function (handler) {
                    handler(event);
                });
            }
        };

        Dispatcher.getListenerCount = function (eventType) {
            var listenerCount = 0;
            var eventHandlers = this._handlers[eventType];
            if (eventHandlers) {
                listenerCount = eventHandlers.length;
            }
            return listenerCount;
        };

        Dispatcher.removeAll = function () {
            var key;
            for (key in this._handlers) {
                this._handlers[key] = null;
            }
        };
        Dispatcher._handlers = [];
        return Dispatcher;
    })();
    Events.Dispatcher = Dispatcher;
})(Events || (Events = {}));