function GameBackground(imageUrls){
    PIXI.Container.call(this);
    
    this.backgrounds = [];
    this.backgrounds[GameBackground.REELS_BG] = new PIXI.Sprite(PIXI.Texture.fromImage(imageUrls[0]));
    this.backgrounds[GameBackground.BONUS_BG] = new PIXI.Sprite(PIXI.Texture.fromImage(imageUrls[1]));
    
    // Center image
    for(var bgImage in this.backgrounds){
        this.backgrounds[bgImage].anchor.x = this.backgrounds[bgImage].anchor.y = 0.5;
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
    Events.Dispatcher.addEventListener("RESIZE", this.resize);
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



GameBackground.prototype.getBounds = function(){
    return this.bounds;
}
