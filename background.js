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
        chrome.tabs.executeScript(tabId, {file: "scripts/adidasYeezy.js"});
    },
    {
        urls: [
            "https://www.adidas.ru/api/products/*/availability",
            "https://www.adidas.com.tr/api/products/*/availability"
        ]
    }
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.message){
            case "authorize":
                if (request.key == "therealmal"){
                    chrome.browserAction.setPopup({popup: '/home.html'});
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