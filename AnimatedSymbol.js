
function AnimatedSymbol(textures, id){
     PIXI.extras.MovieClip.call(this, textures);
     this.id = id;
}

AnimatedSymbol.prototype = Object.create(PIXI.extras.MovieClip.prototype);
AnimatedSymbol.prototype.constructor = AnimatedSymbol;
