console.log("GameManager.js loaded");

function GameManager(){
    this.gameBackground = null;
    this.game = null;
    this.console = null;

    this.bunny = null;
    this.spinButton = null;
    this.rect = null;
    this.reelset = null;

    
    this.dataParser = new DataParser();
    var server = "http:\\\\10.32.10.24:8090\\PIXI";
    this.serverProxy = new ServerProxy(server, this.dataParser);
    
    this.onBetEvent = this.onBetEvent.bind(this);
    Events.Dispatcher.addEventListener(Event.BET, this.onBetEvent);
    
    this.onGameComplete = this.onGameComplete.bind(this);

    // Maintain 3 layers: background, game, console    
    this.layers = [];
    this.layers[GameManager.BACKGROUND] = new DisplayContainer(GameManager.BACKGROUND);
    this.layers[GameManager.GAME] = new DisplayContainer(GameManager.GAME);
    this.layers[GameManager.CONSOLE] = new DisplayContainer(GameManager.CONSOLE);

    for(var c in this.layers){    
        stage.addChild(this.layers[c]);
    }
}

GameManager.BACKGROUND = "Background";
GameManager.GAME = "Game";
GameManager.CONSOLE = "Console";
  
/**
 * 
 */
GameManager.prototype.onBetEvent = function(event){
    this.serverProxy.makeRequest(event.data);    
}  
  
/**
 * TODO proper config  
 */
var reels_0 = [ [7,5,3,2,0,1,3,0,2,4,5,6,7,0,4,1,0,2,3,1,8,2,4,1,0,3,2,1,0,4,6,5,1],
                [1,4,5,1,6,5,0,2,1,0,3,4,0,2,3,7,6,1,4,0,3,1,2,6,7,2,1,0,4,1,0,0,3],
                [6,1,7,5,3,0,4,1,6,5,0,1,2,0,3,2,1,3,8,2,9,8,4,0,1,3,0,2,1,4,2,5,7],
                [0,3,2,4,1,0,3,2,0,4,3,0,1,0,2,3,0,7,6,5,1,6,5,7,2,1,0,4,1,0,0,2,1],
                [0,8,4,0,1,8,0,2,0,1,3,0,4,2,0,1,3,2,6,7,5,1,7,5,6,1,0,3,1,0,4,2,0] ];


GameManager.prototype.onAssetsLoaded = function(obj){
    
    // Shuffle fake reels    
    // for(var i=0;i<reels_0.length;++i){
        // reels_0[i] = shuffleArray(reels_0[i]);
    // }


    /*
     * Create a background which should be in a lower layer
     */
    this.gameBackground = new GameBackground(this.layers[GameManager.BACKGROUND], ["im/bg.jpg","im/bg2.jpg"]);
    
    /*
     * This should be a gameScreen which has a reelset OR
     * build a reelset which can be passed to main game screen and 
     * freespins game screen.
     * It should be in a mid-level container layered up with 
     * winlines and win presentation layers (containers) so that 
     * everything resizes and scales together in proportion. 
     */
    this.game = new Game(this.layers[GameManager.GAME]);
    
    
    /*
     * Console component in an upper layer. 
     */
    this.console = new Console(this.layers[GameManager.CONSOLE]);
    this.spinButton = this.console.spinButton;
    
    Events.Dispatcher.addEventListener(Event.GAME_COMPLETE, this.onGameComplete);
        

    //this.addExplosion()
};

/**
 * 
 */
GameManager.prototype.onGameComplete = function(){
    this.spinButton.setState(SpinButton.IDLE);
}





/** ****************************************************************************************************
 * Test method 
 */
GameManager.prototype.addRectangle = function(x,y,w,h){
    var gfx = new PIXI.Graphics();
    
    gfx.beginFill(0xFFFF00);
    
    // set the line style to have a width of 5 and set the color to red
    gfx.lineStyle(5, 0xFF0000);
    
    // draw a rectangle
    gfx.drawRect(x,y,w,h);
    
    stage.addChild(gfx);
    
    this.rect = gfx;
};


/** ****************************************************************************************************
 * Test method 
 */
GameManager.prototype.addExplosion = function(){
    var explosionTextures = [];    
    for (var i=0; i < 26; i++) 
    {
        var texture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i+1) + ".png");
        explosionTextures.push(texture);
    };
    var explosion = new PIXI.extras.MovieClip(explosionTextures);
    explosion.position.x = explosion.position.y = 100;
    explosion.anchor.x = explosion.anchor.y = 0.5;
//    explosion.rotation = Math.random() * Math.PI;
    explosion.gotoAndPlay(0);
    
    stage.addChild(explosion);
};


