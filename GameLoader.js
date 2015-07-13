function GameLoader(){
    PIXI.loaders.Loader.call(this);
}

GameLoader.prototype = Object.create(PIXI.loaders.Loader.prototype);
GameLoader.prototype.constructor = GameLoader;

// Temp XML loader
var oReq;

GameLoader.prototype.loadAssets = function(callbackOnDone){

    /* 
     * Rough and ready code to asynchronously load an XML file 
     * for reading into a configuration: 
     * Real settings *might* come from server init.
     */
    oReq = getXMLHttpRequest();
    if (oReq != null) {
        oReq.open("GET", "HolyGrail.xml", true);
        oReq.onreadystatechange = handler;
        oReq.send();
    }
    else {
        window.console.log("AJAX (XMLHTTP) not supported.");
    }

/*
 * This is a syynchronous loader: interrupts everything while it executes.
    var xmlDoc = loadXMLDoc("HolyGrail.xml");
    var converter = new xml2json();
    console.log(xmlDoc);
    var json = converter.xml2json(xmlDoc);
    console.log(JSON.stringify(json));
*/


    this.callback = callbackOnDone || this.callback;
    var assets = ["im/icon05.json","im/explosion.json","im/BlursNStills.json"];
    assets.push("im/bunny.png");
    assets.push("im/bg.jpg");
    this.add(assets);
    this.once('complete',this.onAssetsLoaded);
    this.on('progress', this.onProgress);
    this.load();
}

function handler()
{
    if (oReq.readyState == 4 /* complete */) {
        if (oReq.status == 200) {
            console.log(oReq.responseText);
        }
    }
}

/**
 * Gets a valid request object on any platform (in theory)
 * TODO test this on devices! 
 */
function getXMLHttpRequest() 
{
    if (window.XMLHttpRequest) {
        return new window.XMLHttpRequest;
    }
    else {
        try {
            return new ActiveXObject("MSXML2.XMLHTTP.3.0");
        }
        catch(ex) {
            return null;
        }
    }
}

/*
 * Synchronous loader code...
function loadXMLDoc(filename)
{
    if (window.XMLHttpRequest)
    {
        xhttp=new XMLHttpRequest();
    }
    else // code for IE5 and IE6
    {
        xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET",filename,false);
    xhttp.send();
    return xhttp.responseXML;
}
*/

GameLoader.prototype.onProgress = function(data){
    console.log(data.progress);
}

GameLoader.prototype.onAssetsLoaded = function(data){
    for ( var obj in data.resources){
        console.log("Loaded " + obj);
    }
//    this.callback();
    
    Events.Dispatcher.dispatchEvent(new Event("ASSETS_LOADED"));
    
}

GameLoader.prototype.callback = function(){
    console.log("Make callback");
}
