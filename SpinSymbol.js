/**
 * TODO Anchor all symbol at their CENTER to the reel 
 */
function SpinSymbol(id){
    this.blur = false;
    
    var iconTextures = [];

    for(var i=0; i<12; ++i)
    {
        var texture;
        if(i<10) texture = PIXI.Texture.fromFrame("Icon_0" + i + ".png");
        else texture = PIXI.Texture.fromFrame("Icon_" + i + ".png");
        iconTextures.push(texture);
    }
    this.blurOffset = i;

    for(var i=0; i<12; ++i)
    {
        var texture;
        if(i<10) texture = PIXI.Texture.fromFrame("Blur_Icon_0" + i + ".png");
        else texture = PIXI.Texture.fromFrame("Blur_Icon_" + i + ".png");
        iconTextures.push(texture);
    }

    PIXI.extras.MovieClip.call(this, iconTextures);

    this.id = id;
    this.isRoyal = this.id > 4 ? false : true;
    this.gotoAndStop(this.id);
    // console.log("Symbol set to " + this.id);
    this.revolve = this.revolve.bind(this);
}

SpinSymbol.prototype = Object.create(PIXI.extras.MovieClip.prototype);
SpinSymbol.prototype.constructor = SpinSymbol;
SpinSymbol.prototype.blur = false;
SpinSymbol.prototype.isRoyal = true;
SpinSymbol.prototype.bp = null;


SpinSymbol.prototype.animate = function(container){
    // --
}

SpinSymbol.prototype.revolve = function(){
    this.rotation += 0.01;
}

/**
 * COULD use ".texture = nnn" and not use movie clip 
 * @param {Object} id
 * @param {Object} blur
 */
SpinSymbol.prototype.setId = function(id, blur){
    blur = blur || false;
    
    if(this.id != id || this.blur != blur)
    {

        // Previously was a bonus symbol but we're changing it
/*
        if(this.id == WinCalculator.BONUS){
            globalTicker.remove(this.revolve);
            this.rotation = 0;    
            this.anchor = new Point(0,0);
        }
*/
        this.blur = blur;
        this.id = id;
        if(this.blur)this.gotoAndStop(this.id+this.blurOffset);
        else this.gotoAndStop(this.id);
        this.isRoyal = this.id > 4 ? false : true;
        

        // Changed to a bonus symbol
/*
        if(this.id == WinCalculator.BONUS){
            this.anchor = new Point(0.5,0.5);
            globalTicker.add(this.revolve);    
        }
*/
    }
}

