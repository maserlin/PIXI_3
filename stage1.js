// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x66FF99);

function Point(x, y){
  this.x = x;
  this.y = y;
}

function getWindowBounds(){ 
 var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return new Point(x,y);
}

//alert(x + ' × ' + y);

// create a renderer instance.
var b = getWindowBounds();
var renderer = PIXI.autoDetectRenderer(b.x, b.y);


// add the renderer view element to the DOM
document.body.appendChild(renderer.view);
 
	// create a texture from an image path
	var texture = PIXI.Texture.fromImage("im/bunny.png");
	// create a new Sprite using the texture
	var bunny = new PIXI.Sprite(PIXI.Texture.fromImage("im/bunny.png"));
	var bg = new PIXI.Sprite(PIXI.Texture.fromImage("im/bg.jpg"));
	
	
	// center the sprites anchor point
	bunny.anchor.x = 0.5;
	bunny.anchor.y = 0.5;
	
	// move the sprite t the center of the screen
	bunny.position.x = b.x/2;
	bunny.position.y = b.y/2;
	
	stage.addChild(bg);
	stage.addChild(bunny);


requestAnimFrame( animate );
 
function animate() {
 
  requestAnimFrame( animate );

	    // just for fun, lets rotate mr rabbit a little
	    bunny.rotation += 0.1;
		
	    // render the stage   
	    renderer.render(stage);
}

window.addEventListener('resize', resizer);

function resizer(event){
  var size = getWindowBounds();
  renderer.resize(size.x,size.y);
	var baseWidth = bg.width;
	var baseHeight = bg.height;

  var xscale = size.x / baseWidth;
  var yscale = size.y / baseHeight;


  
  for(var child=0; child<stage.children.length; ++child){
    stage.children[child].scale.x = xscale;
    stage.children[child].scale.y = yscale;
  } 
  
	bunny.position.x = size.x/2;
	bunny.position.y = size.y/2;

  
  
};