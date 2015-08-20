function BonusScreen(winCalculator)
{
    PIXI.Container.call(this);
    this.winCalculator = winCalculator;
    this.results = winCalculator.getBonusWins();
    console.log("Bonus got results",this.results);
    
    this.alpha = 0;    
    this.total = 0;
    
    // Split the screen into a 7x5 grid for explosion positions.
    // remove one each time a position is chosen to prevent overlap.
    this.screenGrid = [];
    var size = getWindowBounds();// 1227, 789
    for(var sx=0; sx<7; ++sx){
        for(var sy=0; sy<5; ++sy){
            var p = new Point(0,0);
            p.x = (size.x/7 * (sx+1))-size.x/14;
            p.y = (size.y/5 * (sy+1))-size.y/10;
            this.screenGrid.push(p);
        }
    }

    for(var r=0; r<this.results.length; ++r){
        this.addExplosion(r);
        this.total += this.results[r];
    }
    
    this.start = this.start.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    this.addExplosion = this.addExplosion.bind(this);
    this.onClick = this.onClick.bind(this);
    this.showWin = this.showWin.bind(this);
    
}
BonusScreen.prototype = Object.create(PIXI.Container.prototype);
BonusScreen.constructor = BonusScreen;
BonusScreen.prototype.alpha = null;
BonusScreen.prototype.total = null;
BonusScreen.prototype.screenGrid = null;
BonusScreen.prototype.results = null;
BonusScreen.prototype.winCalculator = null;



BonusScreen.prototype.start = function(){
    console.log("Bonus screen START");
}


BonusScreen.prototype.cleanUp = function(){
    this.removeChildren();
}



BonusScreen.prototype.showWin = function(position){
    var win = this.results.pop();
    win /= 100;
    win = win.toFixed(2);

    var msg = "GBP " + win;
    var text = new PIXI.Text(msg, {font : 'bold 36px Arial', fill : 0xff1010, align : 'center', dropShadow:true,dropShadowDistance:3});    
    text.position = position;
    text.anchor.x = text.anchor.y = 0.5;
    this.addChild(text);
    
    // All shown
    var that = this;
    if(this.results.length == 0){
        setTimeout(function(){
            that.removeChildren();
            var size = getWindowBounds();
            
            var msg = "BONUS: YOU WIN";
            var text = new PIXI.Text(msg, {font : 'bold 48px Arial', fill : 0xff1010, align : 'center', dropShadow:true,dropShadowDistance:3});    
            text.position = new Point(size.x/2,(size.y/2)-26);
            text.anchor.x = text.anchor.y = 0.5;
            text.dropShadow = true;
            that.addChild(text);

            var win = that.total;
            win /= 100;
            win = win.toFixed(2);
            msg = "GBP " + win;
            text = new PIXI.Text(msg, {font : 'bold 48px Arial', fill : 0xff1010, align : 'center', dropShadow:true,dropShadowDistance:3});    
            text.position = new Point(size.x/2,(size.y/2)+26);
            text.anchor.x = text.anchor.y = 0.5;
            text.dropShadow = true;
            that.addChild(text);

            that.onComplete();
        },1000);
    }
}

BonusScreen.prototype.onComplete = function(){
    setTimeout(function(){
        Events.Dispatcher.dispatchEvent(new Event(Event.BONUS_COMPLETE));
    },3000);
}


BonusScreen.prototype.onClick = function(explosion){
    console.log("Bonus screen CLICK",explosion);
    explosion.loop = false;
    var that = this;
    explosion.onComplete = function(){
        that.showWin(explosion.position);
        that.removeChild(explosion);
    }
}


BonusScreen.prototype.addExplosion = function(id){
    console.log("Explosion");
    
    var explosionTextures = [];    
    
    for (var i=0; i < 26; i++) 
    {
        var texture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i+1) + ".png");
        explosionTextures.push(texture);
    };
    
    var explosion = new PIXI.extras.MovieClip(explosionTextures);
    
    var rand = Math.floor(Math.random() * this.screenGrid.length);
    var point = this.screenGrid.splice(rand, 1);
    console.log("explosion at ", point[0].x, point[0].y)

/*
    var x = Math.random() * size.x;
    var y = Math.random() * size.y;

    if(x<80)x+=150;
    if(x>size.x-80)x-=150;

    if(y<50)y+=120;
    if(y>size.y-50)y-=120;
*/

    explosion.position.x = point[0].x;
    explosion.position.y = point[0].y;
    explosion.anchor.x = explosion.anchor.y = 0.5;
    explosion.rotation = Math.random() * Math.PI;
    explosion.visible = false;
    setTimeout(function(){
        explosion.visible = true;
        explosion.gotoAndPlay(0);
    },Math.random()*1500);
    
    explosion.animationSpeed = .8;
    explosion.interactive = true;
    explosion.id = id;
    
    var that = this;
    explosion.click = function(data){
        that.onClick(explosion);
    }
    explosion.tap = function(data){
        that.onClick(explosion);
    }

    
    
    this.addChild(explosion);
};
