chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
    if(changeInfo.status == 'complete')
    {
        if(tab.url.search("chrome://") == -1 && tab.url.search("file:///") == -1 ){

            //var tab = tabId;
            $.ajax({
                url: "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyA5GSownEZH2erzLW7CcU9VSVOLoUtfpTE",
                type: "POST",
                contentType : "application/json",
                data: JSON.stringify({
                    "client": {
                      "clientId": "superblocker",
                      "clientVersion": "1.0"
                    },
                    "threatInfo": {
                      "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
                      "platformTypes": ["WINDOWS"],
                      "threatEntryTypes": ["URL"],
                      "threatEntries": [{"url": tab.url}]
                    }
                }),
                error: function(result) {
                    var resultObj = JSON.parse(result.responseText);
                    // console.log(resultObj)
                    alert("ERROR " + resultObj.error.code + ": " + resultObj.error.message);
                },
                success: function(result){
                    if(!jQuery.isEmptyObject(result)){
                        // console.log(result);
                        var threat = "";
                        for(var i of result.matches){
                            threat += "[" + i.threatType + "] "
                        }
                        
                        if(confirm("THIS SITE CONTAINS " + threat + "\n(Press OK to close the page)")){
                            chrome.tabs.remove(tabId);
                        }
                    }
                }
            })
        }
    }
})