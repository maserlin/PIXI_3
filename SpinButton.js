function SpinButton(imageName,posX,posY,name){
    this.actions = [];
    this.state = SpinButton.IDLE;
    this.name = name || "spinButton";
    
    var spinButtonTextures = [];
    for(var i=0; i<62; i+=2)
    {
        var texture = PIXI.Texture.fromFrame(imageName + (i+1) + ".png");
        spinButtonTextures.push(texture);
    }
    this.spinButton = new AnimatedSymbol(spinButtonTextures, 5);
    this.spinButton.position.x = posX || 100;
    this.spinButton.position.y = posY || 100;
    this.spinButton.anchor.x = this.spinButton.anchor.y = 0.5;
    this.spinButton.animationSpeed = 0.2;
    this.spinButton.loop = false;
    this.spinButton.gotoAndPlay(0);
    this.spinButton.interactive = true;
    
    // Fix scope
    this.clicked = false;
    this.buttonClick = this.buttonClick.bind(this);
    
    var that = this;
    this.spinButton.click = function(data){
        that.buttonClick();
    }
    this.spinButton.tap = function(data){
        that.buttonClick();
    }

    stage.addChild(this.spinButton);

    this.onAllReelsStopped = this.onAllReelsStopped.bind(this);
    Events.Dispatcher.addEventListener("ALL_REELS_STOPPED",this.onAllReelsStopped);
    this.onAllReelsSpinning = this.onAllReelsSpinning.bind(this);
    Events.Dispatcher.addEventListener("ALL_REELS_SPINNING",this.onAllReelsSpinning);
};
SpinButton.prototype.name = null;

    SpinButton.IDLE = 0;
    SpinButton.SPIN = 1;
    SpinButton.STOP = 2;

/**
 * Try to deal with some Droid double-tap issue
 */
SpinButton.prototype.onAllReelsSpinning = function(){
    this.clicked = false;
}

/**
 * Clicks may fire twice on certain android devices
 * but only once on iPad or desktop or other Androids. 
 */
SpinButton.prototype.buttonClick = function(){
        this.spinButton.gotoAndPlay(0);
    if(!this.clicked){
        this.clicked = true;
        this.performStateAction();
    }
    else{
        this.clicked = false;
    }
}


SpinButton.prototype.onAllReelsStopped = function(event){
    this.state = SpinButton.IDLE;
    this.clicked = false;
}

/**
 * Perform action and move to next state
 */
SpinButton.prototype.performStateAction = function(state){
    
    if(state != null)this.state = state;
    else{
        switch(this.state){
            case SpinButton.IDLE:
                this.state = SpinButton.SPIN;
                // Listened to by Game to provide timings
                Events.Dispatcher.dispatchEvent(new Event("SPIN",this));
                break;
            case SpinButton.SPIN:
                this.state = SpinButton.STOP;
                // Listened to by Game to provide timings and stopPositions
                Events.Dispatcher.dispatchEvent(new Event("STOP",this));
                break;
            case SpinButton.STOP:
                break;
        }
    }
}

SpinButton.prototype.setState = function(state){
    this.state = state;
};

