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
    this.button = new PIXI.extras.MovieClip(spinButtonTextures);
    this.button.position.x = posX || 100;
    this.button.position.y = posY || 100;
    this.button.anchor.x = this.button.anchor.y = 0.5;
    this.button.animationSpeed = .2;
    this.button.loop = false;
    this.button.gotoAndPlay(0);
    this.button.interactive = true;
    
    // Fix scope
    this.clicked = false;
    this.buttonClick = this.buttonClick.bind(this);
    
    var that = this;
    this.button.click = function(data){
        that.buttonClick();
    }
    this.button.tap = function(data){
        that.buttonClick();
    }

    this.onAllReelsStopped = this.onAllReelsStopped.bind(this);
    Events.Dispatcher.addEventListener("ALL_REELS_STOPPED",this.onAllReelsStopped);
    this.onAllReelsSpinning = this.onAllReelsSpinning.bind(this);
    Events.Dispatcher.addEventListener("ALL_REELS_SPINNING",this.onAllReelsSpinning);
};
SpinButton.prototype.name = null;

    SpinButton.IDLE = 0;
    SpinButton.SPIN = 1;
    SpinButton.STOP = 2;



SpinButton.prototype.setVisible = function(vis){
    this.button.visible = vis;
} 

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
        this.button.gotoAndPlay(0);
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

