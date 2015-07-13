function Reel(reel, reelband){
    
    PIXI.Container.call(this);

    this.reelband = reelband;
    this.newReelband = reelband;
    this.index = 0;
    this.id = reel;
    this.cueStop = false;
    
    this.liftSpeed = 4;
    this.bounceSpeed = 4;
    this.bounceDistance = 0.3;
    this.speed = 60;
    this.blur = false;
    
    this.setSymbols = 0;

    console.log("Created Reel id " + this.id + " symbols " + this.reelband);
    console.log("Symbols in view: " + this.symbolsInView());
    
    var ids = this.symbolsOnReel();
    console.log(this.id + " " + ids)
    this.position.x = (reel*162) + (reel*2);
    this.position.y = 0;
    this.symbols = [];
    
    for(var i=0; i<5; ++i){
        var s = new SpinSymbol(ids[i]);
        s.position.x = 0;
        s.position.y = i * 140;
        this.addChild(s);
        this.symbols.push(s);
        //console.log("s at " + s.position.y)
    }
    this.frameTop = this.symbols[1].position.y;
    
    this.animate = this.animate.bind(this);
}

Reel.prototype = Object.create(PIXI.Container.prototype);
Reel.prototype.constructor = Reel;

Reel.IDLE = 0;
Reel.STARTING = 1;
Reel.SPINNING = 2;
Reel.SETTING = 3;
Reel.STOPPING = 4;
Reel.BOUNCING = 5;
Reel.prototype.state = Reel.IDLE;

/**
 * SPIN called externally to start reel 
 */
Reel.prototype.spin = function(){
    //console.log("Reel " + this.id + " spin.")
    if(this.state == Reel.IDLE){
        //console.log("STARTING");
        this.cueStop = false;
        this.blur = false;
        this.setSymbols = 0;
        this.state = Reel.STARTING;
        globalTicker.add(this.animate);
    }

}

/**
 * STOP called externally to stop reel at stopPos 
 */
Reel.prototype.stop = function(stopPos, newReelband){
    //console.log("Reel " + this.id + " stop at " + stopPos);
    this.stopPos = stopPos;
    this.newReelband = newReelband || this.reelband;
    
    /*
     * Set the reel and stop it in SPINNING mode
     * Does nothing until reel is SPINNING
     */
    this.cueStop = true;
}

/**
 * Animation loop: Run via global timer for now:
 * TODO run aniamtion loop externally to this class 
 */
Reel.prototype.animate = function(time){

    switch(this.state)
    {
        case Reel.IDLE:
            break;

        case Reel.STARTING:
            this.lift();
            break;

        case Reel.SPINNING:
            this.spinReel();
            if(this.cueStop){
                this.state = Reel.SETTING;
            }
            break;

        case Reel.SETTING:
            this.setReel();
            break;
 
        case Reel.STOPPING:
            this.stopReel();
            break;    

        case Reel.BOUNCING:
            this.bounceReel();
            break;    
    }
}


/**
 * Animation loop: set the new symbols to come in  
 */
Reel.prototype.bounceReel = function(){
    for(var s in this.symbols){
        this.symbols[s].position.y -= this.bounceSpeed;
    }
    
    if(this.symbols[0].position.y <=0){
        for(var s in this.symbols){
            this.symbols[s].position.y = s * 140;
        }
        this.state = Reel.IDLE;
        //console.log("IDLE " + this.symbolsInView())
        Events.Dispatcher.dispatchEvent(new Event("REEL_STOPPED", this.id));
        
        globalTicker.remove(this.animate);
    }
}



/**
 * Animation loop: set the new symbols to come in  
 */
