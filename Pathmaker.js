    console.log("Animation paths loaded");
    /**
     * 
     */
    function setAnimationPath(container)
    {
        this._startPosition = new Point(100,100);
        
        this._targetPosition = new Point(800, 400);
        
        // Smoothing out the speed for distance: add 7,5,3,2 steps depending on distance
        // Based on x+ 168, 334, 507, 672 between windows
        var xdistance = Math.round(Math.abs(this._startPosition.x - this._targetPosition.x));
        this._steps = 12 + Math.round(xdistance/100);
        this._speed = 4;

        /*
         * This creates a linear easing array. Start with 0 offset along path.
         */       
        this._lambda = [0]; 
        var t = 0;
        var factor = 1/this._steps;
        for(var i=0; i<this._steps; ++i)
        {
            t += factor;
            this._lambda.push(Number(t.toPrecision(6)))
        }        
        // Add final position (end of path)
        this._lambda.push(1);

        
        var p1 = new Point();
        var p2 = new Point();
        var p3 = new Point();
        var p4 = new Point();
        var p5 = new Point();
        var p6 = new Point();
        
        // Make new Points or we get a reference which could be dangerous.
        // Blob starts near the top of the flame animation
        var startp = new Point(this._startPosition.x, this._startPosition.y-100);
        var endp = new Point(this._targetPosition.x, this._targetPosition.y);

        var xdiff = Math.floor(Math.abs(startp.x-endp.x)/4);
        var ydiff = Math.floor( startp.y-endp.y );

        // Increase "jump" if going straight up OR jumping down
        var yoff = 100;
        if(xdiff == 0 || ydiff < 0)yoff += 100;
        else if(xdiff > 160)yoff += 100;
        
        /*
         * startp.y-yoff minus an extra -100 as the blob path starts near the top of the flame not the bottom.
         * So we want to make sure the control point is well above it. 
         */
        var y1 = (startp.y-yoff-100);
        var y2 = (endp.y-yoff);
        if(y1 < -2)
        {
            y1 = -10;
        }
        //trace(y1,y2)
        if(startp.x > endp.x)
        {        
            var cp1  = new Point(startp.x-(xdiff), y1);
            var cp2 = new Point(endp.x+(xdiff), y2);
        }
        else
        {   
            var cp1  = new Point(startp.x+(xdiff), y1);
            var cp2 = new Point(endp.x-(xdiff), y2);
        }

        /* Visual path points for debug only 
            Need to add gfx stuff here not rects!
         * 
        this._bonusViewDoc = container;
        this._bonusViewDoc.removeChildren();
        this._bonusViewDoc.addChild(new Rectangle(startp.x-10,startp.y-10,20,20,"black"));
        this._bonusViewDoc.addChild(new Rectangle(endp.x-10,endp.y-10,20,20,"blue"));
        this._bonusViewDoc.addChild(new Rectangle(cp1.x-10,cp1.y-10,20,20,"red"));
        this._bonusViewDoc.addChild(new Rectangle(cp2.x-10,cp2.y-10,20,20,"green"));
         */
                
        this._path = [];
        
        for(var i=0; i<this._lambda.length; ++i)
        {
            // Between start and CP1
            p1.x = ( ( 1.0 - this._lambda[i] ) * startp.x ) + ( this._lambda[i] * cp1.x );
            p1.y = ( ( 1.0 - this._lambda[i] ) * startp.y ) + ( this._lambda[i] * cp1.y );
            
            // Between CP1 and CP2
            p2.x = ( ( 1.0 - this._lambda[i] ) * cp1.x ) + ( this._lambda[i] * cp2.x );
            p2.y = ( ( 1.0 - this._lambda[i] ) * cp1.y ) + ( this._lambda[i] * cp2.y );
            
            // Between CP2 and end
            p3.x = ( ( 1.0 - this._lambda[i] ) * cp2.x ) + ( this._lambda[i] * endp.x );
            p3.y = ( ( 1.0 - this._lambda[i] ) * cp2.y ) + ( this._lambda[i] * endp.y );
                            
            // On the line between p1 & p2 
            p4.x = ( ( 1.0 - this._lambda[i] ) * p1.x ) + ( this._lambda[i] * p2.x );
            p4.y = ( ( 1.0 - this._lambda[i] ) * p1.y ) + ( this._lambda[i] * p2.y );
                            
            // On the line between p2 & p3                
            p5.x = ( ( 1.0 - this._lambda[i] ) * p2.x ) + ( this._lambda[i] * p3.x );
            p5.y = ( ( 1.0 - this._lambda[i] ) * p2.y ) + ( this._lambda[i] * p3.y );
            
            // Point on the resulting curve
            p6.x = ( ( 1.0 - this._lambda[i] ) * p4.x ) + ( this._lambda[i] * p5.x );
            p6.y = ( ( 1.0 - this._lambda[i] ) * p4.y ) + ( this._lambda[i] * p5.y );
            
            ////trace(p6.x,p6.y)
            
            this._path.push(new Point(p6.x,p6.y))
        }               
        
        /* Visual path points for debug only 
            Need to add gfx stuff here not rects!
         * */
        for(var p=0; p<this._path.length; ++p){
          //  this._bonusViewDoc.addChild(new Rectangle(this._path[p].x-2,this._path[p].y-2,4,4,"red"))
        }
        
        //
        return this._path;
    }















