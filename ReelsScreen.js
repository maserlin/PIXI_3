function ReelsScreen(reels_0)
{
    PIXI.Container.call(this);

    // non-visual component
    this.winCalculator = new WinCalculator();

    // Reelset is a container which builds up the reels components in order:
    // ReelBg, Reels x5, a mask for clipping the top and bottom, and reelFg overlay   
    this.reelset = new Reelset(reels_0);
    this.addChild(this.reelset);

    this.winlines = new Winlines(this.winCalculator);
    this.addChild(this.winlines);

    // Tell it where to draw relative to us
    this.winSplash = new WinSplash(new Point(this.width/2,this.height/2));
    this.addChild(this.winSplash);

    // Center ourselves onscreen
    this.pivot.x = this.width/2;
    this.pivot.y = this.height/2;
    this.position.x = getWindowBounds().x/2;
    this.position.y = getWindowBounds().y/2;

    this.onReelsSpinning = this.onReelsSpinning.bind(this);
    Events.Dispatcher.addEventListener("ALL_REELS_SPINNING",this.onReelsSpinning);

    this.onReelsStopped = this.onReelsStopped.bind(this);
    Events.Dispatcher.addEventListener("ALL_REELS_STOPPED",this.onReelsStopped);

    this.spinReels = this.spinReels.bind(this);
    this.stopReels = this.stopReels.bind(this);

    this.resize = this.resize.bind(this);
    Events.Dispatcher.addEventListener("RESIZE", this.resize);
    
    this.onWinLinesComplete = this.onWinLinesComplete.bind(this);
    Events.Dispatcher.addEventListener("WIN_LINES_COMPLETE", this.onWinLinesComplete);
}
ReelsScreen.prototype = Object.create(PIXI.Container.prototype);
ReelsScreen.constructor = ReelsScreen;
ReelsScreen.prototype.reelset = null;
ReelsScreen.prototype.winlines = null;
ReelsScreen.prototype.winSplash = null;
ReelsScreen.prototype.winCalculator = null;
ReelsScreen.scaleDown = 1;//0.85;


/**
 * Resize and scale the entire reels screen to suit the game's requirements.
 * NOTE this is the only size/scale code for the entire reels screen and all its components. 
 */
ReelsScreen.prototype.resize = function(event){
    var data = event.data;
    
    // Scale both by X to maintain aspect ratio
    this.scale.x = data.scale.x * ReelsScreen.scaleDown;
    this.scale.y = data.scale.x * ReelsScreen.scaleDown;
    
    // Reposition to center
    this.position.x = (data.size.x/2);
    this.position.y = data.size.y/2;
    
    // Reset all positioning data for win display components
    this.reelset.setSymbolData();
}

/**
 * 
 * @param {Object} timing: array of start time offsets
 */
ReelsScreen.prototype.spinReels = function(timing){
    this.reelset.spinReels(timing);
};

/**
 * 
 * @param {Object} timing : array of stop time offsets
 * @param {Object} stopPos : array of stop positions
 */
ReelsScreen.prototype.stopReels = function(timing, stopPos){
    this.reelset.stopReels(timing, stopPos);
};

/**
 * When all reels are spinning, stop them.
 * TODO Wait for actual result 
 */
ReelsScreen.prototype.onReelsSpinning = function(){
        Events.Dispatcher.dispatchEvent(new Event("STOP"));
};

/**
 * When all stopped show win summary, win highlights, etc etc 
 */
ReelsScreen.prototype.onReelsStopped = function(){
    var wins = this.winCalculator.calculate(this.reelset.getReelMap());
    this.winlines.show(wins);
};

ReelsScreen.prototype.onWinLinesComplete = function(){
Events.Dispatcher.dispatchEvent(new Event("WIN_SPLASH_COMPLETE")); 
//    this.winSplash.show(wins);
};