Reel.prototype.setReel = function(){
    // Move reel as normal
    for(var s in this.symbols){
        this.symbols[s].position.y += this.speed;
    }
    
    // If resetting, change symbols but start to feed in new ones    
    if(this.symbols[0].position.y >= this.frameTop){
        var offset = this.symbols[0].position.y;
        this.index = this.getWrappedIndex(this.index+1);
        var ids = this.symbolsOnReel();
        
        for(var s in this.symbols){
            this.symbols[s].position.y -= offset;
            this.symbols[s].setId(ids[s],this.blur);
        }
        
        /*
         * Set new symbols. each time in set more to the new ones, from the top of the reels
         * down, so that as the old symbols pass off the bottom of the screen they will have been
         * replaced by new ones. Eac iteration increases the number of old symbols to replace
         * by incrementing this.setSymbols;
         * Then replace that many from the top (symbol[0]) with ones from the new reelband.
         * Start with the symbol at stopPos-2, then -2 and -1, etc, until all 5 are from the 
         * new reelband, at which point we can stop the reels, stopPos will be on the center
         * of the reels on winline 0.
         */
        ++this.setSymbols;


/* not ready yet
        switch(this.setSymbols){
            default:
                for(var s=this.setSymbols-1; s>=0; --s){
                    if(this.reelId == 0)console.log("Set symbol " + s + " to " + (s-2))
                    this.symbols[s].setId(this.newReelband[this.getWrappedIndex(this.stopPos + (s-2))],this.blur);
                }
                break;
            case 5:
                for(var s=this.setSymbols-1; s>=0; --s){
                    this.symbols[s].setId(this.newReelband[this.getWrappedIndex(this.stopPos + (s-2))],this.blur);
                }
                this.state = Reel.STOPPING;
                break;
        }
return        
*/

        switch(this.setSymbols){
            case 1:
            this.symbols[0].setId(this.newReelband[this.getWrappedIndex(this.stopPos-2)],this.blur);
            break;
            case 2:
            this.symbols[0].setId(this.newReelband[this.getWrappedIndex(this.stopPos-1)],this.blur);
            this.symbols[1].setId(this.newReelband[this.getWrappedIndex(this.stopPos-2)],this.blur);
            break;
            case 3:
            this.symbols[0].setId(this.newReelband[this.getWrappedIndex(this.stopPos)],this.blur);
            this.symbols[1].setId(this.newReelband[this.getWrappedIndex(this.stopPos-1)],this.blur);
            this.symbols[2].setId(this.newReelband[this.getWrappedIndex(this.stopPos-2)],this.blur);
            break;
            case 4:
            this.symbols[0].setId(this.newReelband[this.getWrappedIndex(this.stopPos+1)],this.blur);
            this.symbols[1].setId(this.newReelband[this.getWrappedIndex(this.stopPos)],this.blur);
            this.symbols[2].setId(this.newReelband[this.getWrappedIndex(this.stopPos-1)],this.blur);
            this.symbols[3].setId(this.newReelband[this.getWrappedIndex(this.stopPos-2)],this.blur);
            break;
            case 5:
            this.symbols[0].setId(this.newReelband[this.getWrappedIndex(this.stopPos+2)],this.blur);
            this.symbols[1].setId(this.newReelband[this.getWrappedIndex(this.stopPos+1)],this.blur);
            this.symbols[2].setId(this.newReelband[this.getWrappedIndex(this.stopPos)],this.blur);
            this.symbols[3].setId(this.newReelband[this.getWrappedIndex(this.stopPos-1)],this.blur);
            this.symbols[4].setId(this.newReelband[this.getWrappedIndex(this.stopPos-2)],this.blur);
            this.state = Reel.STOPPING;
            break;
        }
    }
}

/**
 * TODO send event when stopped and stop ticker externally from this class 
 */
Reel.prototype.stopReel = function(){
    for(var s in this.symbols){
        this.symbols[s].position.y += this.speed;
    }

    if(this.symbols[0].position.y >= this.frameTop * this.bounceDistance){

        if(this.blur)this.blur = false;
        var offset = this.symbols[0].position.y;
        this.index = this.getWrappedIndex(this.stopPos);
        this.reelband = this.newReelband;
        var ids = this.symbolsOnReel();
        for(var s in this.symbols){
            this.symbols[s].setId(ids[s],this.blur);
        }

        this.state = Reel.BOUNCING;
        //console.log("STOP " + this.symbolsInView())
    }
    
}


/**
 * Animation loop: Normal spinning from indexPos to indexPos 
 */
Reel.prototype.spinReel = function(){
    for(var s in this.symbols){
        this.symbols[s].position.y += this.speed;
    }
    
    if(this.symbols[0].position.y >= this.frameTop){
        var offset = this.symbols[0].position.y;
        this.index = this.getWrappedIndex(this.index+1);
        var ids = this.symbolsOnReel();
        for(var s in this.symbols){
            this.symbols[s].position.y -= offset;
            this.symbols[s].setId(ids[s],this.blur);
        }
        if(!this.blur)this.blur = true;
    }
}

/**
 * Animation loop: Lifting reel to start
 * TODO interpolated positions 
 */
Reel.prototype.lift = function(){
    for(var s in this.symbols){
        this.symbols[s].position.y -= this.liftSpeed;
    }
    if(this.symbols[1].position.y < this.frameTop/3*2){
        this.state = Reel.SPINNING;
        Events.Dispatcher.dispatchEvent(new Event("REEL_SPINNING",this.id));
    }
}

/**
 * Symbols showing on reel 
 */
Reel.prototype.symbolAt = function(index, reelband){
    var pos = (index + reelband.length) % reelband.length;
    return reelband[pos];
}

/**
 * Symbols showing on reel 
 */
Reel.prototype.symbolsInView = function(){
    var symbols = [];

    symbols.push(this.reelband[this.getWrappedIndex(this.index+1)]);
    symbols.push(this.reelband[this.getWrappedIndex(this.index)]);
    symbols.push(this.reelband[this.getWrappedIndex(this.index-1)]);
    
    return symbols;
}

/**
 * All 5 symbols on reel 
 */
Reel.prototype.symbolsOnReel = function(){
    var symbols = [];

    symbols.push(this.reelband[this.getWrappedIndex(this.index+2)]);
    symbols = symbols.concat(this.symbolsInView());
    symbols.push(this.reelband[this.getWrappedIndex(this.index-2)]);
    
    return symbols;
}

/**
 * Returns index wrapped to length of reel 
 */
Reel.prototype.getWrappedIndex = function(newIndex){
    return (newIndex + this.reelband.length) % this.reelband.length;
}
