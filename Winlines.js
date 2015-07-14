console.log("Winlines.js loaded")
function Winlines(winCalculator){
    PIXI.Container.call(this);
    
    // Add and remove this from the stage as required
    // this.winlineContainer = new PIXI.Container();
    
    // Data about winlines etc
    this.winCalculator = winCalculator;

    // Data about symbol sizes and positions?
    this.symbolData = Reelset.symbolData;

    this.show = this.show.bind(this);
    this.showNext = this.showNext.bind(this);
    this.showWin = this.showWin.bind(this);
        
    // LineId, numOfSymbols    
    // this.showWin(5,5);
    
    this.onSpin = this.onSpin.bind(this);
    Events.Dispatcher.addEventListener("SPIN", this.onSpin);
    
    this.colours = ["0xfe3f3f","0xfec53f","0x8c3f87","0xfe3cb0","0xd88c3f",
    "0x65fe8c","0xfe8c3f","0xb23ffe","0xb0b0fe","0xb03c3c",
    "0xbb3d7d","0x3f3ffe","0xfe8c8c","0x3f8b3f","0xfefe3f",
    "0x3f3fb1","0xfeb3fe","0x3ffefe","0x9c7147","0x40d740"];
}
Winlines.prototype = Object.create(PIXI.Container.prototype);
Winlines.constructor = Winlines;
Winlines.prototype.symbolData = null;
Winlines.prototype.colours = null;
Winlines.prototype.colour = null;


Winlines.prototype.onSpin = function(event){
    this.removeChildren();
}


Winlines.prototype.show = function(wins){
    this.wins = wins;
    this.winShown = 0;
    this.showNext();
}

Winlines.prototype.showNext = function(){
    
    this.removeChildren();
    
    if(this.winShown < this.wins.lines.length){
        this.showWin(this.wins.lines[this.winShown],this.wins.winline[this.winShown].length);
        ++this.winShown;
    }    
    else{
        Events.Dispatcher.dispatchEvent(new Event("WIN_LINES_COMPLETE"));
    }
}

/**
 * 
 */
Winlines.prototype.showWin = function(lineId, symbolsInWin){
    
    // Get fresh data in case of resizing
    this.symbolData = Reelset.symbolData;
    
    // Set winline colour
    this.colour = this.colours[lineId];
    
    //
    this.drawLine(lineId);

    // 
    for(var s=0; s<symbolsInWin; ++s){
        console.log("ShowWinBox on symbol, line " + lineId + " " + this.winCalculator.winlines[lineId][s]);  
        this.drawBoundingBox(s, this.winCalculator.winlines[lineId][s]);
    }
    
    var that = this;
    
    setTimeout(function(){
        that.removeChildren();
        setTimeout(that.showNext,500);
    },1500);
    
    // Show
    // this.addChild(this.winlineContainer);
}



Winlines.prototype.drawLine = function(lineId){
    var gfx = new PIXI.Graphics();
    gfx.lineStyle(6, this.colour);
    var symbols = [];
    for(var s in this.winCalculator.winlines[lineId]){
        symbols.push(this.winCalculator.winlines[lineId][s]);
    }
    
    var w = this.symbolData[0][0].width/2;
    var h = this.symbolData[0][0].height/2;
    
    gfx.moveTo(this.symbolData[0][symbols[0]].x-36, this.symbolData[0][symbols[0]].y+h);
//    gfx.lineTo(this.symbolData[4][symbols[4]].x+(w*2)+36, this.symbolData[s][symbols[s]].y+h)       

    for(var s in symbols){
        gfx.lineTo(this.symbolData[s][symbols[s]].x+(w), this.symbolData[s][symbols[s]].y+h)       
    }
    
    this.addChild(gfx);
}

/**
 * 
 * @param {Object} reel
 * @param {Object} symbol
 */
Winlines.prototype.drawBoundingBox = function(reel, symbol){
    console.log("Draw bounding box " + reel + "," + symbol);
    
    
    var gfx = new PIXI.Graphics();
    
    // gfx.beginFill(0xFFFFFF);
    
    // set the line style to have a width of 5 and set the color to red
    gfx.lineStyle(6, this.colour);
    
    // draw a rectangle
    gfx.drawRect( this.symbolData[reel][symbol].x, this.symbolData[reel][symbol].y,
                  this.symbolData[reel][symbol].width, this.symbolData[reel][symbol].height);
    
    //    
    this.addChild(gfx);
}
