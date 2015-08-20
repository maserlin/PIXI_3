function GameBackground(imageUrls){
    PIXI.Container.call(this);
    
    this.backgrounds = [];
    this.backgrounds[GameBackground.REELS_BG] = new PIXI.Sprite(PIXI.Texture.fromImage(imageUrls[0]));
    this.backgrounds[GameBackground.BONUS_BG] = new PIXI.Sprite(PIXI.Texture.fromImage(imageUrls[1]));
    
    // Center image
    for(var bgImage in this.backgrounds){
        this.backgrounds[bgImage].anchor = new Point(0.5, 0.5);
    }

    // Initial positioning
    var size = getWindowBounds();
    
    // Show main bg image
    this.addChild(this.backgrounds[GameBackground.REELS_BG]);
    
    // Define bounds
    this.getBounds = this.getBounds.bind(this);
    this.bounds = new Rectangle(this.backgrounds[GameBackground.REELS_BG].position.x, this.backgrounds[GameBackground.REELS_BG].position.y, this.backgrounds[GameBackground.REELS_BG].width, this.backgrounds[GameBackground.REELS_BG].height);
    
    // Set resizing
    this.resize = this.resize.bind(this);
    Events.Dispatcher.addEventListener(Event.RESIZE, this.resize);

    this.change = this.change.bind(this);
    this.swap = this.swap.bind(this);
}
GameBackground.prototype = Object.create(PIXI.Container.prototype);
GameBackground.prototype.constructor = GameBackground;
GameBackground.REELS_BG = "reels_bg";
GameBackground.BONUS_BG = "bonus_bg";
GameBackground.prototype.backgrounds = null;


/**
 * 
 * @param {Object} event: "RESIZE", event.data.size (Point), event.data.scale (Point)
 */
GameBackground.prototype.resize = function(event){
    var size = getWindowBounds()
    this.position.x = event.data.size.x/2;
    this.position.y = event.data.size.y/2;
}

GameBackground.prototype.change = function(from, to){
    this.from = from;
    this.to = to;
    this.backgrounds[this.to].alpha  = 0;
    this.addChild(this.backgrounds[this.to]);
    globalTicker.add(this.swap);
}

GameBackground.prototype.swap = function(){
    this.backgrounds[this.from].alpha -= 0.025;
    this.backgrounds[this.to].alpha += 0.025;
    
    if(this.backgrounds[this.to].alpha >= 1){
        this.backgrounds[this.from].alpha = 0;
        this.backgrounds[this.to].alpha = 1;
        this.removeChild(this.backgrounds[this.from]);
        globalTicker.remove(this.swap);
    }
}

GameBackground.prototype.getBounds = function(){
    return this.bounds;
}
