    
    function ServerProxy(server, dataParser, virtualHost){
        this._eventManager = Events.Dispatcher;
        this._dataParser = dataParser;
        this.server = server;
        this.objComms = new Comm();
        
        // If null, we use a real server, otherwise this one.
        // Transparent to game, we just signal a response received and parsed.
        this.virtualHost = virtualHost;
        
        this.receiveResponse = this.receiveResponse.bind(this);
        this.receiveErrorResponse = this.receiveErrorResponse.bind(this);
        
        trace("Created ServerProxy");
    }
    
    ServerProxy.prototype._eventManager = null;
    ServerProxy.prototype._dataParser = null;
    ServerProxy.prototype.objComms = null;
    ServerProxy.prototype.parsedResponse = null;
    ServerProxy.prototype._timeOfLastBet = 0;
    ServerProxy.BET_INTERVAL = 3000;
    
    
    /**
     * 
     * @param {Object} data: JSON from game
     */
    ServerProxy.prototype.makeRequest = function(jsonData)
    {
        //trace("ServerProxy.prototype.makeRequest " + JSON.stringify(jsonData));
        this._requestCode = jsonData.code;
        switch(this._requestCode)
        {
            /*
             * Init request initialises this._timeOfLastBet
             */
            case "INIT":
                this._requestData = this._dataParser.buildInitRequest();
                this._sendRequest();
            break;
            
            /*
             * Bet requests must be at least 3 seconds apart even in turbo
             * The following code delays sending a Bet until 3000ms have passed since the previous bet.
             * Works in normal, turbo, autoplay and turbo autoplay modes.
             * Freespins are unaffected as they do not use the server on VF.
             */
            case "BET"://GameEvent.BetRequest:
            {
                this._requestData = this._dataParser.buildSpinRequest(jsonData);
                
                // Find out how long since the last bet was sent.
                var timeElapsed = (new Date().getTime() - this._timeOfLastBet);
                
                /*
                 * If less than the interval set a timeout to send the bet.
                 * The delay is 3 seconds minus time already elapsed.
                 * NB could just set timeout with (ServerProxy.BET_INTERVAL-timeElapsed) as -ive values
                 * *should* be OK ... but better safe than sorry.
                 */
                if(timeElapsed < ServerProxy.BET_INTERVAL)
                {
                    setTimeout(this._sendRequest, (ServerProxy.BET_INTERVAL - timeElapsed));    
                    //trace("timeElapsed only",timeElapsed,"Send bet in",(ServerProxy.BET_INTERVAL - timeElapsed))
                }
                else
                {
                    this._sendRequest();
                }
            }
            break;
        }
        
    };
    
    /**
     * on BetRequest : Sent after a minimum of 3 seconds has elapsed since the last request.
     */
    ServerProxy.prototype._sendRequest = function()
    {   
        //trace("Sending request after",((new Date().getTime() - this._timeOfLastBet)/1000),"seconds")
       // var server = wrapper.getGameEndpointUrl();
       console.log(this.server);
       
       if(this.virtualHost != null){
           this.virtualHost.receiveRequest(this._requestData, this.receiveResponse, this.receiveErrorResponse);
       }
       else {
           // Post to server, wait for response       
           this.objComms.doPost(this.server, this._requestData, this.receiveResponse, this.receiveErrorResponse);
       }
              
        // Get new time of last bet.
        this._timeOfLastBet = new Date().getTime();
    };
    
    
    /**
     * 
     * @param {Object} data: xml from server:
     * listen for Event.VALID_RESPONSE_RECEIVED to pick up parsed data
     */
    ServerProxy.prototype.receiveResponse = function(responseData)
    {
        //trace("ServerProxy.receiveResponse " + responseData);
        if(this._dataParser.parseResponse(this._requestCode, responseData) == false)
        {
            if (  responseData.indexOf('noFunds') > 0  ) {
                this.parsedResponse = "noFunds";
            } 
            else {
                this.parsedResponse = "serverError";
            }

            this._eventManager.dispatchEvent(new Event(Event.INVALID_RESPONSE_RECEIVED));
        }
        else
        {
            this._eventManager.dispatchEvent(new Event(Event.VALID_RESPONSE_RECEIVED));
        }
    };
    
    ServerProxy.prototype.receiveErrorResponse = function(responseData)
    {
        console.log("Received error response",responseData);
        this._eventManager.dispatchEvent(new Event(Event.INVALID_RESPONSE_RECEIVED));
    }
