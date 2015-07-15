/**
 * Co-ordinates display of wins between winlines and symbols 
 */
function WinAnimator(winCalculator, winlines, winSplash){
    this.winCalculator = winCalculator;
    this.winlines = winlines;
    this.winSplash = winSplash;
    
    this.onWinSummaryComplete = this.onWinSummaryComplete.bind(this);
    Events.Dispatcher.addEventListener("WIN_SUMMARY_COMPLETE", this.onWinSummaryComplete);

    this.onWinLinesComplete = this.onWinLinesComplete.bind(this);
    Events.Dispatcher.addEventListener("WIN_LINES_COMPLETE", this.onWinLinesComplete);

    this.onWinSplashComplete = this.onWinSplashComplete.bind(this);
    Events.Dispatcher.addEventListener("WIN_SPLASH_COMPLETE", this.onWinSplashComplete);
}
WinAnimator.prototype.winData = null;
WinAnimator.prototype.winCalculator = null;
WinAnimator.prototype.winlines = null;
WinAnimator.prototype.winSplash = null;


WinAnimator.prototype.start = function(winData){
    this.winData = winData;
    this.winlines.showLineSummary(this.winData);
}

/**
 * TODO bring control of showing "next" in here so we can sync with symbol animations 
 * @param {Object} event
 */
WinAnimator.prototype.onWinSummaryComplete = function(event){
    this.winlines.show(this.winData);
};

WinAnimator.prototype.onWinLinesComplete = function(event){
        this.winSplash.showTotal(this.winData);
};

WinAnimator.prototype.onWinSplashComplete = function(event){
    Events.Dispatcher.dispatchEvent(new Event("WIN_DISPLAY_COMPLETE"));  
}

