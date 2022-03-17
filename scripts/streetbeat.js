chrome.storage.local.get(null, function(storage){
    profile = {
        "firstName": storage.profiles[storage.streetbeat.profile]["name"].split(" ")[1],
        "lastName": storage.profiles[storage.streetbeat.profile]["name"].split(" ")[0],
        "middleName": storage.profiles[storage.streetbeat.profile]["name"].split(" ")[2],
        "city": storage.profiles[storage.streetbeat.profile]["city"],
        "address": storage.profiles[storage.streetbeat.profile]["address1"],
        "zip": storage.profiles[storage.streetbeat.profile]["zip"],
        "payment": storage.profiles[storage.streetbeat.profile]["address2"],
        "phone": "+"+storage.profiles[storage.streetbeat.profile]["phone"].replace('(', ' (').replace(')', ') '),
        "email": storage.profiles[storage.streetbeat.profile]["email"],
        "password": storage.profiles[storage.streetbeat.profile]["extra"],
    }
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
    async function getRandomItem(set) {
        let items = Array.from(set);
        return items[Math.floor(Math.random() * items.length)];
    }
    async function getStock(id){
        try {
            const response = await fetch(`https://street-beat.ru/local/templates/streetbeat/components/multisite/catalog.detail/street_beat/ajax.php?action=getShopsAvailability&productId=${id}&cityId=19`)
            return response.json()
        } catch {
            return await getStock(id)
        }
    }

    async function sendATC(sizeID, count=0){
        try {
            const response = await fetch(`https://street-beat.ru/restapi/v1/basket/${sizeID}`, {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                referrerPolicy: "strict-origin-when-cross-origin",
                body: "action=add&count=1&isDeltaQty=1&properties%5BSIZE_TYPE%5D=tab_rus",
                method: "POST",
                mode: "cors",
                credentials: "include"
            })
            return response.json()
        } catch {
            return await sendATC(sizeID, count++)
        }
    }
    async function getDelivery(address, token="044d358ebc2ea9d856fa30d03287edbb0d257a2f"){
        try {
            const response = fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
                headers: {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "authorization": `Token ${token}`,
                    "content-type": "application/json",
                },
                body: `{"restrict_value":false,"query":"${address}","count":1}`,
                method: "POST",
            })
            return (await response).json()
        } catch {
            return await getDelivery(address)
        }
    }
    async function sendPreorder(profile, addressData, basketData){
        let params = {
            t: "streetbeat_preorder_result",
            security: basketData["security"],
            VUE: true,
            gifts: false,
            deliveries: true,
            ONLINE: "Y",
            IS_SBP: "N",
            IS_YOOKASSA: "N",
            applepay: "N",
            id: basketData["id"],
            delivery: "2",
            STREET: addressData["data"]["street_with_type"],
            HOUSE: addressData["data"]["house"],
            ADDRESS: addressData["unrestricted_value"],
            FLAT: addressData["data"]["flat"] === null ? "" : addressData["data"]["flat"],
            comment: "",
            mkad: addressData["data"]["beltway_hit"] === "IN_MKAD" ? "Y" : "N",
            phone: profile["phone"],
            email: profile["email"],
            name: `${profile["firstName"]} ${profile["lastName"]} ${profile["middleName"]}`
        }
        try {
            const response = fetch("https://street-beat.ru/local/components/multisite/catalog.preorder/ajax.php", {
            "headers": {
                "accept": "application/json, text/plain, ",
                "accept-language": "ru-RU,ru;q=0.9",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "body": (new URLSearchParams(params)).toString(),
            "method": "POST",
            })
            return (await response).json()
        } catch {
            return await sendPreorder(profile, addressData, basketData)
        }
    }
    async function sendAuth(profile){
        let params = {
            NAME: `${profile["firstName"]} ${profile["lastName"]} ${profile["middleName"]}`,
            PERSONAL_PHONE: profile["phone"],
            EMAIL: profile["email"],
            REG_TYPE: "ORDER_REGISTERED",
            TYPE: "MEDIUM"
        }
        const response = fetch("https://street-beat.ru/order/auth/", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
            },
            "body": (new URLSearchParams(params)).toString(),
            "method": "POST",
        });
        return (await response)
    }
    async function sendCheckout(profile, basketData, sessid){
        let params = {
            DELIVERY_ID: "2",
            mode: "st_ignore_datetime",
            ADDRESS: profile["address"],
            STREET: profile["address"],
            HOUSE: profile["address"],
            BLOCK: "",
            FLAT: "",
            ZIP_CODE: profile["zip"],
            COMMENT: "",
            FIAS_DADATA: "", 
            FIAS_STREET: "",
            REGION_DADATA: "",
            SETTLEMENT: "",
            SETTLEMENT_CITY: "", 
            FULL_ADDRESS: "",
            DELIVERY_DATE: "",
            PAY_SYSTEM_ID: profile["payment"],
            IS_YOOKASSA_INSTALLMENTS: "N",
            IS_SBP: "N",
            certificateNumber: "",
            LAST_NAME: profile["lastName"],
            NAME: profile["firstName"],
            SECOND_NAME: profile["middleName"],
            USE_BONUSES: "",
            BONUS_USED_BALLS: "0",
            action: "order-create",
            ORDER_METHOD: "desktop-version",
            security: basketData["security"],
            sessid: sessid
        }
        const response = fetch("https://street-beat.ru/local/components/multisite/order/ajax.php", {
            "headers": {
              "accept": "application/json, text/javascript, */*; q=0.01",
              "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "body": (new URLSearchParams(params)).toString(),
            "method": "POST",
        })
        return (await response).json()
    }
    
    window.onload = () => {
        var productID = ''
        for (x of document.querySelectorAll('script')){
            if (x.src.startsWith('https://long-cdn.frisbuy.ru/')){
                productID = (new URL(x.src)).searchParams.get('sku')
                break
            }
        }
        var sessid = ''
        for (x of document.querySelectorAll('script')){
            if (x.innerHTML.startsWith('bxSession')){
                sessid = x.innerHTML.split('bxSession.Expand(5000, \'')[1].split('\', true')[0]
                break
            }
        }
        (async () => {
            var stock = await getStock(productID)
            var sizes = new Set()
            for (let shop of stock.shops){
                for (let size of Object.keys(shop.availableOffersCount)){
                    sizes.add(size)
                }
            }
            await sendNotification(`Adding to cart`)
            const basketData = await sendATC(await getRandomItem(sizes))
            await sendNotification(`Added to cart ${basketData["skuCode"]}`)
            await sendAuth(profile)
            // const deliveryData = await getDelivery(profile["address"])
            // const preorderResp = await sendPreorder(profile, deliveryData["suggestions"][0], basketData["basket"]["products"][Object.keys(basketData["basket"]["products"])[0]])
            // console.log(preorderResp)
            const orderResp = await sendCheckout(profile, basketData["basket"]["products"][Object.keys(basketData["basket"]["products"])[0]], sessid)
            if (orderResp["orderNumber"] !== "" && typeof orderResp["orderNumber"] !== "undefined"){
                await sendNotification('Checked out')
                await chrome.runtime.sendMessage({message: "publicSuccess", site: "Streetbeat", item: orderResp["adspire"]["OrderItems"][0]["pname"], size: basketData["skuCode"], time: (new Date()).toJSON().split('T')[1].slice(0, -1)}, function(response){});
                await chrome.runtime.sendMessage({message: "privateSuccess", status:'Successfully checked out!', site: "Streetbeat", item: orderResp["adspire"]["OrderItems"][0]["pname"], size: basketData["skuCode"], profile: storage.streetbeat.profile, orderId: `[${orderResp["orderNumber"]}](https://street-beat.ru/order/complete/${orderResp["orderNumber"]}/)`, image: document.querySelectorAll('img')[1].src}, function(response){});
                window.open(`https://street-beat.ru/order/complete/${orderResp["orderNumber"]}`, '_blank').focus();
            } else {
                await sendError('Checkout failed')
            }
        })()
    }
})

/*
    При получении - 6
    Онлайн - 8
    СБП - Y
*/