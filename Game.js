/**
 * GAME manages all onscreen components individually or in groups. 
 * Onscreen components are all derived from PIXI.Container so they can be put on the stage
 * and removed as necessary in their logical groups, and can resize as a group, be zoomed in and out
 * or cross-faded etc etc.
 */
function Game(){
    this.gameBackground = null;
    this.bunny = null;
    this.spinButton = null;
    this.rect = null;
    this.reelset = null;

    this.dataParser = new DataParser();
    var server = "http:\\\\10.32.10.24:8090\\PIXI";
    this.serverProxy = new ServerProxy(server, this.dataParser);

    this.layers = [];
    this.layers[Game.BACKGROUND] = new PIXI.Container();
    this.layers[Game.MAIN] = new PIXI.Container();
    this.layers[Game.CONSOLE] = new PIXI.Container();
}
Game.BACKGROUND = "background";
Game.MAIN = "main";
Game.CONSOLE = "console";
Game.prototype.layers = null;
Game.prototype.reelsScreen = null;
Game.prototype.reelset = null;
Game.prototype.winSplash = null;
Game.prototype.winLines = null;
Game.prototype.bonusScreen = null;

  
/**
 * TODO proper config  
 */
var reels_0 = [ [7,5,3,2,0,1,3,0,2,4,5,6,7,0,4,1,0,2,3,1,8,2,4,1,0,3,2,1,0,4,6,5,1],
                [1,4,5,1,6,5,0,2,1,0,3,4,0,2,3,7,6,1,4,0,3,1,2,6,7,2,1,0,4,1,0,0,3],
                [6,1,7,5,3,0,4,1,6,5,0,1,2,0,3,2,1,3,8,2,9,8,4,0,1,3,0,2,1,4,2,5,7],
                [0,3,2,4,1,0,3,2,0,4,3,0,1,0,2,3,0,7,6,5,1,6,5,7,2,1,0,4,1,0,0,2,1],
                [0,8,4,0,1,8,0,2,0,1,3,0,4,2,0,1,3,2,6,7,5,1,7,5,6,1,0,3,1,0,4,2,0] ];

//Shuffle fake reels    
/*
for(var i=0;i<reels_0.length;++i){
    reels_0[i] = shuffleArray(reels_0[i]);
}
*/

/**
 * Build everything.
 * We are maintaining three distinct layers:  
 * Game.BACKGROUND:
 *      contains a container with any number of swappable backgrounds in the control of GameBackground.js
 *      driven from here depending on game results, by event management
 * 
 * Game.MAIN:
 *      This layer contains one of ReelsScreen, BonusScreen, Bonus2Screen etc: we manage which is showing
 *      based on game result combined with events sent by the current occupier of the layer. 
 * 
 * Game.CONSOLE:
 *      TODO this will house the UI components.
 */
Game.prototype.onAssetsLoaded = function(obj){
    
    // These layers remain undisturbed: 
    // We can add and remove children from them as the game plays out.
    stage.addChild(this.layers[Game.BACKGROUND]);    
    // MAIN layer mounts the ReelsScreen, BonusScreen, InterScreen/s etc
    stage.addChild(this.layers[Game.MAIN]);
    // For all UI components
    stage.addChild(this.layers[Game.CONSOLE]);

    // non-visual component
    this.winCalculator = new WinCalculator();

    // Create a background manager with a couple of images to play with.
    this.gameBackground = new GameBackground(["im/bg.jpg","im/bg2.jpg"]);

    // gameBackground should be able to do its own cross-fades etc because it *is*
    // a PIXI.Container: we can manage it as a single item. 
    this.layers[Game.BACKGROUND].addChild(this.gameBackground);

    // Reelset is a container which builds up the reels components in order:
    // ReelBg, Reels x5, a mask for clipping the top and bottom, and reelFg overlay   
    this.reelset = new Reelset(reels_0);

    // WinSplash This is basically the win display layer: splash, winlines etc.
    // Underneath it the reelset can swap in animating symbols etc (event driven).
    // TODO What about if symbols have to pop out over the winlines?? May need a third layer to the 
    // reelsScreen, but there may be issues with positioning!

    // this.reelsScreen layers up the reelset and win display overlays and adds them as a single 
    // component to the main display container
    // TODO resizing for all reelsScreen components
    // TODO winlines must be in register with the symbols!
    this.reelsScreen = new ReelsScreen();
    this.reelsScreen.addChild(this.reelset);
    this.winlines = new Winlines();
    this.reelsScreen.addChild(this.winlines);
    this.winSplash = new WinSplash();
    this.reelsScreen.addChild(this.winSplash);

    // Right now we want to show the ReelsScreen
    this.layers[Game.MAIN].addChild(this.reelsScreen);    
    
    
    
    
    /*
     * TODO This should be a whole console component in an upper layer. 
     */
    this.spinButton = new SpinButton("Icon05_");
    this.cheatButton = new SpinButton("Icon05_",500,100,"cheat");

    // Everything built; bind listeners and their methods        
    this.onSpinReels = this.onSpinReels.bind(this);
    this.onStopReels = this.onStopReels.bind(this);
    Events.Dispatcher.addEventListener("SPIN",this.onSpinReels);
    Events.Dispatcher.addEventListener("STOP",this.onStopReels);
    
    this.onReelsSpinning = this.onReelsSpinning.bind(this);
    Events.Dispatcher.addEventListener("ALL_REELS_SPINNING",this.onReelsSpinning);

    this.onReelsStopped = this.onReelsStopped.bind(this);
    Events.Dispatcher.addEventListener("ALL_REELS_STOPPED",this.onReelsStopped);

    this.onWinSplashComplete = this.onWinSplashComplete.bind(this);
    Events.Dispatcher.addEventListener("WIN_SPLASH_COMPLETE",this.onWinSplashComplete);    

    //this.addExplosion()
};

