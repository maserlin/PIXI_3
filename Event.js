function Event(type, data){
	this.type = type; // String name
	this.data = data; // wahtevs
}

Event.prototype.type = null;
Event.prototype.data = null;
Event.prototype.stopPropagation = false;
Event.prototype.target = null;
	
