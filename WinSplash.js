function WinSplash(winObj){
    PIXI.Container.call(this);
    this.container = this;//new PIXI.Container();
    this.bg = new PIXI.Sprite(PIXI.Texture.fromImage("im/bonus_outro.png"));
    this.bg.anchor.x = this.bg.anchor.y = 0.5;
    this.container.addChild(this.bg);
    this.text;
    
    this.show = this.show.bind(this);
    this.animate = this.animate.bind(this);
    this.showNextWin = this.showNextWin.bind(this);
    this.hide = this.hide.bind(this);
    
    this.winShown = 0;
    this.animate = this.animate.bind(this);
    
    this.animateIn = true;
    
    this.container.alpha = 0.9;
    this.container.scaleX = 1;
    this.container.visible = false;
    this.container.resize = this.resize;
    
    this.timeout;
    this.stop = this.stop.bind(this);
    Events.Dispatcher.addEventListener("SPIN", this.stop);
}
WinSplash.prototype = Object.create(PIXI.Container.prototype);
WinSplash.prototype.constructor = WinSplash;

/**
 * "this" == this.container 
 */
WinSplash.prototype.resize = function(data){
    this.scale.x = this.scale.y = data.scale.x;
    this.scaleX = data.scale.x;
};

// Animate in
WinSplash.prototype.show = function(winObj){
    this.winObj = winObj;
    this.winShown = 0;

    this.showNextWin();
}

// Animate out
WinSplash.prototype.hide = function(){
    this.animateIn = false;
    globalTicker.add(this.animate);
}

// SPIN pressed: clear immediately and don't come back :)
WinSplash.prototype.stop = function(){
    clearTimeout(this.timeout);
    globalTicker.remove(this.animate);
    this.container.removeChild(this.text);
    this.visible = false;
}

WinSplash.prototype.animate = function(){
    
    if(this.animateIn)
    {
        if(this.container.scale.x < this.container.scaleX)this.container.scale.x += 0.1;
        if(this.container.scale.y < this.container.scaleX)this.container.scale.y += 0.1;
    
        if(this.container.scale.x >= this.container.scaleX)
        {
            globalTicker.remove(this.animate);
          
            this.container.scale.x = this.container.scale.y = this.container.scaleX;
            this.timeout = setTimeout(this.hide, 1500);
        }
    }
    else
    {
        if(this.container.scale.x > 0)this.container.scale.x -= 0.1;
        if(this.container.scale.y > 0)this.container.scale.y -= 0.1;
        
        if(this.container.scale.x <= 0)
        {
            globalTicker.remove(this.animate);

            this.container.scale.x = this.container.scale.y = 0;
            this.container.removeChild(this.text);
            this.container.visible = false;
            this.timeout = setTimeout(this.showNextWin, 500);
        }
    }
}

// Do next
WinSplash.prototype.showNextWin = function(){
    
    if(this.winShown < this.winObj.lines.length)
    {
        var size = getWindowBounds();
        this.container.position.x = size.x/2;
        this.container.position.y = size.y/2;
    
        var msg = "GBP " + this.winObj.winAmount[this.winShown] + " on line " + (this.winObj.lines[this.winShown]+1);
        this.text = new PIXI.Text(msg,{font : '48px Arial', fill : 0xff1010, align : 'center'});    
        this.text.anchor.x = 0.5; 
        this.text.anchor.y = 0.5;
        this.text.position.x = this.bg.position.x;
        this.text.position.y = 50;
        this.container.addChild(this.text);
        this.container.visible = true;
        this.container.scale.x = this.container.scale.y = 0;

        this.animateIn = true;

        // Add self to animation timer
        globalTicker.add(this.animate);

        ++this.winShown;
    }
    else
    {
        Events.Dispatcher.dispatchEvent(new Event("WIN_SPLASH_COMPLETE"));  
    }
    
}

