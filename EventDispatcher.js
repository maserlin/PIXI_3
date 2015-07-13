/**
 * @author Haseeb.Riaz
 */
com.events.EventDispatcher = ( function(){
	
	var Queue = com.data.Queue;
	var Event = com.events.Event;
	
	function EventDispatcher(){
	
		this._listeners = {};
	}
	
	EventDispatcher.prototype._listeners = null;
	
	EventDispatcher.prototype.addEventListener = function(type, listener){
		
		if (!type || typeof type !== "string") throw new Error(type + "is not a valid event type.");
		if (!listener || typeof listener !== "function" ) throw new Error(listener + "is not a valid listener");

		var listeners = this._listeners[type] || new Queue();
		if(listeners.has(listener)){
			return; //if listener already exists no need to do anything.
		}
		
		listeners.add(listener);
		this._listeners[type] = listeners;
	};
	
	EventDispatcher.prototype.removeEventListener = function(type, listener){
		
		if (!type || typeof type !== "string") throw new Error("invalid type " + type);
		if (!listener || typeof listener !== "function" ) throw new Error(listener + "is not a valid listener");

		var listeners = this._listeners[type];
		if(listeners) listeners.remove(listener);
	};
	
	EventDispatcher.prototype.hasEventListener = function(type, listener){
		
		var listeners = this._listeners[type];
		
		if(!listeners) return false;
		if(!listener) return true;
		return listeners.has(listener);
	};
	
	EventDispatcher.prototype.dispatchEvent = function(event){
		
		if(!event || ! (event instanceof Event)) throw new Error("Invalid Event " + event + ", event should be a sub class of com.events.Event");
		
		var listeners = this._listeners[event.type];
		if(!listeners ) return;
		
		event.target = this;
		var iterator = listeners.getIterator();
		while(iterator.hasNext()){
			
			iterator.next()(event);
			if(event.stopPropagation == true) break;
		}
	};
	
	EventDispatcher.prototype.removeAllListeners = function() {
		
		var listeners = this._listeners;
		this._listeners = null;
		
		for(var type in listeners){
			
			var currentListeners = listeners[type];
			listeners[type] = null;
			
			var length = currentListeners.length;
			for(var i = 0; i < length; i++){
				
				currentListeners[i] = null;
			}
		}
	};
	
	return EventDispatcher;
})();