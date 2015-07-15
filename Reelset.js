function Reelset(reelband){
    PIXI.Container.call(this);
    
    // Reel Background    
    var reelBg = new PIXI.Sprite(PIXI.Texture.fromImage("im/reelbg.png"));
    reelBg.position.x = 16;
    reelBg.position.y = 164;
    this.addChild(reelBg);
    console.log(reelBg.position.x,reelBg.anchor.x,reelBg.width)
    
    // Reels
    this.reels = [];
    
    // We should only get the first (default) reelband to set up with
    for(var reel in reelband)
    {
        // Send var reel as an id, and the relevant reelData 
        this.reels.push(new Reel(reel, reelband[reel]));
        // Add each reel to our display container (to us in other words)
        this.addChild(this.reels[reel]);
    }
    
    // Masking
    var thing = new PIXI.Graphics();
    thing.beginFill(0x000000,0.0);
    var start = new Point(18,170);
    var height = 426;
    var width = 826;
    thing.drawRect(start.x,start.y,width,height);
    
    // set mask
    this.addChild(thing);
    thing.isMask = true;
    this.mask = thing;
    
    // Reels Foreground
    var reelFg = new PIXI.Sprite(PIXI.Texture.fromImage("im/reelfg.png"));
    reelFg.position.x = 16;
    reelFg.position.y = 164;
    this.addChild(reelFg);

    this.spinReels = this.spinReels.bind(this);
    this.stopReels = this.stopReels.bind(this);

    this.onReelStopped = this.onReelStopped.bind(this);
    Events.Dispatcher.addEventListener("REEL_STOPPED",this.onReelStopped);

    this.onReelSpinning = this.onReelSpinning.bind(this);
    Events.Dispatcher.addEventListener("REEL_SPINNING",this.onReelSpinning);
    
    this.setSymbolData = this.setSymbolData.bind(this);
    this.setSymbolData();
}
Reelset.prototype = Object.create(PIXI.Container.prototype);
Reelset.prototype.contructor = Reelset;
Reelset.prototype.reels = null;
Reelset.prototype.symbolData = null;
Reelset.symbolData = null;


/**
 * 2D array reel x symbol bounds for winline display
 */
Reelset.prototype.setSymbolData = function(){
    Reelset.symbolData = [];
    for(var reel in this.reels){
        Reelset.symbolData.push(this.reels[reel].getPositioningData());
    }
}


/**
 * event.data == 4 means the last reel is spinning
 */
Reelset.prototype.onReelSpinning = function(event){
    if(event.data == 4)
    {
        Events.Dispatcher.dispatchEvent(new Event("ALL_REELS_SPINNING"));
    }
}

/**
 * event.data == 4 means the last reel has stopped
 */
Reelset.prototype.onReelStopped = function(event){
    if(event.data == 4)
    {
        this.reelMap = [];
        for(var reel in this.reels){
            this.reelMap.push(this.reels[reel].symbolsInView());
        }        
        Events.Dispatcher.dispatchEvent(new Event("ALL_REELS_STOPPED"));
    }
}

/**
 * Linear map of symbols in view 0-14 (top to bottom L->R)
 */
Reelset.prototype.getReelMap = function(){
    return this.reelMap;
}

/**
 * TODO use system timer?
 */
Reelset.prototype.spinReels = function(timing){
    var next = 0;
    var that = this;
    for(var t in timing){
       setTimeout(function(){
           that.reels[next].spin();
           ++next 
       },timing[t]);      
    }
}

/**
 * TODO use system timer?
 */
Reelset.prototype.stopReels = function(timing, positions){
    var that = this;
    var next = 0;
    for(var t in timing){
       setTimeout(function(){
           that.reels[next].stop(positions[next]);
           ++next 
       },timing[t]);      
    }
}


/**
 * 
 * @param {Object} symbols: array of up to 5 (by reel) 
 * giving 0, 1 or 2 of symbols in view to animate
 */
Reelset.prototype.animate = function(symbols){
    for(var s=0; s<symbols.length; ++s){
        this.reels[s].animateSymbol(symbols[s]);
    }
}