function QuintBezier(){
    this.getPolynomials = this.getPolynomials.bind(this);
    this.getStdParameters = this.getStdParameters.bind(this);
}

QuintBezier.prototype.getPolynomials = function(p1, p2, p3, p4){
/*
        // Introduces scale and offset see original T. Groleau code, this is to do with driving
        // the app from a flash interface and we don't need it here.
        // http://www.timotheegroleau.com/Flash/experiments/easing_function_generator.htm
        System.out.println("scale " + scale);
        System.out.println("offset " + offset);

        float x1 = (p1 - offset) / scale;
        float x2 = (p2 - offset) / scale;
        float x3 = (p3 - offset) / scale;
        float x4 = (p4 - offset) / scale;

        return getStdParameters(0, x1, x2, x3, x4, 1);
*/
        return this.getStdParameters(0, p1, p2, p3, p4, 1);
}

QuintBezier.prototype.getStdParameters = function(c0, c1, c2, c3, c4, c5){
    var e = 5*(c1 - c0); // saves 1 *
    var d = 10*(c2 - c0) - 4*e; // saves 1*
    var c = 10*(c3 - c0) + 30*(c1 - c2); // saves 2 *
    var b = 5*(c4 + c0) - 20*(c3 + c1) + 30*c2; // saves 2 *
    var a = c5 - c0 - b - c - d - e; // saves 4 *
    
    return [e,d,c,b,a];
}

function M_ElasticOut(a, b, c, d, e){
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
}

M_ElasticOut.prototype.interpolateForward = function(t) {
    var ts = t*t;
    var tc =ts*t;
    var result = 0+1*(this.e*tc*ts + this.d*ts*ts + this.c*tc + this.b*ts + this.a*t);
    return result;
}
Bounce.easeOut = function  ( intT, intB, intC, intD )
{
    if ((intT /= intD) < (1 / 2.75))
    {
        return intC * (7.5625 * intT * intT) + intB;
    }   
    else if (intT < (2 / 2.75))
    {
        return intC * (7.5625 * (intT -= (1.5 / 2.75)) * intT + 0.75) + intB;
    }   
    else if (intT < (2.5 / 2.75))
    {
        return intC * (7.5625 * (intT -= (2.25 / 2.75)) * intT + 0.9375) + intB;
    }
    else
    {
        return intC * (7.5625 * (intT -= (2.625 / 2.75)) * intT + 0.984375) + intB;
    }
}
Bounce.easeIn = function  ( intT, intB,intC, intD )
{
    return intC - this.easeOut(intD - intT, 0, intC, intD) + intB;
}
Bounce.easeInOut = function  ( intT, intB,intC, intD )
{
    if (intT < intD/2)
    {
        return this.easeIn(intT * 2, 0, intC, intD) * 0.5 + intB;
    }
    else
    {
        return this.easeOut(intT * 2 - intD, 0, intC, intD) * 0.5 + intC * 0.5 + intB;
    }
}
Bounce.easeInOut2 = function (t, b, c, d, s )
{
    if (s == null)
        s = 1.70158; 
    
    if ((t /= d / 2) < 1)
    {
        return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    }
    
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}
    
Bounce.easeOut2 = function  ( intT, intB,intC, intD )
{
    return - intC * ( intT /= intD ) * ( intT - 2) + intB ;
}

