console.log("Winlines.js loaded")
function Winlines(winCalculator){
    PIXI.Container.call(this);
    
    this.winCalculator = winCalculator;

    this.showWin = this.showWin.bind(this);
    // this.showWin(5,5);
}
Winlines.prototype = Object.create(PIXI.Container.prototype);
Winlines.constructor = Winlines;

Winlines.prototype.showWin = function(lineId,symbolsInWin){

    for(var s=0; s<this.winCalculator.winlines[lineId].length; ++s){
        console.log("ShowWinBox on symbol, line " + lineId + " " + this.winCalculator.winlines[lineId][s]);  
        this.drawBoundingBox(s, this.winCalculator.winlines[lineId][s]);
    }

    this.container.addChild(this.winlineContainer);
}


Winlines.prototype.drawBoundingBox = function(reel, symbol){
    var gfx = new PIXI.Graphics();
    
//    gfx.beginFill(0xFFFF00);
    
    // set the line style to have a width of 5 and set the color to red
    gfx.lineStyle(4, 0xFF0000);
    
    // draw a rectangle
    gfx.drawRect(0,0,140,140);
    
    //    
    this.container.addChild(gfx);
}
