/*chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab){
        if (changeInfo.status == "unloaded"){
            if (tab.url.indexOf("https://www.adidas.com.tr/on/demandware.store/Sites-adidas-TR-Site/tr_TR/") != -1){
                chrome.tabs.executeScript({file: "scripts/adidasTR.js"});
            }
        }
    }
);*/

function sendWebhook(status, site, item, size){
    fetch("https://discord.com/api/webhooks/719856404453785721/Vb9vhq5sGPbQUOKZZYZsKolfd9lSWzZ-aIgQ1sAn7AADVDcwabdMhEZFZ92PqOskauX_",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "content": null,
                "embeds": [{
                    "title": status,
                    "color": 7209090,
                    "fields": [
                        {
                            "name": "Site",
                            "value": site
                        },
                        {
                            "name": "Item",
                            "value": item
                        },
                        {
                            "name": "Size",
                            "value": size
                        }
                    ],
                    "footer": {
                        "text": "TheRealMal EXT",
                        "icon_url": "https://i.imgur.com/Csera95.png"
                    },
                    "thumbnail": {
                        "url": "https://i.imgur.com/Csera95.png"
                    }
                }]
            })
        }
    );
}

chrome.webRequest.onCompleted.addListener(
    function (requestDetails){
        chrome.storage.local.get('adidas', function(storage){
            if (storage.adidas.status && storage.adidas.atc){
                chrome.tabs.get(requestDetails.tabId, function(tab) { 
                    if (tab.url.indexOf('/cart') == -1 && requestDetails.statusCode == 200){
                        chrome.tabs.executeScript(requestDetails.tabId, {code: "var productID = '"+requestDetails.url.split('/')[5]+"';"}, function(){
                            chrome.tabs.executeScript(requestDetails.tabId, {file: "scripts/adidasATC.js"})
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
                    chrome.storage.local.set({license: request.key});
                    chrome.browserAction.setPopup({popup: 'pages/main/main.html'});
                    sendResponse('success');
                }
                else {
                    sendResponse('failed');
                }
                break;
            case "publicSuccess":
                sendWebhook(request.status, request.site, request.item, request.size);
                sendResponse('success');
            default:
                break;
        };
    }
);