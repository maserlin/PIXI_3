function WinCalculator(){
    this.winlines = [[1,1,1,1,1],// 1
                    [0,0,0,0,0],// 2
                    [2,2,2,2,2],// 3
                    [0,1,2,1,0],// 4
                    [2,1,0,1,2],// 5
                    [0,0,1,2,2],// 6
                    [2,2,1,0,0],// 7
                    [1,0,0,0,1],// 8
                    [1,2,2,2,1],// 9
                    [1,0,1,0,1],// 10
                    [1,2,1,2,1],// 11
                    [0,1,0,1,0],// 12
                    [2,1,2,1,2],// 13
                    [1,1,0,1,1],// 14
                    [1,1,2,1,1],// 15
                    [0,1,1,1,0],// 16
                    [2,1,1,1,2],// 17
                    [0,2,0,2,0],// 18
                    [2,0,2,0,2],// 19
                    [2,2,0,2,2]];// 20

  this.wins = Object.create(null);
  this.wins.winline = [];
  this.wins.lines = [];
  this.wins.winAmount = [];
  this.wins.bonus = null;
};

WinCalculator.WILD = 9;
WinCalculator.BONUS = 11;

WinCalculator.prototype.getBonusWins = function(){
    return this.wins.bonus.wins.slice(0);
}

/**
 * 
 */
WinCalculator.prototype.calculate = function(reelMap){
  console.log("WinCalculator calc " + reelMap);  
  
  this.wins = Object.create(null);
  this.wins.winline = [];
  this.wins.lines = [];
  this.wins.winAmount = [];
  this.wins.bonus = null;
  
  for(var r=0; r<reelMap.length; ++r)
  {
      for(var s=0; s<reelMap[r].length; ++s)
      {
          if(reelMap[r][s] == WinCalculator.BONUS){
             this.wins.bonus = Object.create(null);
             this.wins.bonus.wins = [];
             var rand = Math.floor(Math.random()*4)+3;
             for(var p=0; p<rand; ++p)
             {
                var prize = ((Math.random()*10000)+250);
                this.wins.bonus.wins.push(prize);    
             }
             break;
          }
      }
  }
  
  for(var line=0; line<this.winlines.length; ++line)
  {
      var winline = this.winlines[line];
      var symbolsOnWinline = [];
      for(var pos in winline){
          symbolsOnWinline.push(reelMap[pos][winline[pos]]);
      }
      //console.log(symbolsOnWinline);
      
      this.analyseSymbols(line, symbolsOnWinline);
  }
  
  for(var winline in this.wins.winline){
     console.log("WIN Line " + this.wins.lines[winline] + ": " + this.wins.winline[winline] + " pays " + this.wins.winAmount[winline]);      
  }
  return this.wins;
}

/**
 * 
 */
WinCalculator.prototype.analyseSymbols = function(line, symbols){
    var count = 1;
    
    var wilds = [];
    
    // Track which symbols are NOT wild!
    for(var s in symbols){
        if(symbols[s] != WinCalculator.WILD)wilds.push(s);
    }
    
    // Wilds win: winAmount is wilds value
    if(wilds.length == 0){
        this.wins.winline.push(symbols);
        this.wins.lines.push(line);
        this.wins.winAmount.push(WinCalculator.WILD * 100);
    }
    
    // Symbol win with 4 wilds: winAmount is symbol value
    else if(wilds.length == 1){
        this.wins.winline.push(symbols);
        this.wins.lines.push(line);
        this.wins.winAmount.push((1+symbols[wilds[0]]) * 50);
    }
    
    // 
    else{
        // First symbol that's not a wild
        var matchSymbol;
        for(var s in symbols){
            if(symbols[s] != WinCalculator.WILD)
            {
                matchSymbol = symbols[s];
                break;
            }
        }
        
        // Check all symbols against match symbol
        for(var s=1; s<symbols.length; ++s)
        {
            if(this.match(matchSymbol, symbols[s]))++count;
            else break;
        }
        
        // 3 or more symbols match
        if(count > 2)
        {
            this.wins.winline.push(symbols.slice(0,count));
            this.wins.lines.push(line);
            this.wins.winAmount.push((1+matchSymbol) * count * 10);
        }
    }
} 


/**
 * 
 * @param {Object} s1 : symbol to match - won't be a wild
 * @param {Object} s2
 */
WinCalculator.prototype.match = function(matchSymbol, s2){
    if( s2 == WinCalculator.WILD )return true;
    if(s2 == matchSymbol)return true;
    return false;
}





















