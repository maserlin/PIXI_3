/**
 * General purpose comms class. Little has been done to change this from the original
 * and we are using it as-is: it works fine so far and we have not refactored it into 
 * a Class-style object. 
 */


function Comm(vhostIn) {
    this.http = null;
    this.url = null;
    this.method = 'GET';
    this.async = true;
    this.status = null;
    this.statusText = '';
    this.dataPayload = null;
    this.readyState = null;
    this.responseText = null;
    this.responseXML = null;
    this.handleResp = null;
	this.handleTimeout = null;
	this.timer = null;
    this.responseFormat = 'text'; // 'text', 'xml' or 'object'
    this.mimeType = null;
    this.headers = [];
	this.errors = [];
	this.msTimeout = 60000;
	this.vhost = vhostIn;
	
	this.startTime = null;
	//this.endTime = null;
	
	
    this.init = function () {
        var i = 0;
        var httpTry = [
            function () { return new XMLHttpRequest(); },
            function () { return new ActiveXObject('Msxml2.XMLHTTP'); },
            function () { return new ActiveXObject('Microsoft.XMLHTTP');}
        ];

        while (!this.http && (i < httpTry.length)) {
            try {
                this.http = httpTry[i++]();
            } catch (e) {}
        }
        if (!this.http) {
            return false;
        }
        
        return true;
    };

    this.doReq = function (notCached) {
        var self = null;
        var http = null;
        var headArr = [];

        if (!this.init()) {
			this.errors.push('Could not create XMLHttp object');
            return;
        }
        http = this.http;
        
        http.addEventListener("progress", this.updateProgress, false);
        
        http.open(this.method, this.url, this.async);

        if (this.method === 'POST') {
            http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        
        
        if (!notCached)
        {
            http.withCredentials = true;
            http.setRequestHeader("If-None-Match","some-random-string");
            http.setRequestHeader("Cache-Control","no-cache,max-age=0");
            http.setRequestHeader("Pragma", "no-cache");
        }
            
        if (this.mimeType) {
            try {
                http.overrideMimeType(this.mimeType);
            } catch (e) {/* couldn't override MIME type -- IE6 or Opera?*/}
        }
        
        self = this; //Fix loss-of-scope in inner function
        http.onreadystatechange = function () {
            var resp = null;
            self.readyState = http.readyState;
            if (http.readyState === 4) {
				//stop timer
				if(self.timer){
					clearTimeout(self.timer);
					self.timer = null;
				}
                // do stuff to handle response
                self.status = http.status;
                self.statusText = http.statusText;
                self.responseText = http.responseText;
                self.responseXML = http.responseXML;

                switch (self.responseFormat) {
                  case 'text':
                      resp = self.responseText;
                      break;
                  case 'xml':
                      resp = self.responseXML;
                      break;
                  case 'object': // maybe changed to default:
                      resp = http;
                      break;
                }
                if (self.status >= 200 && self.status <= 299) {
                    if (!self.handleResp) {
						self.errors.push('No response handler defined for this instance of Comm object.');
                        return;
                    } else {
                        self.handleResp(resp);
                    }
                } else {
                    self.handleErr(resp);
                }
            }
        }; //end of onreadystatechange anonymous function
		this.timer = setTimeout(self.handleTimeout, self.msTimeout);
        http.send(this.dataPayload);
    };

    this.doGet = function (url, handler, format, notCached) {
		this.url = url;
        this.handleResp = handler;
        this.responseFormat = format || 'text';
        this.doReq(notCached);
    };

    this.doPost = function (url, dataPayload, handler, format) {
		this.url = url;
        this.dataPayload = dataPayload;
        this.handleResp = handler;
        this.responseFormat = format || 'text';
        this.method = 'POST';
        this.doReq();
    };


    this.abort = function () {
        // reset http properties. init method will reinitialize them again
        if (this.http) {
            // Remove the existing handler just before we call abort!
            // Once abort is called,onreadystate event completes with a readyState of 4.
            // We don't want our response handler to be invoked when we abort a
            // request, so we remove the existing handler just before we call abort
            this.http.onreadystatechange = function () {};
            this.http.abort();
            this.http = null;
            this.readyState = null;
        }
		if(this.timer){
			clearTimeout(this.timer);
			this.timer = null;
		}
    };
    
    // default error handler. We can set custom error handler using this.setHandleErr(functionReference).
    this.handleErr = function () 
    {
        // timeout and http errors should use "connection" error message
        //ErrorDialog.show("connection", true, true);
    };
	
	// default timeout handler
    this.handleTimeout = function ()
    {
        // timeout and http errors should use "connection" error message
        //ErrorDialog.show("connection", true, true);
	};

    this.setMimeType = function (mimeType) {
        this.mimeType = mimeType;
    };

    this.setHandlerResp = function (funcRef) {
        this.handleResp = funcRef;
    };
	
    this.setHandlerErr = function (funcRef) {
        this.handleErr = funcRef;
    };
	
	this.setHandlerTime = function (funcRef, milisec) {
        this.handleTimeout = funcRef;
		this.msTimeout = milisec || 45000;
    };

    this.setRequestHeader = function (headerName, headerValue) {
        this.headers.push(headerName + ': ' + headerValue);
    };
    
    this.updateProgress = function(objEvent)
    {
        if(objEvent.lengthComputable)
        {
            var percentComplete = objEvent.loaded / objEvent.total;
            //console.log("pc " + percentComplete + " loaded " + objEvent.loaded + " tot " + objEvent.total);
            if(percentComplete == 1)
            {
                Comm.TOTAL_BYTES += objEvent.total;
                //console.log("TotalBytes: " + Comm.TOTAL_BYTES)
            }
        }
    };

}

Comm.TOTAL_BYTES = 0;

// Static callback function for connection, timeout and comms errors.
Comm.CONNECTION_ERROR_CALLBACK = null;