// time, start, end, duration
Linear.easeIn = function (t, b, c, d)
{
    return c * t / d + b;
}

Linear.easeOut = function (t, b, c, d)
{
    return c * t / d + b;
}
Linear.easeInOut = function (t, b,c, d)
{
    return c * t / d + b;
}
/**
 * @author Petr Urban
 * 
 * Interpolation functions (easing)
 * - all these functions have the same parameters, therefore one can be changed for another 
 */

/**
 * Linear interpolation
 *  
 * @param {number} intDuration - total duration of animation
 * @param {number} intCurrentTime - current time (0 - intDuration)
 * @param {number} intStartValue - starting value
 * @param {number} intValueChange - change in value
 */
Interpolator = {};
Interpolator.linear = function(intCurrentTime, intDuration, intStartValue, intValueChange)
{
    if (intCurrentTime > intDuration)
    {
        intCurrentTime = intDuration; 
    }
    
    if ( intDuration == 0 )
    {
        return  (intStartValue + intValueChange);
    }
    
    return intStartValue + (intValueChange * (intCurrentTime / intDuration));
}

/**
 * QuadraticIn interpolation - starts slow, ends fast
 *  
 * @param {number} intDuration - total duration of animation
 * @param {number} intCurrentTime - current time (0 - intDuration)
 * @param {number} intStartValue - starting value
 * @param {number} intValueChange - change in value
 */
Interpolator.quadraticIn = function (intDuration, intCurrentTime, intStartValue, intValueChange) {
    if (intCurrentTime > intDuration)
    {
        intCurrentTime = intDuration; 
    }
    intCurrentTime = intCurrentTime / intDuration;
    return intStartValue + (intValueChange * intCurrentTime * intCurrentTime);
};

/**
 * QuadraticOut interpolation - starts fast, ends slow
 *  
 * @param {number} intDuration - total duration of animation
 * @param {number} intCurrentTime - current time (0 - intDuration)
 * @param {number} intStartValue - starting value
 * @param {number} intValueChange - change in value
 */
Interpolator.quadraticOut = function (intDuration, intCurrentTime, intStartValue, intValueChange) {
    if (intCurrentTime > intDuration)
    {
        intCurrentTime = intDuration; 
    }
    intCurrentTime = intCurrentTime / intDuration;
    return intStartValue + (-intValueChange * intCurrentTime * (intCurrentTime-2));
};

/**
 * QuadraticInOut interpolation - slow - fast - slow
 *  
 * @param {number} intDuration - total duration of animation
 * @param {number} intCurrentTime - current time (0 - intDuration)
 * @param {number} intStartValue - starting value
 * @param {number} intValueChange - change in value
 */
Interpolator.quadraticInOut = function (intDuration, intCurrentTime, intStartValue, intValueChange) {
    if (intCurrentTime > intDuration)
    {
        intCurrentTime = intDuration; 
    }
    intCurrentTime = intCurrentTime / (intDuration / 2);
    
    if (intCurrentTime < 1) {
        return intStartValue + (intValueChange / 2 * intCurrentTime * intCurrentTime);
    }
    intCurrentTime--;
    return intStartValue + (-intValueChange / 2 * ( intCurrentTime * (intCurrentTime - 2) - 1));
};

/**
 * constant interpolation returns original position all the time until current time is eqeal or greater that given number
 * can be used as delay or for animating
 *  
 * @param {number} intDuration - total duration of animation
 * @param {number} intCurrentTime - current time (0 - intDuration)
 * @param {number} intStartValue - starting value
 * @param {number} intValueChange - change in value
 */
Interpolator.constant = function(intDuration, intCurrentTime, intStartValue, intValueChange)
{
    if (intCurrentTime >= intDuration)
    {
        return intStartValue;
    }
    else
    {
        return intStartValue + intValueChange;
    }
}

function TestQuintBezier(){
/*
    QuintBezier qb = new QuintBezier();
    var pn = qb.getPolynomials(valueBoxes.get(P1).getValue(), valueBoxes.get(P2).getValue(), valueBoxes.get(P3).getValue(), valueBoxes.get(P4).getValue());
    bounceTween.setInterpolator(new M_ElasticOut(pn.get(0), pn.get(1), pn.get(2), pn.get(3), pn.get(4)));
*/
}