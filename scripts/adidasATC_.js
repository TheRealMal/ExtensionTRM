function sendNotification(message){
    iziToast.show({
        title: '[TRM]',
        message: message,
        position: 'topRight',
        color: 'blue'
    });
};
function sendError(message){
    iziToast.show({
        title: '[TRM]',
        message: message,
        position: 'topRight',
        color: 'red'
    });
};
region = window.location.hostname.split('.')[window.location.hostname.split('.').length-1];
if (region == "com"){
    region = window.location.pathname.split('/')[1];
}
chrome.storage.local.get('adidas', function(storage){
    let atcURI = `https://${window.location.hostname}/api/checkout/baskets/-/items`;
    fetch(atcURI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
            "captchaResponse":"",
            "productId":`${productID}_${storage.adidas.size.var}`,
            "product_id":productID,
            "product_variation_sku":`${productID}_${storage.adidas.size.var}`,
            "quantity":1,
            "specialLaunchProduct":true
        }]),
        mode: 'cors',
        credentials: 'include'
    }).then(function (response){
        if (response.status == 200){
            let res = (typeof response.json()["shipmentList"] !== "undefined") ? response.json()["shipmentList"][0]["productLineItemList"] : [];
            res.forEach(item => {
                if (item["productId"] === `${productID}_${storage.adidas.size.var}`){
                    chrome.runtime.sendMessage({message: "publicSuccess", site: `ATC: ${window.location.hostname}`, item: productID, size: storage.adidas.size.UK, time: (new Date()).toJSON().split('T')[1].slice(0, -1)}, function(response){});
                    window.location = `https://${window.location.hostname}/delivery`;
                }
            })
            sendError(`Failed to cart ${productID} - ${storage.adidas.size.UK}`)
        } else {
            sendError(`Failed to cart ${productID} - ${storage.adidas.size.UK}`)
        }
    });
})