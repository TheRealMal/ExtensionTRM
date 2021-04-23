/*
chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab){
        if (changeInfo.status == "unloaded"){
            if (tab.url.indexOf("https://www.adidas.com.tr/on/demandware.store/Sites-adidas-TR-Site/tr_TR/") != -1){
                chrome.tabs.executeScript({file: "scripts/adidasTR.js"});
            }
        }
    }
);
*/
/*
function sendWebhook(status, site, item, size, image="https://i.imgur.com/Csera95.png"){
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
                    "color": 9240739,
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
                        "url": image
                    }
                }]
            })
        }
    );
}
*/
function sendWebhook(status,site,item,size,image="https://i.imgur.com/Csera95.png"){fetch("https://discord.com/api/webhooks/719856404453785721/Vb9vhq5sGPbQUOKZZYZsKolfd9lSWzZ-aIgQ1sAn7AADVDcwabdMhEZFZ92PqOskauX_",{method:'POST',headers:{'Content-Type':'application/json',},body:JSON.stringify({"content":null,"embeds":[{"title":status,"color":9240739,"fields":[{"name":"Site","value":site},{"name":"Item","value":item},{"name":"Size","value":size}],"footer":{"text":"TheRealMal EXT","icon_url":"https://i.imgur.com/Csera95.png"},"thumbnail":{"url":image}}]})})};
function sendPrivateWebhook({webhookLink,status,site,item,size,profile,orderId="N/A",image="https://i.imgur.com/Csera95.png"}={}){fetch(webhookLink,{method:'POST',headers:{'Content-Type':'application/json',},body:JSON.stringify({"content":null,"embeds":[{"title":status,"color":9240739,"fields":[{"name":"Site","value":site},{"name":"Item","value":item},{"name":"Size","value":size},{"name":"Profile","value":"||"+profile+"||"},{"name":"Order","value":"||"+orderId+"||"}],"footer":{"text":"TheRealMal EXT","icon_url":"https://i.imgur.com/Csera95.png"},"thumbnail":{"url":image}}]})})};

chrome.webRequest.onCompleted.addListener(
    function (requestDetails){
        chrome.storage.local.get('adidas', function(storage){
            if (storage.adidas.status && storage.adidas.atc){
                chrome.tabs.get(requestDetails.tabId, function(tab) {
                    let tabUrl = new URL(tab.url);
                    let excludePaths = ["/", "/us", "/us/", "/tr", "/tr/", "/uk", "/uk/", "/ru", "/ru/", "/th", "/th/", "/au", "/au/"]
                    if (tabUrl.pathname.indexOf('/cart') === -1 && tabUrl.pathname.indexOf('/confirmation') === -1  && !excludePaths.includes(tabUrl.pathname) && requestDetails.statusCode === 200){
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
chrome.webRequest.onCompleted.addListener(
    function (requestDetails){
        chrome.storage.local.get('adidas', function(storage){
            if (storage.adidas.status && (storage.adidas.af || storage.adidas.aco)){
                chrome.tabs.executeScript(requestDetails.tabId, {code: `chrome.runtime.sendMessage({message:"publicSuccess",status:"Successfully checked out!",site:window.location.hostname,item:document.querySelectorAll('div[data-auto-id="glass-order-summary-line-item-title"]')[0].innerHTML,size:document.querySelector('div[data-auto-id="glass-order-summary-line-item-attributes"]').children[1].getElementsByTagName("span")[1].innerHTML, image: document.querySelector('img[data-auto-id="glass-order-summary-line-item-image"]').src},function(e){})`}, function(){})
                chrome.tabs.executeScript(requestDetails.tabId, {code: `chrome.storage.local.get('adidas', function(storage){chrome.runtime.sendMessage({message: "privateSuccess",status: "Successfully checked out!",site: window.location.hostname,item: document.querySelectorAll('div[data-auto-id="glass-order-summary-line-item-title"]')[0].innerHTML,size: document.querySelector('div[data-auto-id="glass-order-summary-line-item-attributes"]').children[1].getElementsByTagName("span")[1].innerHTML,image: document.querySelector('img[data-auto-id="glass-order-summary-line-item-image"]').src,profile: storage.adidas.profile.ru,orderId: document.querySelector('a[data-auto-id="order-number"]').innerHTML}, function(e) {})})`}, function(){})
            };
        })
    },
    {
        urls: [
            "https://www.adidas.ru/api/checkout/orders/*"
        ]
    }
);

chrome.webRequest.onCompleted.addListener(
    function (requestDetails){
        chrome.storage.local.get('adidas', function(storage){
            if (storage.adidas.status && (storage.adidas.af || storage.adidas.aco)){
                chrome.tabs.executeScript(requestDetails.tabId, {code: `chrome.runtime.sendMessage({message: "publicSuccess",status: "Successfully checked out!",site: window.location.hostname,item: document.querySelector('a.name').innerHTML,size: document.querySelector('div.attribute_size > span.value').innerHTML,image: document.querySelector('div.productimg_container > a > img').src}, function(e) {})`}, function(){})
                chrome.tabs.executeScript(requestDetails.tabId, {code: `chrome.storage.local.get('adidas', function(storage) {chrome.runtime.sendMessage({message: "privateSuccess",status: "Successfully checked out!",site: window.location.hostname,item: document.querySelector('a.name').innerHTML,size: document.querySelector('div.attribute_size > span.value').innerHTML,image: document.querySelector('div.productimg_container > a > img').src,profile: storage.adidas.profile.tr,orderId: document.querySelector('p.order-description > a').innerHTML}, function(e) {})})`}, function(){})
            };
        })
    },
    {
        urls: [
            "https://www.adidas.com.tr/on/demandware.store/Sites-adidas-TR-Site/tr_TR/COSummary2-ShowConfirmation"
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
                if (request.image){
                    sendWebhook(request.status, request.site, request.item, request.size, request.image); 
                }
                else{
                    sendWebhook(request.status, request.site, request.item, request.size);
                }
                sendResponse('success');
            case "privateSuccess":
                if (request.profile !== undefined && request.orderId !== "N/A"){
                    chrome.storage.local.get('discordWebhook', function(storage){
                        sendPrivateWebhook({
                            webhookLink: storage.discordWebhook,
                            status: request.status,
                            site: request.site,
                            item: request.item,
                            size: request.size,
                            profile: request.profile,
                            orderId: request.orderId,
                            image: request.image});
                    });
                }
                sendResponse('success');
            default:
                break;
        };
    }
);