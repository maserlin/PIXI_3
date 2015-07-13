/**
 * Game specific data parser.
 * Needs to support certain methods... 
 */
    
    function DataParser(){
        this.x2js = new xml2json();
        console.log("Created VF DataParser");
        
        this.responseIsValid = this.responseIsValid.bind(this);
        this.cleanObject = this.cleanObject.bind(this);
        this.parseResponse = this.parseResponse.bind(this);
    }

    var ServerResponseModel = Object.create(null);
    var GameConfiguration = Object.create(null);
    
    // Storage for SPIN requests: Use in case of ERROR to contruct safe return data
    DataParser.prototype.objSpinRequestJson = Object.create(null);
    
    // Server responses are converted to JSON for easy processing.
    DataParser.prototype.serverResponseAsJSON = Object.create(null);
    
    // Retuned to game as the results object (config, spin, etc)
    DataParser.prototype.responseToGameJSON = Object.create(null);
    
    // Parses XML string or dom doc to Json
    DataParser.prototype.x2js = null; 
    
    DataParser.staticResponseData = null;
     
    /**
     * Check for a valid response ie no error codes etc 
     */
    DataParser.prototype.responseIsValid = function( responseData )
    {
        /*
         * In freespins the server will return an error for ALL freespin results
         * that follow a freespin with maxWin=true. We DON'T want to flag this:
         * Allow the game to play out!
         */
        if(responseData.match(/Freespins/i))
        {
            if(responseData.match(/error/i))
            {
                if(!responseData.match(/maxWin="true"/i))
                {
                    return false;
                }
            }
        }
        
        else if(responseData.match(/error/i))
        {
            return false;
        }

        //
        return true;
    };
    
    
    DataParser.prototype.cleanObject = function(dataobj)
    {
        for(var prop in dataobj)
        {
            delete dataobj[prop];
        }
    };
    
    /**
     * 
     * @param code: passed in to be attached to response, identifies response type.
     * @param responseXml : received from server for translation to common data format. 
     */
    DataParser.prototype.parseResponse = function( code, responseXml )
    {
        // New data to return to game
        this.cleanObject(this.responseToGameJSON);
    
        // Attach id code
        this.responseToGameJSON.code = code;
        
        if(this.responseIsValid(responseXml)==false)
        {
            this.responseToGameJSON.Error = true;
            ServerResponseModel.staticResponseData = this.responseToGameJSON; 
            return false;
        }
        
        //  
        switch(code)
        {
            case "INIT"://GameEvent.InitRequest:
            {
                /*
                 * Sets the GameConfiguration up with the server data:
                 * Winlines, reels, stakes etc
                 */
                this._parseInitXml(responseXml);
                
                // Initial Balance    
                //wrapper.setBalance(Number(this.serverResponseAsJSON.InitResponse.Balances.Balance[0]._amount));
            }
            break;
    
            case "BET"://GameEvent.BetRequest:
            {
                // Test with a single freespin which hits maxWin
                //responseXml = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><PlaceBetResponse gameId="39"><Jackpots/><Balances><Balance amount="2190.40" category="TOTAL" currency="GBP" name="Total"/><Balance amount="2190.40" category="CASH" currency="GBP" name="Cash"/></Balances><Outcome balance="2190.40"><Spin layout="2" maxWin="false" position="2,4,25,2,0" spinWin="2.50" stake="2.00" symbols="0,12,3,2,12,0,11,0,1,11,1,3,10,11,9" totalWin="2.50"><Winlines><Winline count="3" id="0" symbol="0" symbols="12,12,0,1,11" win="5"/><Winline count="3" id="10" symbol="0" symbols="12,0,0,3,11" win="5"/><Winline count="4" id="14" symbol="1" symbols="12,12,1,1,11" win="10"/><Winline count="3" id="15" symbol="0" symbols="0,12,0,1,10" win="5"/></Winlines><Bonus id="0" indices="1,4" multiplier="0" position="12" win="0.00"/><Freespins award="7" index="0" multiplier="4" value="6,9,13"/></Spin><Freespin award="7" freespinsWin="7.50" index="7" indices="1,6,13" layout="14" maxWin="true" multiplier="4" position="36,18,16,11,28" spinWin="7.50" stake="2.00" symbols="3,12,6,6,1,0,12,2,0,0,1,4,1,12,2" totalWin="10.00"><Winlines><Winline count="3" id="7" symbol="6" symbols="12,6,12,0,12" win="40"/><Winline count="3" id="8" symbol="0" symbols="12,0,0,4,12" win="5"/><Winline count="5" id="13" symbol="1" symbols="12,1,12,1,12" win="30"/></Winlines></Freespin><Error msg="Invalid request"/><Error msg="Invalid request"/><Error msg="Invalid request"/><Error msg="Invalid request"/><Error msg="Invalid request"/><Error msg="Invalid request"/><DrawState drawId="0" state="closed"><Bet payout="10.00" pick="" seq="0" stake="2.00" type="L" won="true"/></DrawState></Outcome></PlaceBetResponse>'
                // Test with second freespin hitting maxWin
                //responseXml = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><PlaceBetResponse gameId="39"><Jackpots/><Balances><Balance amount="2190.40" category="TOTAL" currency="GBP" name="Total"/><Balance amount="2190.40" category="CASH" currency="GBP" name="Cash"/></Balances><Outcome balance="2190.40"><Spin layout="2" maxWin="false" position="2,4,25,2,0" spinWin="2.50" stake="2.00" symbols="0,12,3,2,12,0,11,0,1,11,1,3,10,11,9" totalWin="2.50"><Winlines><Winline count="3" id="0" symbol="0" symbols="12,12,0,1,11" win="5"/><Winline count="3" id="10" symbol="0" symbols="12,0,0,3,11" win="5"/><Winline count="4" id="14" symbol="1" symbols="12,12,1,1,11" win="10"/><Winline count="3" id="15" symbol="0" symbols="0,12,0,1,10" win="5"/></Winlines><Bonus id="0" indices="1,4" multiplier="0" position="12" win="0.00"/><Freespins award="7" index="0" multiplier="4" value="6,9,13"/></Spin><Freespin award="7" freespinsWin="7.50" index="7" indices="1,6,13" layout="14" maxWin="false" multiplier="4" position="36,18,16,11,28" spinWin="7.50" stake="2.00" symbols="3,12,6,6,1,0,12,2,0,0,1,4,1,12,2" totalWin="10.00"><Winlines><Winline count="3" id="7" symbol="6" symbols="12,6,12,0,12" win="40"/><Winline count="3" id="8" symbol="0" symbols="12,0,0,4,12" win="5"/><Winline count="5" id="13" symbol="1" symbols="12,1,12,1,12" win="30"/></Winlines></Freespin><Freespin award="7" freespinsWin="7.50" index="7" indices="1,6,13" layout="14" maxWin="true" multiplier="4" position="36,18,16,11,28" spinWin="7.50" stake="2.00" symbols="3,12,6,6,1,0,12,2,0,0,1,4,1,12,2" totalWin="10.00"><Winlines><Winline count="3" id="7" symbol="6" symbols="12,6,12,0,12" win="40"/><Winline count="3" id="8" symbol="0" symbols="12,0,0,4,12" win="5"/><Winline count="5" id="13" symbol="1" symbols="12,1,12,1,12" win="30"/></Winlines></Freespin><Error msg="Invalid request"/><Error msg="Invalid request"/><Error msg="Invalid request"/><Error msg="Invalid request"/><Error msg="Invalid request"/><DrawState drawId="0" state="closed"><Bet payout="10.00" pick="" seq="0" stake="2.00" type="L" won="true"/></DrawState></Outcome></PlaceBetResponse>'

                // Parses incoming XML to serverResponseAsJSON
                this._parseResultXml(responseXml);
             
                /*
                 * Uses serverResponseAsJSON to create result set in JSON format for Game
                 * *MAY* throw an error in edge cases such as one single freespin that reaches 
                 * maxWin returned in the results, as the Edge implementation returns the results
                 * in a different format to usual in this case :( 
                 */
                try
                {
                    this._createResultsResponse();
                }
                catch(e)
                {
                    console.log("Error creating game results from " + responseXml);
                }
            }
            break;
    
            case GameEvent.BalanceUpdateRequest:
            {
                // parse the balance
                var newBalance = responseXml.substring(responseXml.indexOf("balance=") + 9, responseXml.indexOf("/")-1);

                // Update messenger model balance
                //wrapper.setBalance(Number(newBalance));
            }
    
            break;
        }
    
        /*
         * When we clean the responseToGameJSON object (above) the operation
         * is applied to ServerResponseModel.staticResponseData as well, because
         * this is a reference to it, not a copy of it.
         */
        ServerResponseModel.staticResponseData = this.responseToGameJSON; 
        
        return true;
    };
    
    /**
     * Create valid game configuration from the details passed in by the server
     * (balance, stakes, winlines, reels, symbols etc)
     * @param {Object} responseXml
     */
    DataParser.prototype._parseInitXml = function (responseXml)
    {
        var xmlDoc = createDoc(responseXml);
        this.cleanObject(this.serverResponseAsJSON);
        this.serverResponseAsJSON = this.x2js.xml2json(xmlDoc);

        /*
         * Construct game initialisation objects..
         */ 
        //GameConfiguration.getInstance().storeCurrencyDetails(this.serverResponseAsJSON.InitResponse.Balances.Balance[0]);
        
        //        
        //GameConfiguration.getInstance().createGameConfiguration(this.serverResponseAsJSON.InitResponse);
    };

    
    /**
     * Turn the server response into some JSON we can work with.
     * It will be further transformed into a platfor-independent format
     * in _createResultsResponse
     * "<?xml version="1.0" encoding="UTF-8" standalone="no"?>
        <PlaceBetResponse gameId="1">
            <Jackpots/>
            <Balances>
                <Balance amount="398.70" category="TOTAL" currency="GBP" name="Total"/>
                <Balance amount="398.70" category="CASH" currency="GBP" name="Cash"/>
            </Balances>
            <Outcome balance="398.70">
                <Spin layout="0" maxWin="false" position="2,7,12,5,29" spinWin="0.70" stake="2.00" symbols="6,2,0,2,1,11,9,6,0,1,2,7,11,2,3">
                    <Winlines>
                        <Winline count="3" id="7" symbol="2" symbols="2,2,9,1,2" win="7"/>
                    </Winlines>
                </Spin>
                <DrawState drawId="0" state="betting">
                    <Bet pick="" seq="0" stake="2.00" type="L" won="pending"/>
                </DrawState>
            </Outcome>
        </PlaceBetResponse>"
     */
    DataParser.prototype._parseResultXml = function(responseXml)
    {
        //console.log(responseXml);
    
        var xmlDoc = createDoc(responseXml);
        this.cleanObject(this.serverResponseAsJSON);
        this.serverResponseAsJSON = this.x2js.xml2json(xmlDoc);
        
        //GameConfiguration.getInstance().storeCurrencyDetails(this.serverResponseAsJSON.PlaceBetResponse.Balances.Balance[0]);

        /*
         * Work with just the Spin results. Include latest balance. If there's no wins the main screen
         * will update balance to latest; this will include any new funds added as a result of low balance
         * message to player. 
         */
        this.objResultsJson = this.serverResponseAsJSON.PlaceBetResponse.Outcome.Spin;
        this.objResultsJson._flBalance = this.serverResponseAsJSON.PlaceBetResponse.Balances.Balance[0]._amount;
        
        // If freespins, store like this.
        if(this.serverResponseAsJSON.PlaceBetResponse.Outcome.Freespin)
        {
            this.objResultsJson.Freespins.Freespin = [];
            try
            {
                for(var result in this.serverResponseAsJSON.PlaceBetResponse.Outcome.Freespin)
                {
                    this.objResultsJson.Freespins.Freespin.push(this.serverResponseAsJSON.PlaceBetResponse.Outcome.Freespin[result]);
                }
            }
            catch(e)
            {
                //alert("DataParser.prototype.parseResultXml")
            }
        
        }
    };
    
    /**
     * Use the recieved XML or other response, now parsed to JSON,
     * to create platform-independent JSON for the game.
     */
    DataParser.prototype._createResultsResponse = function ()
    {
        var i = 0;

        /*
         * this.responseToGameJSON should be already new-ed 
         * and the request code attached as code:Bet 
         */
        this.responseToGameJSON.Spin = Object.create(null);
        this.responseToGameJSON.Spin.flStake = parseFloat(this.objResultsJson._stake);
        this.responseToGameJSON.Spin.flLineStake = this.responseToGameJSON.Spin.flStake/20;
        this.responseToGameJSON.Spin.flSpinWin = parseFloat(this.objResultsJson._spinWin);
        this.responseToGameJSON.Spin.blMaxWin = this.objResultsJson._maxWin == "false" ? false : true;
        this.responseToGameJSON.Spin.intLayout = parseInt(this.objResultsJson._layout, 10);
        this.responseToGameJSON.Spin.flBalance = Number(this.objResultsJson._flBalance);
        
        // Ensure ints for new stop positions
        this.responseToGameJSON.Spin.arrPosition = this.objResultsJson._position.split(",");
        for( i in this.responseToGameJSON.Spin.arrPosition )
        {
            this.responseToGameJSON.Spin.arrPosition[i] = parseInt(this.responseToGameJSON.Spin.arrPosition[i], 10);
        }
    
        // Ensure ints for array of final symbols-in-view. 
        this.responseToGameJSON.Spin.arrSymbols = this.objResultsJson._symbols.split(",");
        for( i in this.responseToGameJSON.Spin.arrSymbols )
        {
            this.responseToGameJSON.Spin.arrSymbols[i] = parseInt(this.responseToGameJSON.Spin.arrSymbols[i], 10);
        }
    
        // Record any winlines
        this.responseToGameJSON.Spin.arrWinlines = [];
    
        //
        if(this.objResultsJson.Winlines.__cnt > 0)
        {
            for(var wl=0; wl<this.objResultsJson.Winlines.Winline_asArray.length; ++wl)
            {
                var line = this.objResultsJson.Winlines.Winline_asArray[wl];
                this.responseToGameJSON.Spin.arrWinlines.push(new WinlineResult(line));
            }
        }

        // Moon bonus
        if(this.objResultsJson.Bonus)
        {
            this.responseToGameJSON.Spin.Bonus = Object.create(null);
            this.responseToGameJSON.Spin.Bonus.id = parseInt(this.objResultsJson.Bonus._id,10);
            this.responseToGameJSON.Spin.Bonus.indices = this.objResultsJson.Bonus._indices.split(",");
            this.responseToGameJSON.Spin.Bonus.multiplier = parseInt(this.objResultsJson.Bonus._multiplier,10);
            this.responseToGameJSON.Spin.Bonus.position = parseInt(this.objResultsJson.Bonus._position,10);
            this.responseToGameJSON.Spin.Bonus.win = parseFloat(this.objResultsJson.Bonus._win);
        }

        // -- Freespins
        if(this.objResultsJson.Freespins != null)
        {
            /*
             * Top level data telling us how many spins we got and where the scatters are on the reels. 
             * NOTE: This is agglomerated into a single result if the firat freespin hits maxWin!
             */
            this.responseToGameJSON.Freespins = Object.create(null);
            this.responseToGameJSON.Freespins.arrValue = this.objResultsJson.Freespins._value.split(",");
            this.responseToGameJSON.Freespins.intIndex = parseInt(this.objResultsJson.Freespins._index, 10);
            this.responseToGameJSON.Freespins.intAward = parseInt(this.objResultsJson.Freespins._award, 10);
            this.responseToGameJSON.Freespins.intMultiplier = parseInt(this.objResultsJson.Freespins._multiplier, 10);
            
            // Create array of freespin results
            this.responseToGameJSON.Freespins.arrFreespin = [];
            
            /*
             * Check that we have an ARRAY of freespins. If not then there's only one
             * due to maxWin being hit on the first freespin.
             * NOTE: Check the PlaceBetResponse.Outcome.JSON not the Spin.Freespins.Freespin object!
             */
            if(this.serverResponseAsJSON.PlaceBetResponse.Outcome.Freespin instanceof Array)
            {
                for(var s in this.objResultsJson.Freespins.Freespin)
                {
                    var spin = this.objResultsJson.Freespins.Freespin[s];
                    var freespin = Object.create(null);
                    freespin.intAward = parseInt(spin._award, 10);
                    freespin.intIndex = parseInt(spin._index, 10);
                    freespin.flSpinWin = parseFloat(spin._spinWin);
                    freespin.flFreespinsWin = parseFloat(spin._freespinsWin);
                    freespin.blMaxWin = spin._maxWin == "false" ? false : true;
                    freespin.intLayout = parseInt(spin._layout, 10);

                    //
                    freespin.arrPosition = spin._position.split(",");
                    for( i in freespin.arrPosition)
                    {
                        freespin.arrPosition[i] = parseInt(freespin.arrPosition[i], 10);
                    }

                    //
                    freespin.arrSymbols = spin._symbols.split(",");
                    for( i in freespin.arrSymbols)
                    {
                        freespin.arrSymbols[i] = parseInt(freespin.arrSymbols[i], 10);
                    }

                    freespin.arrWinlines = [];

                    var wls = spin.Winlines_asArray;
                    if(wls[0].Winline)
                    {
                        for(wl=0; wl<wls[0].Winline_asArray.length; ++wl)
                        {
                            var line = wls[0].Winline_asArray[wl];
                            freespin.arrWinlines.push(new WinlineResult(line));
                        }
                    }

                    //
                    this.responseToGameJSON.Freespins.arrFreespin.push(freespin);
                }
            }
            /*
             * Only one freespin result due to maxWin hit on first freespin.
             * We need to check that the array position magic numbers here are 
             * the right ones to use.
             * [13,       // [0] no idea
                Object,   // [1] winlines
                Array[1], // [2] winlines as array
                "7",      // [3] award (spins total)
                "7.50",   // [4] freespinsWin
                "7",      // [5] index (this spin)
                "1,6,13", // [6] Scatter positions
                "14",     // [7] layout
                "true",   // [8] maxWin
                "4",      // [9] multiplier
                "36,18,16,11,28", // [10] stop positions 
                "7.50",   // [11] spinWin (this spin)  
                "2.00",   // [12] stake
                "3,12,6,6,1,0,12,2,0,0,1,4,1,12,2", // [13] symbols
                "10.00"] // [14] totalWin spins + freespins
             */
            else
            {
                var spin = this.objResultsJson.Freespins.Freespin;
                var freespin = Object.create(null);
                
                freespin.intAward = parseInt(spin[3], 10);
                freespin.intIndex = parseInt(spin[5], 10);
                freespin.flSpinWin = parseFloat(spin[11]);
                freespin.flFreespinsWin = parseFloat(spin[4]);
                freespin.intLayout = parseInt(spin[7], 10);
                
                freespin.blMaxWin = spin[8] == "false" ? false : true;
                

                //
                freespin.arrPosition = spin[10].split(",");
                for( i in freespin.arrPosition)
                {
                    freespin.arrPosition[i] = parseInt(freespin.arrPosition[i], 10);
                }

                //
                freespin.arrSymbols = spin[13].split(",");
                for( i in freespin.arrSymbols)
                {
                    freespin.arrSymbols[i] = parseInt(freespin.arrSymbols[i], 10);
                }

                freespin.arrWinlines = [];

                var wls = spin[2];
                if(wls[0].Winline)
                {
                    for(wl=0; wl<wls[0].Winline_asArray.length; ++wl)
                    {
                        var line = wls[0].Winline_asArray[wl];
                        freespin.arrWinlines.push(new WinlineResult(line));
                    }
                }

                //
                this.responseToGameJSON.Freespins.arrFreespin.push(freespin);
            }
        }
    };
    
    
    /**
     * 
     */
    DataParser.prototype.buildInitRequest = function()
    {
        var objConfiguration = Object.create(null);
        objConfiguration.strGameTitle ="AG-FullMoonFortunes";

        return '<InitRequest gameTitle="' + objConfiguration.strGameTitle + '" />';
    };
    
    /**
     * 
     * @param {Object} jsonData
     * 
     * <CompositeRequest>
<PlaceBetRequest gameTitle="AG-FullMoonFortunes">
<Bet stake="2.00" winlines="20"/>
</PlaceBetRequest />
</CompositeRequest>
     */
    DataParser.prototype.buildSpinRequest = function (jsonData)
    {
        // Used to construct an error response ONLY.
        this.objSpinRequestJson = jsonData;
    
        // Init output.
        var strSpinRequest="";
        
        var title = "PIXI_TEST_GAME";//GameConfiguration.getInstance().strGameTitle;
        
        // Bet Request. Check input is in fact a bet request.
        if( jsonData.code == "BET")//GameEvent.BetRequest )
        {
            strSpinRequest = '<PlaceBetRequest gameTitle=\"' + title + '">';
            
            strSpinRequest += '<' + jsonData.code + ' stake="' + jsonData.stake.toFixed(2) + 
                              '" winlines="' + jsonData.winlines; 
            strSpinRequest += '" />';
    
            //strSpinRequest += '</PlaceBetRequest>';
        }
    
        //
        return strSpinRequest;
    };

    /**
     * 
     */
    DataParser.prototype.buildBalanceUpdateRequest = function (){
        return "<CustomerBalanceRequest />";
    };

    
