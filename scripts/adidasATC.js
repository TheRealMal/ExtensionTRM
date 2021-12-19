region = window.location.hostname.split('.')[window.location.hostname.split('.').length-1];
if (region == "com"){
    region = window.location.pathname.split('/')[1];
}
chrome.storage.local.get('adidas', function(storage){
    fetch('https://' + window.location.hostname + '/api/products/' + productID + '/availability', {
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        switch (storage.adidas.size.var){
            case 'smallest':
                if (data["variation_list"] !== undefined && typeof data["variation_list"][Symbol.iterator] === 'function'){
                    for (size of data["variation_list"]){
                        if (size["availability"] > 0){
                            let atcURI = `https://${window.location.hostname}/api/checkout/baskets/-/items`;
                            fetch(atcURI, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify([{
                                    "captchaResponse":"",
                                    "display_size":size["size"],
                                    "productId":size["sku"],
                                    "product_id":size["sku"].split("_")[0],
                                    "product_variation_sku":size["sku"],
                                    "quantity":1,
                                    "size":size["size"],
                                    "specialLaunchProduct":storage.adidas.isSpecial
                                }])
                            }).then(function (response){
                                if (response.status == 200){
                                    chrome.runtime.sendMessage({message: "publicSuccess", site: `ATC: ${window.location.hostname}`, item: productID, size: storage.adidas.size.UK  + " [Smallest]", time: (new Date()).toJSON().split('T')[1].slice(0, -1)}, function(response){});
                                    window.location = `https://${window.location.hostname}/delivery`;
                                }
                            });
                            break;
                        }
                    }
                }
                break;
            case 'largest':
                if (data["variation_list"] !== undefined && typeof data["variation_list"][Symbol.iterator] === 'function'){
                    for (size of data["variation_list"].slice().reverse()){
                        if (size["availability"] > 0){
                            let atcURI = `https://${window.location.hostname}/api/checkout/baskets/-/items`;
                            fetch(atcURI, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify([{
                                    "captchaResponse":"",
                                    "display_size":size["size"],
                                    "productId":size["sku"],
                                    "product_id":size["sku"].split("_")[0],
                                    "product_variation_sku":size["sku"],
                                    "quantity":1,
                                    "size":size["size"],
                                    "specialLaunchProduct":storage.adidas.isSpecial
                                }])
                            }).then(function (response){
                                if (response.status == 200){
                                    chrome.runtime.sendMessage({message: "publicSuccess", site: `ATC: ${window.location.hostname}`, item: productID, size: storage.adidas.size.UK  + " [Largest]", time: (new Date()).toJSON().split('T')[1].slice(0, -1)}, function(response){});
                                    window.location = `https://${window.location.hostname}/delivery`;
                                }
                            });
                            break;
                        }
                    }
                }
                break;
            default:
                if (data["variation_list"] !== undefined && typeof data["variation_list"][Symbol.iterator] === 'function'){
                    for (size of data["variation_list"]){
                        if ((size["sku"] === productID+'_'+storage.adidas.size.var) && size["availability"] > 0){
                            let atcURI = `https://${window.location.hostname}/api/checkout/baskets/-/items`;
                            fetch(atcURI, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify([{
                                    "captchaResponse":"",
                                    "display_size":size["size"],
                                    "productId":size["sku"],
                                    "product_id":size["sku"].split("_")[0],
                                    "product_variation_sku":size["sku"],
                                    "quantity":1,
                                    "size":size["size"],
                                    "specialLaunchProduct":storage.adidas.isSpecial
                                }])
                            }).then(function (response){
                                if (response.status == 200){
                                    chrome.runtime.sendMessage({message: "publicSuccess", site: `ATC: ${window.location.hostname}`, item: productID, size: storage.adidas.size.UK, time: (new Date()).toJSON().split('T')[1].slice(0, -1)}, function(response){});
                                    window.location = `https://${window.location.hostname}/delivery`;
                                }
                            });
                            break;
                        }
                    }
                }
                break;
        }
    });
})