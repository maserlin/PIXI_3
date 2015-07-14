/**
 * Set up some basics for getting the game loading 
 * TODO show a splash screen with progress
 */
var game = null;

/**
 * trace to console.log: easy to turn all off
 * use trace instead of console.log in game code
 */
var trace = console.log.bind(console);

/*
 * Approx size of a game background; 
 * overwritten when the real background loads.
 */
var gameWidth = 1136;
var gameHeight = 640;

/** Create a new instance of a pixi stage
  * stage = new Stage(0x000000,true);  
  * (Deprecated in V3: just delare a Container and bung everything in it)
  * TODO also make one for a console?
  */
var stage = new PIXI.Container();

// Get the current size of the window
var size = getWindowBounds();

// Create a renderer instance to fit window.
var renderer = PIXI.autoDetectRenderer(size.x, size.y);

// Add the renderer view element to the DOM
document.body.appendChild(renderer.view);

/**
 * Window loaded: 
 * Make game Loader and listen for ASSETS_LOADED
 * Start rendering.
 */ 
document.addEventListener("DOMContentLoaded", function init(){
  
  var gameLoader = new GameLoader();
  Events.Dispatcher.addEventListener("ASSETS_LOADED", onAssetsLoaded);
  gameLoader.loadAssets(onAssetsLoaded);

  // Start rendering
  requestAnimationFrame( animate );

});

/**
 * Global animation ticker: starts by default when a movie clip
 * e.g. our spin button is declared.
 * We can attach and remove bound functions to it at will
 * to put ourselves "in the loop" for animating reels, winlines, win splashes etc. 
 */
var globalTicker = PIXI.ticker.shared;

/**
 * Create a new Game, tell it the assets have loaded.
 * Get the game dimensions from the background sheet.
 * Start resizing. 
 */
function onAssetsLoaded(){
    game = new Game();
    game.onAssetsLoaded();
    
    gameWidth = game.gameBackground.getBounds().width;
    gameHeight = game.gameBackground.getBounds().height;
    
    window.addEventListener('resize', onWindowResize);
    onWindowResize();
};


/**
 * Main render loop
 */ 
function animate() {
    requestAnimationFrame( animate );
    renderer.render(stage);
};

/**
 * Handle window resizing 
 */ 
function onWindowResize(resizeEvent){
    var size = getWindowBounds();

    // Resize the renderer
    renderer.resize(size.x,size.y);
    
    // Calculate scale based on background dimensions (gameWidth, gameHeight)
    var scale = getWindowScale();
    
    // Dispatch a RESIZE event: any interested object can listen and take action.
    var data = Object.create(null);
    data.size = size;
    data.scale = scale;
    Events.Dispatcher.dispatchEvent( new Event("RESIZE",data));
};

/**
 * UTILS: Get scale of window
 */ 
function getWindowScale(){
    var size = getWindowBounds();
    return new Point(size.x/gameWidth, size.y/gameHeight);    
}

/**
 * UTILS: Get area of window
 */ 
function getWindowBounds(){ 
 var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return new Point(x,y);
};

/**
 * UTILS: Create Point class
 */ 
function Point(x, y){
  this.x = x;
  this.y = y;
};

/**
 * UTILS: Create Rectangle class
 */ 
function Rectangle(x,y,w,h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
};

/**
 * UTILS: Array randomiser
 */ 
function shuffleArray(array) {
    
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    
    return array;
};

/**
 *  UTILS: return a valid DOM document 
 */
function createDoc(xmlData)
{
    var xmlDoc; 
 
    // Parse server XML
    if (window.DOMParser)
    {
        parser=new DOMParser();
        xmlDoc=parser.parseFromString(xmlData, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.loadXML(xmlData);
    } 
    return xmlDoc;
};
