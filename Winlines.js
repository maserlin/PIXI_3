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
    
    this.colours = [0xfe3f3f,0xfec53f,0x8c3f87,0xfe3cb0,0xd88c3f,
    0x65fe8c,0xfe8c3f,0xb23ffe,0xb0b0fe,0xb03c3c,
    0xbb3d7d,0x3f3ffe,0xfe8c8c,0x3f8b3f,0xfefe3f,
    0x3f3fb1,0xfeb3fe,0x3ffefe,0x9c7147,0x40d740];
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
    
    var gfx = new PIXI.Graphics();
    var dropShadowOffset = new Point(2,2);
    
    gfx.lineStyle(6, 0x000000, 0.4);
    gfx.blendMode = PIXI.BLEND_MODES.MULTIPLY;

    // 
    for(var s=0; s<symbolsInWin; ++s){
        console.log("ShowWinBox on symbol, line " + lineId + " " + this.winCalculator.winlines[lineId][s]);  
        var reel = s;
        var symbol = this.winCalculator.winlines[lineId][s];
        this.drawBoundingBox(gfx, reel, symbol, dropShadowOffset);
        if(s < symbolsInWin-1){
            var nextSymbol = this.winCalculator.winlines[lineId][s+1];
            this.drawLink(gfx, reel, symbol, nextSymbol, dropShadowOffset);
        }
    }
    
    gfx.lineStyle(6, this.colour);
    gfx.blendMode = PIXI.BLEND_MODES.NORMAL;
    
    for(var s=0; s<symbolsInWin; ++s){
        console.log("ShowWinBox on symbol, line " + lineId + " " + this.winCalculator.winlines[lineId][s]);  
        var reel = s;
        var symbol = this.winCalculator.winlines[lineId][s];
        this.drawBoundingBox(gfx, reel, symbol);
        if(s < symbolsInWin-1){
            var nextSymbol = this.winCalculator.winlines[lineId][s+1];
            this.drawLink(gfx, reel, symbol, nextSymbol);
        }
    }

    this.addChild(gfx);
    
    var that = this;
    setTimeout(function(){
        that.removeChildren();
        setTimeout(that.showNext,500);
    },1500);
}

Winlines.prototype.drawLink = function(gfx,reel,symbol,nextSymbol,dropShadowOffset){
    
    var xoff = dropShadowOffset == null ? 0 : dropShadowOffset.x;
    var yoff = dropShadowOffset == null ? 0 : dropShadowOffset.y;
    
    var w = this.symbolData[0][0].width;
    var h = this.symbolData[0][0].height;
    
    if(symbol == nextSymbol){
        gfx.moveTo(this.symbolData[reel][symbol].x + w + xoff, this.symbolData[0][symbol].y+(h/2) + yoff);
        gfx.lineTo(this.symbolData[reel+1][nextSymbol].x + xoff, this.symbolData[reel+1][nextSymbol].y+(h/2) + yoff)       
    }
    else if(symbol < nextSymbol){
        if(nextSymbol-symbol == 1){
            gfx.moveTo(this.symbolData[reel][symbol].x + w + xoff, this.symbolData[0][symbol].y+h + yoff);
            gfx.lineTo(this.symbolData[reel+1][nextSymbol].x + xoff, this.symbolData[reel+1][nextSymbol].y + yoff)       
        }
        else{
            gfx.moveTo(this.symbolData[reel][symbol].x + (w*0.75) + xoff, this.symbolData[0][symbol].y+h + yoff);
            gfx.lineTo(this.symbolData[reel+1][nextSymbol].x + (w*0.25) + xoff, this.symbolData[reel+1][nextSymbol].y + yoff)       
        }
    }
    else{
        if(symbol-nextSymbol == 1){
            gfx.moveTo(this.symbolData[reel][symbol].x + w + xoff, this.symbolData[0][symbol].y + yoff);
            gfx.lineTo(this.symbolData[reel+1][nextSymbol].x + xoff, this.symbolData[reel+1][nextSymbol].y+h + yoff)       
        }
        else{
            gfx.moveTo(this.symbolData[reel][symbol].x + (w*0.75) + xoff, this.symbolData[0][symbol].y + yoff);
            gfx.lineTo(this.symbolData[reel+1][nextSymbol].x + xoff + (w*0.25), this.symbolData[reel+1][nextSymbol].y+h + yoff)       
        }
    }
}



/**
 * 
 * @param {Object} reel
 * @param {Object} symbol
 */
Winlines.prototype.drawBoundingBox = function(gfx, reel, symbol,dropShadowOffset){
    console.log("Draw bounding box " + reel + "," + symbol);

    var xoff = dropShadowOffset == null ? 0 : dropShadowOffset.x;
    var yoff = dropShadowOffset == null ? 0 : dropShadowOffset.y;
    

    // draw a rectangle
    gfx.drawRoundedRect( this.symbolData[reel][symbol].x+xoff, this.symbolData[reel][symbol].y+yoff,
                  this.symbolData[reel][symbol].width+xoff, this.symbolData[reel][symbol].height+yoff, 3);
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

    for(var s in symbols){
        gfx.lineTo(this.symbolData[s][symbols[s]].x + w, this.symbolData[s][symbols[s]].y + h)       
    }
    
    this.addChild(gfx);
}
