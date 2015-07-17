/**
 * Co-ordinates display of wins between winlines and symbols 
 */
function WinAnimator(reelset, winCalculator, winlines, winSplash){
    this.reelset = reelset;
    this.winCalculator = winCalculator;
    this.winlines = winlines;
    this.winSplash = winSplash;
    
    this.start = this.start.bind(this);
    this.showNext = this.showNext.bind(this);

    this.onWinSummaryComplete = this.onWinSummaryComplete.bind(this);
    Events.Dispatcher.addEventListener("WIN_SUMMARY_COMPLETE", this.onWinSummaryComplete);

    this.onWinLinesComplete = this.onWinLinesComplete.bind(this);
    Events.Dispatcher.addEventListener("WIN_LINES_COMPLETE", this.onWinLinesComplete);

    this.onSymbolAnimationComplete = this.onSymbolAnimationComplete.bind(this);
    Events.Dispatcher.addEventListener("SYMBOL_ANIMATION_COMPLETE", this.onSymbolAnimationComplete);

    this.onWinSplashComplete = this.onWinSplashComplete.bind(this);
    Events.Dispatcher.addEventListener("WIN_SPLASH_COMPLETE", this.onWinSplashComplete);

    this.onSpin = this.onSpin.bind(this);
    Events.Dispatcher.addEventListener("SPIN", this.onSpin);
}
WinAnimator.prototype.winData = null;
WinAnimator.prototype.reelset = null;
WinAnimator.prototype.winCalculator = null;
WinAnimator.prototype.winlines = null;
WinAnimator.prototype.winSplash = null;
WinAnimator.prototype.timeout = null;



/**
 * 
 */
WinAnimator.prototype.onSpin = function(){
    clearTimeout(this.timeout);    
}



/**
 * 
 */
WinAnimator.prototype.start = function(winData){
    this.winData = winData;
    
    this.winlines.showLineSummary(this.winData);
    
    var that = this;
    this.timeout = setTimeout(function(){
        that.winlines.removeChildren();
        that.timeout = setTimeout(function(){
            that.onWinSummaryComplete();
        },500);
    },1500);

}

/**
 * Start the windisplay process with SUMMARY; 
 * TODO sync with sound
 */
WinAnimator.prototype.onWinSummaryComplete = function(event){
    this.winShown = 0;
    this.showNext();
}

/**
 * Manage the progress of showing winlines; 
 * TODO sync to sound/symbol animations
 */
WinAnimator.prototype.showNext = function(){
    if(this.winShown < this.winData.lines.length){
        var lineId = this.winData.lines[this.winShown];
        this.numOfSymbols = this.winData.winline[this.winShown].length;        
        console.log("Show",this.numOfSymbols,"symbols on line",lineId);
        this.winlines.showNextWin(lineId, this.numOfSymbols);
        ++this.winShown;
        
        var symbols = [];
        for(var s=0; s<this.numOfSymbols; ++s){
            symbols.push(this.winCalculator.winlines[lineId][s]);
        }
        console.log("animate symbols " + symbols)
        this.reelset.animate(symbols);
        
    }    
    else{
        this.winSplash.showTotal(this.winData);
    }
};

WinAnimator.prototype.onSymbolAnimationComplete = function(event){
    if(--this.numOfSymbols == 0){
        var that = this;
        this.timeout = setTimeout(function(){
            that.winlines.removeChildren();
            that.timeout = setTimeout(function(){
                that.showNext();
            },500);
        },250);
    
    }
}

WinAnimator.prototype.onWinLinesComplete = function(event){
        this.winSplash.showTotal(this.winData);
};

WinAnimator.prototype.onWinSplashComplete = function(event){
    Events.Dispatcher.dispatchEvent(new Event("WIN_ANIMATOR_COMPLETE"));  
}

