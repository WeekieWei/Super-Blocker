chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
    if(changeInfo.status == 'complete')
    {
        if(tab.url.search("chrome://") == -1 && tab.url.search("file:///") == -1 ){
            //var tab = tabId;
            $.ajax({
                url: "http://localhost/ethical/server.php",
                type: "POST",
                async: false,
                data: {"url" : tab.url},
                error: function (jqXHR, exception) {
                    var msg = '';
                    if (jqXHR.status === 0) {
                        msg = 'Could not connect to SuperBlocker server.';
                    } else if (jqXHR.status == 404) {
                        msg = 'Requested page not found. [404]';
                    } else if (jqXHR.status == 500) {
                        msg = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror') {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        msg = 'Time out error.';
                    } else if (exception === 'abort') {
                        msg = 'Ajax request aborted.';
                    } else {
                        msg = 'Uncaught Error.\n' + jqXHR.responseText;
                    }
                    alert(msg);
                },
                success: function(data){
                    // alert(data);
                    // alert(data.length);
                    if(data.search(' "error": ') != -1){
                            var errorCode;
                            //alert("Got error");
                            if(data.search("API key not valid") != -1){
                                errorCode = 403;
                            } else if(data.search("Internal server error") != -1){
                                errorCode = 500;
                            } else if(data.search("out of resource quota") != -1){
                                errorCode = 429;
                            } else if(data.search("Service Unavailable") != -1){
                                errorCode = 503;
                            } else if(data.search("Gateway Timeout") != -1){
                                errorCode = 504;
                            } else if(data.search("Request contains an invalid argument") != -1)
                                errorCode = 400;

                            switch(errorCode){
                                case 403 : alert("ERROR 403: API key is not valid");
                                break;
                                case 500 : alert("ERROR 500: Internal Server Error");
                                break;
                                case 429 : alert("ERROR 429: Service out of resource quota");
                                break;
                                case 503 : alert("ERROR 503: Service Unavailable");
                                break;
                                case 504 : alert("ERROR 504: Gateway Timeout");
                                break;
                                case 400 : alert("ERROR 400: Server did not receive POST request");
                            }
                        } else if(data.length != 3){
                        //alert(data.substr(44,18));
                        // alert(data.length);
                            var threatType = data.charAt(44);
                            //alert(threatType);
                            switch(threatType){
                                case 'S' :
                                        var selection = confirm("PHISHING WEBSITE DETECTED!!! (Press OK to close the page)");
                                        if(selection){
                                            chrome.tabs.remove(tabId);
                                        }
                                        break;
                                case 'M' :
                                        var selection = confirm("MALWARE DETECTED!!! (Press OK to close the page)");
                                        if(selection){
                                            chrome.tabs.remove(tabId);
                                        }
                                        break;
                            }
                        }else{
                            //alert("Safe");

                        }
            
                
                    }
            })
        }else {
            //alert("Nope");
        }
    }
})
        
    