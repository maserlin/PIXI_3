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
    this.gotoAndStop(this.id);
    console.log("Symbol set to " + this.id);
}

SpinSymbol.prototype = Object.create(PIXI.extras.MovieClip.prototype);
SpinSymbol.prototype.constructor = SpinSymbol;
SpinSymbol.prototype.blur = false;

/**
 * COULD use ".texture = nnn" and not use movie clip 
 * @param {Object} id
 * @param {Object} blur
 */
SpinSymbol.prototype.setId = function(id, blur){
    blur = blur || false;
    
    if(this.id != id || this.blur != blur)
    {
        this.blur = blur;
        this.id = id;
        if(this.blur)this.gotoAndStop(this.id+this.blurOffset);
        else this.gotoAndStop(this.id);
    }
}

