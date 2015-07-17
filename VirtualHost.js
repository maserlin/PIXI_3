function VirtualHost(reels){
    
    this.reels = [];
    for(var r in reels)this.reels.push(reels[r]);
    this.currentReels = 0;
    this.createResponse = this.createResponse.bind(this);
    this.getReelStops = this.getReelStops.bind(this);
}
VirtualHost.prototype.reels = null;
VirtualHost.prototype.currentReels = null;
VirtualHost.prototype.reelStops = null;


VirtualHost.prototype.createResponse = function(req, cheats){
    if(req.code == "BET"){
        this.reelStops = cheats || new Array();
        for(var r=0; r<5; ++r){
            var rand = Math.floor(Math.random() * this.reels[this.currentReels][r].length);
            this.reelStops.push(rand);
        }
    
        setTimeout(function(){
            Events.Dispatcher.dispatchEvent(new Event(Event.VALID_RESPONSE_RECEIVED));
        },1000);
    }
}

VirtualHost.prototype.getReelStops = function(){
    return this.reelStops;
}
