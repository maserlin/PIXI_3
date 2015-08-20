function VirtualHost(reels){
    
    this.reels = [];
    for(var r in reels)this.reels.push(reels[r]);
    this.currentReels = 0;
    this.receiveRequest = this.receiveRequest.bind(this);
    this.getReelStops = this.getReelStops.bind(this);
    this.x2js = new xml2json();
    this.stake = 0;
    this.balance = 10000;
    this.winCalc = new WinCalculator();
}
VirtualHost.prototype.reqObj = null;
VirtualHost.prototype.reels = null;
VirtualHost.prototype.currentReels = null;
VirtualHost.prototype.reelStops = null;


VirtualHost.prototype.receiveRequest = function(request, callback, callbackOnError){
    
   this.reqObj = this.x2js.xml2json(this.x2js.parseXmlString(request));
    
    if(this.reqObj.PlaceBetRequest.BET != null){
       
       var bet = this.reqObj.PlaceBetRequest.BET;
        
        this.stake = Number(bet._stake)*100;
        this.balance -= this.stake;
        
        
        this.reelStops = bet._foitems == "null" ? new Array() : bet._foitems.split(",");
        
        this.currentReels = 0;
        this.bonus = false;
        
        // Set reelset from cheat
        if(this.reelStops.length != 0)
        {
            this.currentReels = this.reelStops.shift();
            if(this.currentReels == 1)this.bonus = true;
        }
        // Decide for ourselves
        else
        {
            // Use bonus reels?
            if( Math.floor(Math.random() * 10) > 6) 
            {
                this.bonus = true;
                this.currentReels = 1;
            }

            // Set stops
            for(var r=0; r<5; ++r){
                var rand = Math.floor(Math.random() * this.reels[this.currentReels][r].length);
                this.reelStops.push(rand);
            }
            
            // Start bonus
            if(this.bonus){
                var stops = [this.reels[this.currentReels][2].length-1,0,1];
                if(this.currentReels == 1)this.reelStops[2] = stops[Math.floor(Math.random()*3)];
            }
        }
        
        this.reelMap = [];
        var reelset = this.reels[this.currentReels];
        for(var reel in reelset){
            this.reelMap.push(this.symbolsInView(this.reelStops[reel], reelset[reel]));
        }        

        this.wins = this.winCalc.calculate(this.reelMap);
        var symbols=[];
        for(var rm in this.reelMap)symbols = symbols.concat(this.reelMap[rm]);
        
        var vfrStr = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>" +
        "<PlaceBetResponse gameId=\"1\"><Jackpots/><Balances><Balance amount=\"" + this.balance + 
        "\" category=\"TOTAL\" currency=\"GBP\" name=\"Total\"/><Balance amount=\"" + this.balance +
        "\" category=\"CASH\" currency=\"GBP\" name=\"Cash\"/></Balances><Outcome balance=\"" + this.balance +
        "\"><Spin layout=\"" + this.currentReels + "\" maxWin=\"false\" position=\"" + this.reelStops + 
        "\" spinWin=\"0.70\" stake=\""+Number(bet._stake).toFixed(2)+"\"" + 
        " symbols=\"" + symbols +"\">";
        
        if(this.wins.lines.length > 0){
            vfrStr += "<Winlines>";
            
            for(var line=0; line<this.wins.lines.length; ++line){
                
                vfrStr += "<Winline count=\"" + this.wins.winline[line].length + "\" id=\"" + this.wins.lines[line] + "\"" + 
                " symbol=\"2\" symbols=\"" + this.wins.winline[line] + "\" win=\"" + this.wins.winAmount[line] + "\"/>";
                      
            }          
                      
                      
            vfrStr += "</Winlines>";
        }
                  
                  
        vfrStr += "</Spin>";
        
        vfrStr +="<DrawState drawId=\"0\" state=\"betting\"><Bet pick=\"\" seq=\"0\" stake=\"2.00\" type=\"L\" won=\"pending\"/>"+
                  "</DrawState></Outcome></PlaceBetResponse>";

        setTimeout(function(){
            Events.Dispatcher.dispatchEvent(new Event(Event.VALID_RESPONSE_RECEIVED));
        },1000);
    }
}

VirtualHost.prototype.symbolsInView = function(index, reelband){
    var symbols = [];

    symbols.push(reelband[this.getWrappedIndex(index+1, reelband)]);
    symbols.push(reelband[this.getWrappedIndex(index, reelband)]);
    symbols.push(reelband[this.getWrappedIndex(index-1, reelband)]);
    
    return symbols;
}
VirtualHost.prototype.getWrappedIndex = function(newIndex, reelband){
    return (newIndex + reelband.length) % reelband.length;
}

VirtualHost.prototype.getReelStops = function(){
    return this.reelStops;
}
