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
    async function getRandomItem(object) {
        let items = Object.keys(object);
        return items[Math.floor(Math.random() * items.length)];
    }
    async function getStock(id){
        try {
            const response = await fetch(`https://street-beat.ru/local/components/multisite/account.favorites/ajax.php?id=${id}&action=add&type=account&template=account_favorite_list`)
            var parser = new DOMParser();
	        var responseHTML = parser.parseFromString(await response.text(), 'text/html');
            for (item of responseHTML.querySelectorAll("div.segmentstream_product")){
                if (item.getAttribute('data-product-id') === id.toString()){
                    var sizes = {}
                    for (let size of item.querySelector("ul[data-size-type=\"tab_us\"]").querySelectorAll("li")){
                        if (size.classList.length === 0){
                            size = size.querySelector("input")
                            sizes[size.getAttribute("data-size")] = size.getAttribute("data-sku-id")
                        }
                    }
                    return {
                        name: item.getAttribute("data-product-name"),
                        sizes: sizes,
                        img: item.querySelector("div.js-popup-open").getAttribute("data-image")
                    }
                }
            }
            return {}
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
    async function main(storage, productID, sessid){
        var productDetails = await getStock(productID)
        await sendNotification(`Adding to cart`)
        var size = await getRandomItem(productDetails["sizes"])
        const basketData = await sendATC(productDetails["sizes"][size])
        await sendNotification(`Added to cart ${basketData["skuCode"]}`)
        await sendAuth(profile)
        await sendNotification(`Checking out`)
        const orderResp = await sendCheckout(profile, basketData["basket"]["products"][Object.keys(basketData["basket"]["products"])[0]], sessid)
        if (orderResp["orderNumber"] !== "" && typeof orderResp["orderNumber"] !== "undefined"){
            await sendNotification('Checked out')
            await chrome.runtime.sendMessage({message: "publicSuccess", site: "Streetbeat", item: productDetails["name"], size: `${size} US`, time: (new Date()).toJSON().split('T')[1].slice(0, -1)}, function(response){});
            await chrome.runtime.sendMessage({message: "privateSuccess", status:'Successfully checked out!', site: "Streetbeat", item: productDetails["name"], size: `${size} US`, profile: storage.streetbeat.profile, orderId: `[${orderResp["orderNumber"]}](https://street-beat.ru/order/complete/${orderResp["orderNumber"]}/)`, image: productDetails["img"]}, function(response){});
            window.open(`https://street-beat.ru/order/complete/${orderResp["orderNumber"]}`, '_blank');
        } else {
            await sendError('Checkout failed')
        }
        if (storage.streetbeat.aco_loop){
            await main(storage, productID, sessid)
        }
    }
    if (storage.streetbeat.status && storage.streetbeat.aco){
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
                await main(storage, productID, sessid)
            })()
        }
    }
})