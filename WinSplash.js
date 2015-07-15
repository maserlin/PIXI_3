/**
 * I am confused as to why this object can't position itself using either
 * its own width & height or that of its background png, both of which report "1"
 * and the whole thing draws all over the place.
 * Obviously to do with containers inside containers in some way. :-(
 */
function WinSplash(position)
{
    PIXI.Container.call(this);
    this.position = position; 

    this.bg = new PIXI.Sprite(PIXI.Texture.fromImage("im/bonus_outro.png"));
    this.bg.anchor.x = this.bg.anchor.y = 0.5;
    this.addChild(this.bg);
    
    // Settings
    this.animateIn = true;
    this.visible = false;
    this.winShown = 0;
    
    // Overall animation limits
    this.alpha = 0.9;
    this.scaleX = 0.9;
    
    // Bindings
    this.show = this.show.bind(this);
    this.showNextWin = this.showNextWin.bind(this);
    this.hide = this.hide.bind(this);
    this.animate = this.animate.bind(this);

    this.stop = this.stop.bind(this);
    Events.Dispatcher.addEventListener("SPIN", this.stop);
};
WinSplash.prototype = Object.create(PIXI.Container.prototype);
WinSplash.prototype.constructor = WinSplash;
WinSplash.prototype.scaleX = 0.9;
WinSplash.prototype.bg = null;
WinSplash.prototype.text = null;
WinSplash.prototype.timeout = null;
WinSplash.prototype.animateIn = true;
WinSplash.prototype.winShown = 0;


/*
 * Animate in 
 */
WinSplash.prototype.show = function(winObj){
    this.winObj = winObj;
    this.winShown = 0;

    this.showNextWin();
};

/*
 * Animate in 
 */
WinSplash.prototype.showTotal = function(winObj){
    this.winObj = winObj;
    totWin = 0;
    for(var win in this.winObj.winAmount)totWin += this.winObj.winAmount[win];
    totWin /= 100;
    totWin = totWin.toFixed(2);
    
    
    // Fools showNextWin into thinking we're all done (which we are, in fact)
    this.winShown = this.winObj.lines.length;

    var msg = "GBP " + totWin + " from " + this.winObj.lines.length;
    var lineMsg = this.winObj.lines.length == 1 ? " line." : " lines.";
    msg += lineMsg;
    this.text = new PIXI.Text(msg, {font : '48px Arial', fill : 0xff1010, align : 'center'} );    
 
    this.text.anchor.x = 0.5; 
    this.text.anchor.y = 0.5;
    this.text.position.x = this.bg.position.x;
    this.text.position.y = 50;
 
    this.addChild(this.text);

 
    this.visible = true;
    this.scale.x = this.scale.y = 0;

    this.animateIn = true;

    // Add self to animation timer
    globalTicker.add(this.animate);
};

/*
 * Do next
 */
WinSplash.prototype.showNextWin = function(){

    if(this.winShown < this.winObj.lines.length)
    {
        var msg = "GBP " + this.winObj.winAmount[this.winShown] + " on line " + (this.winObj.lines[this.winShown]+1);
        this.text = new PIXI.Text(msg,{font : '48px Arial', fill : 0xff1010, align : 'center'});    
     
        this.text.anchor.x = 0.5; 
        this.text.anchor.y = 0.5;
        this.text.position.x = this.bg.position.x;
        this.text.position.y = 50;
     
        this.addChild(this.text);

     
        this.visible = true;
        this.scale.x = this.scale.y = 0;

        this.animateIn = true;

        // Add self to animation timer
        globalTicker.add(this.animate);

        ++this.winShown;
    }
    else
    {
        Events.Dispatcher.dispatchEvent(new Event("WIN_SPLASH_COMPLETE"));  
    }
};

/*
 * Animate out
 */
WinSplash.prototype.hide = function(){
    this.animateIn = false;
    globalTicker.add(this.animate);
};

/*
 * SPIN pressed: clear immediately and don't come back :) 
 */
WinSplash.prototype.stop = function(){
    clearTimeout(this.timeout);
    globalTicker.remove(this.animate);
    this.removeChild(this.text);
    this.visible = false;
};

/**
 * Change the scale of ourselves (the container) 
 */
WinSplash.prototype.animate = function(){
    
    if(this.animateIn)
    {
        if(this.scale.x < this.scaleX)this.scale.x += 0.1;
        if(this.scale.y < this.scaleX)this.scale.y += 0.1;
    
        if(this.scale.x >= this.scaleX)
        {
            globalTicker.remove(this.animate);
          
            this.scale.x = this.scale.y = this.scaleX;
            this.timeout = setTimeout(this.hide, 1500);
        }
    }
    else
    {
        if(this.scale.x > 0)this.scale.x -= 0.1;
        if(this.scale.y > 0)this.scale.y -= 0.1;
        
        if(this.scale.x <= 0)
        {
            globalTicker.remove(this.animate);

            this.scale.x = this.scale.y = 0;
            this.removeChild(this.text);
            this.visible = false;
            this.timeout = setTimeout(this.showNextWin, 500);
        }
    }
};


