console.log("Console.js loaded");
function Console()
{
    PIXI.Container.call(this);
    this.spinButton = new SpinButton("Icon05_");
    this.cheatButton = new SpinButton("Icon06_",0,300,"cheat");
    
    this.addChild(this.spinButton.button);
    this.addChild(this.cheatButton.button);
        
    this.enable = this.enable.bind(this);
    
    this.disable = this.disable.bind(this);
    Events.Dispatcher.addEventListener(Event.SPIN,this.disable);

    this.resize = this.resize.bind(this);
    Events.Dispatcher.addEventListener(Event.RESIZE, this.resize);
}
Console.prototype = Object.create(PIXI.Container.prototype);
Console.constructor = Console;
Console.prototype.spinButton = null;
Console.scaleDown = 0.85;


Console.prototype.enable = function(){
    this.spinButton.setVisible(true);
    this.cheatButton.setVisible(true);
}
Console.prototype.disable = function(){
    this.spinButton.setVisible(false);
    this.cheatButton.setVisible(false);
}


Console.prototype.resize = function(event){
    var data = event.data;
    
    // Scale both by X to maintain aspect ratio
    this.scale.x = data.scale.x * Console.scaleDown;
    this.scale.y = data.scale.x * Console.scaleDown;
    
}

