Game.prototype.onReelsSpinning = function(){
        Events.Dispatcher.dispatchEvent(new Event("STOP"));
};

Game.prototype.onReelsStopped = function(){
    var wins = this.winCalculator.calculate(this.reelset.getReelMap());
    this.winSplash.show(wins);
};

Game.prototype.onWinSplashComplete = function(){
    console.log("Wins complete");   
    this.spinButton.setState(SpinButton.IDLE);
};


Game.prototype.onSpinReels = function(event){
    console.log("call spin");
    this.cheat = null;
    if(event.data.name == "cheat"){
        console.log("Cheat button");
        this.cheat = [0,0,0,0,0];
    }
    
    
    var req = Object.create(null);
    req.code = "BET";
    req.stake = 200;
    req.winlines = 20;
    this.serverProxy.makeRequest(req);
    
    this.reelset.spinReels([0,200,400,600,800]);
    
};

Game.prototype.onStopReels = function(){
    var rands = [];
    for(var r=0; r<5; ++r){
        rand = Math.floor(Math.random() * reels_0[r].length);
        rands.push(rand);
    }
    if(this.cheat != null)rands = this.cheat;
    console.log("call stop pos " + rands);
    //rands = [8,31,26,4,6];
    this.reelset.stopReels([0,200,400,600,800],rands);
};





/** *****************************************************************************************
 * Test method 
 */
Game.prototype.createGameAssets = function(){
    //this.createBunny();
    
    // create a background + quick and dirty resize
    this.gameBackground = new PIXI.Sprite(PIXI.Texture.fromImage("im/bg.jpg"));
    var that = this;
    this.gameBackground.resize = function(xscale,yscale){
        var size = getWindowBounds()
        that.bg.position.x = size.x/2;
        that.bg.position.y = size.y/2;
    }
    // center the sprites anchor point
    this.gameBackground.anchor.x = 0.5;
    this.gameBackground.anchor.y = 0.5;
    // stage should be global?
    stage.addChild(this.gameBackground);

    // List assets and get them loaded
    var assets = ["im/spinButton.json","im/explosion.json","im/BlursNStills.json"];
    var loader = PIXI.loader;
    loader.add(assets);
    loader.once('complete',this.onAssetsLoaded);
    loader.load();
};


/** ****************************************************************************************************
 * Test method 
 */
Game.prototype.createBunny = function(){
    // create a texture from an image path
    //var texture = PIXI.Texture.fromImage("im/bunny.png");
    
    // create a new Sprite using the texture
    this.bunny = new PIXI.Sprite(PIXI.Texture.fromImage("im/bunny.png"));
    this.bunny.anchor.x = 0.5;
    this.bunny.anchor.y = 0.5;
    stage.addChild(this.bunny);
};


/** ****************************************************************************************************
 * Test method 
 */
Game.prototype.addRectangle = function(x,y,w,h){
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
Game.prototype.addExplosion = function(){
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


