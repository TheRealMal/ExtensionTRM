chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab){
        if (changeInfo.status == "complete"){
            if (tab.url.indexOf("https://www.adidas.com.tr/on/demandware.store/Sites-adidas-TR-Site/tr_TR/") != -1){
                chrome.tabs.executeScript({file: "scripts/adidasTR.js"});
            }
        }
    }
);

chrome.webRequest.onCompleted.addListener(
    function (requestDetails){
        chrome.storage.local.get('adidas', function(storage){
            if (storage.adidas){
                chrome.tabs.get(requestDetails.tabId, function(tab) { 
                    if (tab.url.indexOf('/cart') == -1 && requestDetails.statusCode == 200){
                        chrome.tabs.executeScript(requestDetails.tabId, {code: "var productID = '"+requestDetails.url.split('/')[5]+"';"}, function(){
                            chrome.tabs.executeScript(requestDetails.tabId, {file: "scripts/adidasYeezy.js"})
                        });
                    };
                });
            };
        })
    },
    {
        urls: [
            "https://www.adidas.ru/api/products/*/availability",
            "https://www.adidas.co.uk/api/products/*/availability",
            "https://www.adidas.com/api/products/*/availability?sitePath=us",
            "https://www.adidas.co.th/api/products/*/availability?sitePath=th",
            "https://www.adidas.com.tr/api/products/*/availability?sitePath=tr",
            "https://www.adidas.com.au/api/products/*/availability",
        ]
    }
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.message){
            case "authorize":
                if (request.key == "therealmal"){
                    chrome.storage.local.set({license: request.key})
                    chrome.browserAction.setPopup({popup: 'pages/main/main.html'});
                    sendResponse('success');
                }
                else {
                    sendResponse('failed');
                }
                break;
            default:
                break;
        };
    }
);