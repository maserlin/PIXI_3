function DisplayContainer(name)
{
    PIXI.Container.call(this);
    this.name = name || "DisplayContainer";
    this.resize = this.resize.bind(this);
//    Events.Dispatcher.addEventListener("RESIZE", this.resize);
    console.log("Created DisplayContainer " + name)
}
DisplayContainer.prototype.name = null;
DisplayContainer.prototype = Object.create(PIXI.Container.prototype);
DisplayContainer.prototype.constructor = DisplayContainer;





DisplayContainer.prototype.resize = function(event){
    // console.log(this.name + " resize " + event.data.size.x + " " + event.data.size.y + "  " + event.data.scale.x + " " + event.data.scale.y);
    console.log(this.name + " resize ");// + event.data.size.x + " " + event.data.size.y + "  " + event.data.scale.x + " " + event.data.scale.y);

/*
    for(var child=0; child<this.children.length; ++child){
        var dchild = this.children[child];
        if(dchild.resize){
            console.log(dchild.name + " resize");
            dchild.resize(data);
        }
    }
*/
}
