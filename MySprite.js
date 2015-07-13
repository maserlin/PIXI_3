function MySprite() {
  // --
}

MySprite.prototype = Object.create( PIXI.Sprite.prototype );
MySprite.prototype.constructor = MySprite;

MySprite.prototype.someOtherFunction = function() {};