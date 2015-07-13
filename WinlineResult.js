        
    function WinlineResult(jsonData)
    {
        this.intId = parseInt(jsonData._id, 10);
        this.intSymbolId = parseInt(jsonData._symbol, 10);
        this.intCount = parseInt(jsonData._count, 10);
        this.flWin = parseFloat(jsonData._win);
        this.arrSymbols = jsonData._symbols.split(",");
    }

    WinlineResult.prototype.intId;
    WinlineResult.prototype.intSymbolId;
    WinlineResult.prototype.intCount;
    WinlineResult.prototype.flWin;
    WinlineResult.prototype.arrSymbols;
    
