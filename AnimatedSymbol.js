
function AnimatedSymbol(id){
     SpinSymbol.call(this, id);
     
     
     this.spritesheets = ["Icons_10","Icons_10","Icons_10","Icons_10","Icons_10",
                          "Icon05_","Icon06_","Icon07_","Icon08_","Icon09_"];
     
     this.frames = [37,37,37,37,37,62,62,20,50,54];
     
     this.animate = this.animate.bind(this);
}

AnimatedSymbol.prototype = Object.create(SpinSymbol.prototype);
AnimatedSymbol.prototype.constructor = AnimatedSymbol;
AnimatedSymbol.prototype.spritesheets;
AnimatedSymbol.prototype.textureFrames;
AnimatedSymbol.prototype.movieClip;
AnimatedSymbol.prototype.frames;


AnimatedSymbol.prototype.animate = function(container){
    console.log("Symbol id",this.id," animate...");
    
    this.container = container;
    
    this.textureFrames = [];
    

    var animationSpeed = 0.2;
    
        switch(this.id)
        {
            default:
                for(var i=6; i<this.frames[this.id]; ++i)
                {
                    var texture = PIXI.Texture.fromFrame(this.spritesheets[this.id] + (i+1) + ".png");
                    this.textureFrames.push(texture);
                }
                animationSpeed = 0.5;
            break;
            case 5:
                for(var i=0; i<this.frames[this.id]; i+=2)
                {
                    var texture = PIXI.Texture.fromFrame(this.spritesheets[this.id] + (i+1) + ".png");
                    this.textureFrames.push(texture);
                }
            break;
    
            case 6:
                for(var i=0; i<this.frames[this.id]; i+=2)
                {
                    var texture = PIXI.Texture.fromFrame(this.spritesheets[this.id] + (i+1) + ".png");
                    this.textureFrames.push(texture);
                }
            break;
    
            case 7:
                for(var i=0; i<this.frames[this.id]; i+=2)
                {
                    var texture = PIXI.Texture.fromFrame(this.spritesheets[this.id] + (i+1) + ".png");
                    this.textureFrames.push(texture);
                }
            break;
    
            case 8:
                for(var i=0; i<this.frames[this.id]; i+=2)
                {
                    var texture = PIXI.Texture.fromFrame(this.spritesheets[this.id] + (i+1) + ".png");
                    this.textureFrames.push(texture);
                }
            break;
    
            case 9:
                for(var i=0; i<this.frames[this.id]; i+=2)
                {
                    var texture = PIXI.Texture.fromFrame(this.spritesheets[this.id] + (i+1) + ".png");
                    this.textureFrames.push(texture);
                }
                animationSpeed = 0.4;
            break;
        }
    
        this.movieClip = new PIXI.extras.MovieClip(this.textureFrames);
        this.container.addChild(this.movieClip);
        this.movieClip.animationSpeed = 0.2;
        this.movieClip.loop = false;
        this.movieClip.position = this.position;
        this.movieClip.play();
        this.movieClip.interactive = false;
        this.movieClip.animationSpeed = animationSpeed;
        var that = this;
        this.movieClip.onComplete = function(){
            that.container.removeChild(that.movieClip);
            Events.Dispatcher.dispatchEvent(new Event(Event.SYMBOL_ANIMATION_COMPLETE));
        }
}
