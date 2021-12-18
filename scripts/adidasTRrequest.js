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
adyenLib.type = 'text/javascript'
adyenLib.src = 'https://live.adyen.com/hpp/js/df.js'
document.body.appendChild(adyenLib)
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

chrome.storage.local.get(null, function(storage){
    const sitepath = window.location.pathname.startsWith('/tr') ? '?sitePath=tr' : ''
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
    }

    let atcURI = `https://${window.location.hostname}/api/checkout/baskets/-/items${sitepath}`;
    fetch(atcURI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
            "productId":`${productID}_${storage.adidas.size.var}`,
            "product_id":productID,
            "product_variation_sku":`${productID}_${storage.adidas.size.var}`,
            "quantity":1,
            "specialLaunchProduct":storage.adidas.isSpecial
        }]),
        mode: 'cors',
        credentials: 'include'
    }).then(function (response){
        if (response.status == 200){
            response.json().then(r => {
                let res = (typeof r["shipmentList"] !== "undefined") ? r["shipmentList"][0]["productLineItemList"] : [];
                res.forEach(item => {
                    if (item["productId"] === `${productID}_${storage.adidas.size.var}`){
                        (async () => {
                            await sendNotification(`Added to cart ${productID} - ${storage.adidas.size.UK}`)
                            await sendNotification(`Getting shipping rates`)
                            const response = await fetch(`https://${window.location.hostname}/api/chk/baskets/${r["basketId"]}/shipping_methods${sitepath}`)
                            const authToken = response.headers.get('authorization')
                            const shippings = await response.json()
                            await sendNotification(`Posting shipping details`)
                            await fetch(`https://${window.location.hostname}/api/chk/baskets/${r["basketId"]}${sitepath}`, {
                                method: 'PATCH',
                                body: JSON.stringify({
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
                                        "carrierCode": shippings[0]["carrierCode"],
                                        "carrierServiceCode": shippings[0]["carrierServiceCode"],
                                        "shipNode": shippings[0]["shipNode"],
                                        "collectionPeriod": `${new Date(shippings[0]["collection"]["from"]).toISOString()},${new Date(shippings[0]["collection"]["to"]).toISOString()}`,
                                        "deliveryPeriod": `${new Date(shippings[0]["delivery"]["from"]).toISOString()},${new Date(shippings[0]["delivery"]["to"]).toISOString()}`
                                    }]
                                }),
                                headers: {
                                    'checkout-authorization': authToken,
                                    'content-type': 'application/json'
                                }
                            })
                            await sendNotification(`Getting adyen`)
                            const responseAdyen = await fetch('https://sresellera.ru/2.0/adyen?' + new URLSearchParams({
                                cardNumber : profile["cardNumber"],
                                cvc : profile["cardCVC"],
                                holderName : profile["cardName"],
                                expiryMonth : profile["cardMonth"],
                                expiryYear : profile["cardYear"],
                            }), {method: 'POST', mode: 'cors'})
                            const adyenToken = await responseAdyen.json()
                            console.log(adyenToken["data"])
                            document.querySelector('input#hiddenAdyenInput').value
                            const fingerprint = document.querySelector('input#hiddenAdyenInput').value
                            await sendNotification(`Checking out`)
                            const sendCheckoutResponse = await fetch(`https://${window.location.hostname}/api/chk/orders${sitepath}`, {
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
                            }).then(r => r.json())
                            await sendNotification(`Opening 3DS`)
                            const sendTinkoff = await post('https://secure.tinkoff.ru/acs/auth/start.do', {
                                'PaReq': sendCheckoutResponse["paRedirectForm"]["formFields"]["PaReq"],
                                'MD': sendCheckoutResponse["paRedirectForm"]["formFields"]["MD"],
                                'TermUrl': `https://${window.location.hostname}/en/payment/callback/CREDIT_CARD/${r["basketId"]}/adyen?orderId=${sendCheckoutResponse["orderId"]}&encodedData=${sendCheckoutResponse["paRedirectForm"]["formFields"]["EncodedData"]}&result=AUTHORISED`
                            }, method='post')
                        })()
                    }
                })

            })
        }
    });
})
