function Reelset(reels){
    PIXI.Container.call(this);
    
    // Reel Background    
    var reelBg = new PIXI.Sprite(PIXI.Texture.fromImage("im/reelbg.png"));
    reelBg.position.x = 16;
    reelBg.position.y = 164;
    this.addChild(reelBg);
    
    // Reels
    this.reels = [];
    for(var reel in reels)
    {
        this.reels.push(new Reel(reel, reels[reel]));
    }
    for(reel in this.reels){
        this.addChild(this.reels[reel]);
    }

    this.pivot.x = this.width/2;
    this.pivot.y = this.height/2;
    this.position.x = getWindowBounds().x/2;
    this.position.y = getWindowBounds().y/2;

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

    this.resize = this.resize.bind(this);
    Events.Dispatcher.addEventListener("RESIZE", this.resize);
}
Reelset.prototype = Object.create(PIXI.Container.prototype);
Reelset.prototype.contructor = Reelset;

Reelset.prototype.onReelSpinning = function(event){
    if(event.data == 4)
    {
        Events.Dispatcher.dispatchEvent(new Event("ALL_REELS_SPINNING"));
    }
}

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

Reelset.prototype.getReelMap = function(){
    return this.reelMap;
}

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
 * "this" is the Container which is being called, not Reelset 
 * @param {Object} data
 */
Reelset.prototype.resize = function(event){
    var data = event.data;
    // Scale both by X to maintain aspect ratio
    this.scale.x = data.scale.x;
    this.scale.y = data.scale.x;
    // Reposition to center
    this.position.x = data.size.x/2;
    this.position.y = data.size.y/2;
}
