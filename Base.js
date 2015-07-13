/**
 * @author Haseeb.Riaz
 */


if(navigator.vibrate){
	
	//navigator.vibrate(500);
};

//alert(navigator.webkitVibrate);

// d : new class name
// b : parent class name
// s : call parent's constructor? true/false

function newClass (d, b, s) {
	
	if(s == undefined) s =  true;
	
    function construct(){
        
        // binds functions to this class
    	for (var prop in this){
        	
        	if(prop == "__getters") continue;
        	if(this.__getters.indexOf(prop) >= 0) continue;
        	if(typeof this[prop] == 'function'){
 
                this[prop] = createDelegate(this, this[prop]);
            }
        }
        
        if(b && s) b.apply(this,arguments);
        d.apply(this, arguments);
    }
    
    if(b == null || b == undefined) {
    	
    	construct.prototype.__getters = [];
    	return construct;
    }
 
    function proto(){
 
    }
 
    proto.prototype = b.prototype;
 
    construct.prototype = new proto();
    construct.prototype.__getters =  b.prototype.__getters || [];
    return  construct;
};

var isTouch = (function (){
    
    if(navigator.msMaxTouchPoints) return true;
     
    try{
    	
        document.createEvent('TouchEvent');
        return true;
             
    } catch(e){
        
    	return false;
    }
})();

var requestAnimFrame = (function(){
   
	return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

function createDelegate(self, func){
  
	return func.bind(self);
}

function defineGetter(obj, prop, func){
	 
    var desc = Object.getOwnPropertyDescriptor(obj, prop) || {configurable: true};
    desc["get"] = func;
    Object.defineProperty(obj, prop, desc);
    obj.__getters.push(prop);
};
 
function defineSetter(obj, prop, func){
 
    var desc = Object.getOwnPropertyDescriptor(obj, prop) || {configurable: true};
    desc["set"] = func;
    Object.defineProperty(obj, prop, desc);
};
 
function getImageFromArrayBuffer(arrayBuffer){
	
	var image = document.createElement('img');
	image.src = 'data:image/png;base64,'+ encode(new Uint8Array(arrayBuffer));
	return image;
};

function encode(input) {
	
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}

function isInt(value){
	
	if(!value) return false;
	return value % 1 == 0;
}

var trace = console.log.bind(console);

function sortOn(array, property, assending){
	
	assending = assending === undefined ? true: assending;
	array.sort(function(a, b){
		
		if(a[property] < b[property]) return assending? -1: 1;
		if(a[property] > b[property]) return assending? 1: -1;
		return 0;
	});
}

function extractArray(array, property){
	
	if(!array) return null;
	var a = [];
	
	var length = array.length;
	for(var i = 0; i < length; i++){
		
		a.push(array[i][property]);
	}
	
	return a;
}

function shuffleArray(array) {
	
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    
    return array;
}

function getClassByName(className){
	
	var arr = className.split(".");
	var length = arr.length;
	var def = window[arr[0]];
	
	for(var i = 1; i < length; i++){
		
		def = def[arr[i]];
	}
	
	return def;
}

function indexOf(array, property, value){
	
	var index = -1;
	for(var i = array.length -1; i >= 0; --i){
		
		if(array[i][property] === value) {
			return i;
		} 
	}
	
	return index;
};

var hasAudioContext  = false;
try{
	
	new webkitAudioContext();
	hasAudioContext = navigator.userAgent.search("HTC") < 0 && navigator.userAgent.search("Silk") < 0 && navigator.userAgent.search("Hudl") < 0;
	
} catch(e){
	;
}

//hasAudioContext = false;


urlAPI = (window.createObjectURL && window) ||
(window.URL && URL.revokeObjectURL && URL) ||
(window.webkitURL && webkitURL);
