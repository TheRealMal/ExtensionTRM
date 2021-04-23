const adidasDomains = {
    'ru' : 'https://www.adidas.ru/delivery',
    'uk' : 'https://www.adidas.co.uk/delivery',
    'us' : 'https://www.adidas.com/us/delivery',
    'th' : 'https://www.adidas.co.th/on/demandware.store/Sites-adidas-TH-Site/th_TH/COShipping-Show',
    'tr' : 'https://www.adidas.com.tr/on/demandware.store/Sites-adidas-TR-Site/tr_TR/COShipping-Show',
    'au' : 'https://www.adidas.com.au/on/demandware.store/Sites-adidas-AU-Site/en_AU/COShipping-Show'
};

let region = window.location.hostname.split('.')[window.location.hostname.split('.').length-1];
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
                for (size of data["variation_list"]){
                    if (size["availability"] > 0){
                        /*
                        let atcURI = 'https://' + window.location.hostname + '/on/demandware.store/Sites-adidas-'+region.toUpperCase()+'-Site/'+region+'-'+region.toUpperCase()+'/Cart-MiniAddProduct?layer=Add%20To%20Bag%20overlay&pid='+size["sku"]+'&Quantity=1&masterPid='+productID+'add-to-cart-button=';
                        fetch(atcURI).then(function (response){
                            if (response.status == 200){
                                chrome.runtime.sendMessage({message: "publicSuccess", status: "Successfully added to cart!", site: window.location.hostname, item: productID, size: size["size"] + " [Smallest]"}, function(response){});
                                window.location = adidasDomains[region];
                            }
                        });
                        */
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
                                "size":size["size"]
                            }])
                        }).then(function (response){
                            if (response.status == 200){
                                chrome.runtime.sendMessage({message: "publicSuccess", status: "Successfully added to cart!", site: window.location.hostname, item: productID, size: size["size"]  + " [Smallest]"}, function(response){});
                                window.location = adidasDomains[region];
                            }
                        });
                        break;
                    }
                }
                break;
            case 'largest':
                for (size of data["variation_list"].slice().reverse()){
                    if (size["availability"] > 0){
                        /*
                        let atcURI = 'https://' + window.location.hostname + '/on/demandware.store/Sites-adidas-'+region.toUpperCase()+'-Site/'+region+'-'+region.toUpperCase()+'/Cart-MiniAddProduct?layer=Add%20To%20Bag%20overlay&pid='+size["sku"]+'&Quantity=1&masterPid='+productID+'add-to-cart-button=';
                        fetch(atcURI).then(function (response){
                            if (response.status == 200){
                                chrome.runtime.sendMessage({message: "publicSuccess", status: "Successfully added to cart!", site: window.location.hostname, item: productID, size: size["size"] + " [Largest]"}, function(response){});
                                window.location = adidasDomains[region];
                            }
                        });
                        */
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
                                "size":size["size"]
                            }])
                        }).then(function (response){
                            if (response.status == 200){
                                chrome.runtime.sendMessage({message: "publicSuccess", status: "Successfully added to cart!", site: window.location.hostname, item: productID, size: size["size"]  + " [Smallest]"}, function(response){});
                                window.location = adidasDomains[region];
                            }
                        });
                        break;
                    }
                }
                break;
            default:
                for (size of data["variation_list"]){
                    if ((size["sku"] === productID+'_'+storage.adidas.size.var) && size["availability"] > 0){
                        /*
                        let atcURI = 'https://' + window.location.hostname + '/on/demandware.store/Sites-adidas-'+region.toUpperCase()+'-Site/'+region+'-'+region.toUpperCase()+'/Cart-MiniAddProduct?layer=Add%20To%20Bag%20overlay&pid='+size["sku"]+'&Quantity=1&masterPid='+productID+'add-to-cart-button=';
                        fetch(atcURI).then(function (response){
                            if (response.status == 200){
                                chrome.runtime.sendMessage({message: "publicSuccess", status: "Successfully added to cart!", site: window.location.hostname, item: productID, size: size["size"]}, function(response){});
                                window.location = adidasDomains[region];
                            }
                        });
                        */
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
                                "size":size["size"]
                            }])
                        }).then(function (response){
                            if (response.status == 200){
                                chrome.runtime.sendMessage({message: "publicSuccess", status: "Successfully added to cart!", site: window.location.hostname, item: productID, size: size["size"]  + " [Smallest]"}, function(response){});
                                window.location = adidasDomains[region];
                            }
                        });
                        break;
                    }
                }
                break;
        }
    });
})