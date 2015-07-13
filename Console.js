console.log("Console.js loaded");
function Console(container)
{
    this.container = container;
    this.spinButton = new SpinButton("Icon05_");    
    this.resize = this.resize.bind(this);
    this.container.resize = this.resize;
}
Console.prototype.container = null;
Console.prototype.spinButton = null;


















Console.prototype.resize = function( data ){
    //console.log("Console resize")
}
