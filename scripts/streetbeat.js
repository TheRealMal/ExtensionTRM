chrome.storage.local.get(null, function(storage){
    profile = {
        "firstName": storage.profiles[storage.streetbeat.profile]["name"].split(" ")[1],
        "lastName": storage.profiles[storage.streetbeat.profile]["name"].split(" ")[0],
        "middleName": storage.profiles[storage.streetbeat.profile]["name"].split(" ")[2],
        "address": storage.profiles[storage.streetbeat.profile]["address1"],
        "payment": storage.profiles[storage.streetbeat.profile]["address2"],
        "phone": "+"+storage.profiles[storage.streetbeat.profile]["phone"],
        "email": storage.profiles[storage.streetbeat.profile]["email"],
        "password": storage.profiles[storage.streetbeat.profile]["extra"],
    }
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

    async function sendATC(sizeID){
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
    }
    async function getDelivery(address, token="044d358ebc2ea9d856fa30d03287edbb0d257a2f"){
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
    }

    async function getDeliveryTime(city, fias){
        // city - %D0%A5%D0%B8%D0%BC%D0%BA%D0%B8
        // fias - df518993-660b-4a0b-ae72-abf207045957
        const response = fetch("https://street-beat.ru/local/components/multisite/order.delivery/ajax.php", {
            headers: {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: `action=delivery_settings&city=${encodeURIComponent(city)}&fias=${fias}`,
            method: "POST",
        })
        return (await response).json()
    }
    async function sendPreorder(profile, addressData, basketData, sizeID){
        var params = {
            t: "streetbeat_preorder_result",
            security: "06e70a8c07faa1cc1af3d1d1905cf13390d4d215905cd215d213897ee311e311", // from basketData
            VUE: true,
            gifts: false,
            deliveries: true,
            ONLINE: "Y",
            IS_SBP: "N",
            IS_YOOKASSA: "N",
            applepay: "N",
            id: sizeID,  // from basketData
            delivery: "2", // from addressData
            STREET: "ул Кузнецкий Мост",  // from addressData
            HOUSE: "6/3", // from addressData
            ADDRESS: "125009, г Москва, Тверской р-н, ул Кузнецкий Мост, д 6/3", // from addressData
            FLAT: "", // from addressData
            comment: "",
            mkad: "Y", // from addressData
            phone: profile["phone"].replace('(', ' (').replace(')', ') '),
            email: profile["email"],
            name: `${profile["firstName"]} ${profile["lastName"]} ${profile["middleName"]}`
        }
        fetch("https://street-beat.ru/local/components/multisite/catalog.preorder/ajax.php", {
          "headers": {
            "accept": "application/json, text/plain, ",
            "accept-language": "ru-RU,ru;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          "body": (new URLSearchParams(params)).toString(),
          "method": "POST",
        })
    }
    async function sendCheckout(){

    }
    window.onload = () => {
        var productID = ''
        for (x of document.querySelectorAll('script')){
            if (x.src.startsWith('https://long-cdn.frisbuy.ru/')){
                productID = (new URL(x.src)).searchParams.get('sku')
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
            // Random
            const basketData = await sendATC(await getRandomItem(sizes))
            const deliveryData = await getDelivery(address)
            const deliveryTime = await getDeliveryTime(deliveryData["suggestions"][0]["data"]["city"], deliveryData["suggestions"][0]["data"]["settlement_fias_id"])
            // Redirect to delivery page
            window.location.href = 'https://street-beat.ru/order/delivery/'
            // https://street-beat.ru/order/complete/ORDER_ID
        })()
    }
})
// 9812314212
// testtrm@gmail.com

/* no need
fetch("https://street-beat.ru/local/components/multisite/fast.order/auth.php", {
  "headers": {
    "accept": "application/json, text/plain",
    "accept-language": "ru-RU,ru;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  },
  "body": "NAME=%D0%A2%D0%B5%D1%81%D1%82&LAST_NAME=%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2&SECOND_NAME=%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D0%B8%D1%87&EMAIL=testtrm%40gmail.com&PERSONAL_PHONE=%2B7+%28981%29+231-42-12",
  "method": "POST",
});
*/


/*
При получении - 6
Онлайн - 8
СБП - Y
/*

/*
ATC RESPONSE
{
    "code": "CW0913-004",
    "skuCode": "CW0913-004-6",
    "product_id": "3831362",
    "sku_id": "3831368",
    "arr_prod": {
        "name": "\u041a\u0440\u043e\u0441\u0441\u043e\u0432\u043a\u0438 Delta 2 \u043e\u0442 Jordan (CW0913-004)",
        "price": "15 699",
        "size": "35,5",
        "img": "\/upload\/iblock\/c18\/c184619c9083ed39d73cec767f000b32.jpg",
        "id": "3831362"
    },
    "status": true,
    "id": 23364850,
    "basket": {
        "discount": 0,
        "sum": 15699,
        "bonusSum": 0,
        "total": 15699,
        "action": "add",
        "usedBonuses": 0,
        "currentBonuses": 0,
        "actionSets": [],
        "products": {
            "23364850": {
                "id": "3831368",
                "price": 15699,
                "oldPrice": 15699,
                "quantity": "1",
                "total": 15699,
                "article": "CW0913-004-6",
                "available": true,
                "action_code": null,
                "kbt": false,
                "discount_price": 0,
                "parent_item": "",
                "security": "eae7b7a793ff68605780ef590696b1bba62348c5069648c58e2dbb106dc46dc4",
                "sort_index": "d17bb1913831368"
            }
        },
        "kbtfree": {
            "sum": 0,
            "enabled": false,
            "freefrom": 0,
            "free_allowed": false,
            "region_allowed": false,
            "real_free": null
        },
        "calculated": false,
        "deliveries": [{
            "type": "pickup",
            "date": "",
            "name": "\u0417\u0430\u0431\u0440\u0430\u0442\u044c \u0432 \u043c\u0430\u0433\u0430\u0437\u0438\u043d\u0435",
            "id": 4,
            "price": 0,
            "free_from": 50000,
            "shops": "5 \u043c\u0430\u0433\u0430\u0437\u0438\u043d\u043e\u0432",
            "minDays": 1
        }],
        "promocode": ""
    },
    "type": "plus",
    "quantity": 2,
    "label": "\u0418\u0437 \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0438 \u0442\u043e\u0432\u0430\u0440\u0430",
    "ddl": {
        "type": "cart",
        "time": 1647430031,
        "data": {
            "id": "1200627778",
            "currency": "RUB",
            "subtotal": 15699,
            "total": 15699,
            "totalBase": 15699,
            "lineItems": [{
                "product": {
                    "id": "3831362",
                    "skuCode": "3831368",
                    "mpnGroupCode": "CW0913-004",
                    "mpnCode": "CW0913-004-6",
                    "categoryGroupId": 200,
                    "categoryIdGmc": 300,
                    "name": "Jordan \u0416\u0435\u043d\u0441\u043a\u0438\u0435 \u043a\u0440\u043e\u0441\u0441\u043e\u0432\u043a\u0438 Jordan Delta 2",
                    "currency": "RUB",
                    "unitPrice": 15699,
                    "unitSalePrice": 15699,
                    "category": ["\u041a\u0430\u0442\u0430\u043b\u043e\u0433", "\u041e\u0431\u0443\u0432\u044c", "\u041a\u0440\u043e\u0441\u0441\u043e\u0432\u043a\u0438"],
                    "categoryId": "1323",
                    "description": "\u041a\u0440\u043e\u0441\u0441\u043e\u0432\u043a\u0438 Jordan Delta 2 \u2014 \u044d\u0442\u043e \u0441\u0432\u0435\u0436\u0438\u0439 \u0438 \u0441\u043c\u0435\u043b\u044b\u0439 \u0432\u0437\u0433\u043b\u044f\u0434 \u043d\u0430 \u0432\u0441\u0435 \u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435 \u043f\u0440\u0435\u0438\u043c\u0443\u0449\u0435\u0441\u0442\u0432\u0430: \u043f\u0440\u043e\u0447\u043d\u043e\u0441\u0442\u044c, \u043a\u043e\u043c\u0444\u043e\u0440\u0442 \u0438 \u0441\u0443\u0442\u044c \u0431\u0440\u0435\u043d\u0434\u0430 Jordan.\u041c\u044b \u043e\u0431\u043d\u043e\u0432\u0438\u043b\u0438 \u043b\u0438\u043d\u0438\u0438 \u0434\u0438\u0437\u0430\u0439\u043d\u0430 \u0438 \u0437\u0430\u043c\u0435\u043d\u0438\u043b\u0438 \u043d\u0435\u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u043a\u043e\u043c\u043f\u043e\u043d\u0435\u043d\u0442\u044b, \u043d\u043e \u0438\u0434\u0435\u044f \u043f\u0435\u0440\u0432\u044b\u0445 Delta \u043e\u0441\u0442\u0430\u043b\u0430\u0441\u044c \u043d\u0435\u0438\u0437\u043c\u0435\u043d\u043d\u043e\u0439.\u0412 \u044d\u0442\u0438\u0445 \u0434\u0432\u0443\u0445 \u043c\u043e\u0434\u0435\u043b\u044f\u0445 \u0441\u043e\u0447\u0435\u0442\u0430\u044e\u0442\u0441\u044f \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044e\u0449\u0438\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u0438 \u043f\u043e\u0447\u0442\u0438 \u043a\u043e\u0441\u043c\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0442\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u0438, \u0430 \u0442\u0430\u043a\u0436\u0435 \u0440\u0430\u0437\u043b\u0438\u0447\u043d\u044b\u0435 \u0442\u0435\u043a\u0441\u0442\u0443\u0440\u044b \u0438 \u0441\u0442\u0440\u043e\u0447\u043a\u0438 \u0434\u043b\u044f \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u044f \u043b\u0435\u0433\u0435\u043d\u0434\u0430\u0440\u043d\u043e\u0433\u043e \u043e\u0431\u0440\u0430\u0437\u0430, \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u0438\u0434\u0435\u0430\u043b\u044c\u043d\u043e \u043f\u043e\u0434\u043e\u0439\u0434\u0435\u0442 \u044e\u043d\u044b\u043c \u0438\u0441\u043a\u0430\u0442\u0435\u043b\u044f\u043c \u043f\u0440\u0438\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0439.",
                    "variant": "\u0416\u0435\u043d\u0441\u043a\u0438\u0435 \u043a\u0440\u043e\u0441\u0441\u043e\u0432\u043a\u0438 Jordan Delta 2 \u0420\u0430\u0437\u043c\u0435\u0440: 35,5 \u0426\u0432\u0435\u0442: ",
                    "size": "35,5",
                    "lowestCategory": "\u041a\u0440\u043e\u0441\u0441\u043e\u0432\u043a\u0438",
                    "lowestCategoryId": 1323,
                    "url": "https:\/\/street-beat.ru\/d\/krossovki-jordan-cw0913-004\/35,5\/",
                    "imageUrl": "https:\/\/street-beat.ru\/upload\/iblock\/c18\/c184619c9083ed39d73cec767f000b32.jpg",
                    "thumbnailUrl": "https:\/\/street-beat.ru\/upload\/iblock\/c18\/c184619c9083ed39d73cec767f000b32.jpg",
                    "reviews": [],
                    "rating": 0,
                    "stock": 5,
                    "conditions": [],
                    "collection": "Delta 2",
                    "gender": "\u0416\u0435\u043d\u0449\u0438\u043d\u044b",
                    "manufacturer": "Jordan",
                    "generated": 1647428305
                },
                "quantity": 1,
                "subtotal": 15699
            }]
        }
    },
    "small_basket": [{
        "id": "23364850",
        "product_id": "3831368",
        "name": "\u0416\u0435\u043d\u0441\u043a\u0438\u0435 \u043a\u0440\u043e\u0441\u0441\u043e\u0432\u043a\u0438 Jordan Delta 2",
        "title": "\u0416\u0435\u043d\u0441\u043a\u0438\u0435\u00a0\u043a\u0440\u043e\u0441\u0441\u043e\u0432\u043a\u0438 Jordan Jordan Delta 2",
        "img": "\/upload\/iblock\/c3a\/c3aebbc39f5fd0e5571b34658c3c0dbe.jpg",
        "url": "\/d\/krossovki-jordan-cw0913-004\/",
        "quantity": "1",
        "detail_page_url": "\/d\/krossovki-jordan-cw0913-004\/",
        "price": {
            "price": "15699",
            "price_old": "15699.0000",
            "currency": "RUB"
        },
        "size": {
            "size": "35,5 (RUS)",
            "sizeType": "rus",
            "sizeLabel": "RUS",
            "currentSize": "35,5"
        },
        "core_section_code": "obuv",
        "basketProductMax": 5
    }]
}
*/

/*
GET TIME RESPONSE
{
    "de": {
        "COMMON": {
            "SAP_DELIVERY_TYPE": "3I",
            "REGION": "mo",
            "REAL_NAME": "МО 4ех часовые, СПБ 3ех часовые + в течение дня (регионы)",
            "DESCRIPTION": "Описание доставки 3I",
            "PRICE": 500,
            "INTERVAL_CODE": "3I",
            "MAX_DAYS": 15,
            "MIN_DAYS": 3,
            "MIN_RC_DAYS": 3,
            "MIN_RM_DAYS": 3,
            "MIN_ORDER_SUM": 0,
            "ADD_PRICE_TO_DELIVERY_TO_REGIONS": 0,
            "TK_DATA": {
                "code": "cse",
                "tariff": "5a8ec125-92ac-11dc-86de-0015170f8c09",
                "tariffName": "Московская обл.",
                "price": 312,
                "cod": 1,
                "urgency": "18c4f207-458b-11dc-9497-0015170f8c09",
                "minTermOriginal": 2,
                "maxTermOriginal": 2
            },
            "RETAIL": true,
            "RC": true,
            "TIMES": [{
                "FROM": "10",
                "TO": "14"
            }, {
                "FROM": "14",
                "TO": "18"
            }, {
                "FROM": "18",
                "TO": "22"
            }, {
                "FROM": "10",
                "TO": "22"
            }],
            "METHOD": "COMMON",
            "FREE_FROM": 50000,
            "RC_AVAILABLE": true,
            "RM_AVAILABLE": true,
            "WHITELIST_PAYMENTS": [],
            "MIN_PRODUCT_QUANTITY": 0,
            "NAME": "Стандартная курьерская доставка",
            "DATE": "послезавтра (пятница, 18&nbsp;марта)",
            "DATE_MAXCOMMON": "2022-03-18",
            "UNAVAILABLE_PAYMENTS": [],
            "DELIVERY_TYPE": "RC",
            "DELIVERY_TYPE_AVAILABLE": "RC",
            "RING_ROAD_MIN": null,
            "RING_ROAD_MIN_RM": null
        }
    },
    "deliveries": {
        "common": {
            "min": 2,
            "max": 16,
            "price": 500,
            "ring_road_price": null,
            "interval_code": "3I",
            "ring_road_interval_code": null,
            "intervals": [{
                "FROM": "10",
                "TO": "14"
            }, {
                "FROM": "14",
                "TO": "18"
            }, {
                "FROM": "18",
                "TO": "22"
            }, {
                "FROM": "10",
                "TO": "22"
            }],
            "ring_road_intervals": null,
            "free_from": 50000,
            "date": "послезавтра (пятница, 18&nbsp;марта)",
            "delivery_type": "RC"
        }
    },
    "status": true,
    "options": {
        "SETTLEMENT": "Химки",
        "SETTLEMENT_REGION": "Московская",
        "SETTLEMENT_FIAS": "df518993-660b-4a0b-ae72-abf207045957",
        "CACHE_TIME": 0
    },
    "fastServiceData": {
        "ADD_PRICE_TO_DELIVERY_TO_REGIONS": 0,
        "DELIVERIES": {
            "2": {
                "ID": "2",
                "NAME": "Доставка",
                "ACTIVE": "Y",
                "DESCRIPTION": null,
                "SORT": "100",
                "LOGOTIP": null,
                "CURRENCY": "RUB",
                "TRACKING_PARAMS": false,
                "ALLOW_EDIT_SHIPMENT": "Y",
                "LID": null,
                "WEIGHT_FROM": "",
                "WEIGHT_TO": "",
                "ORDER_PRICE_FROM": "",
                "ORDER_PRICE_TO": "",
                "ORDER_CURRENCY": "",
                "PERIOD_FROM": 0,
                "PERIOD_TO": 0,
                "PERIOD_TYPE": null,
                "PRICE": 0,
                "STORE": "",
                "DATA": {
                    "COMMON": {
                        "SAP_DELIVERY_TYPE": "3I",
                        "REGION": "mo",
                        "REAL_NAME": "МО 4ех часовые, СПБ 3ех часовые + в течение дня (регионы)",
                        "DESCRIPTION": "Описание доставки 3I",
                        "PRICE": 500,
                        "INTERVAL_CODE": "3I",
                        "MAX_DAYS": 15,
                        "MIN_DAYS": 3,
                        "MIN_RC_DAYS": 3,
                        "MIN_RM_DAYS": 3,
                        "MIN_ORDER_SUM": 0,
                        "ADD_PRICE_TO_DELIVERY_TO_REGIONS": 0,
                        "TK_DATA": {
                            "code": "cse",
                            "tariff": "5a8ec125-92ac-11dc-86de-0015170f8c09",
                            "tariffName": "Московская обл.",
                            "price": 312,
                            "cod": 1,
                            "urgency": "18c4f207-458b-11dc-9497-0015170f8c09",
                            "minTermOriginal": 2,
                            "maxTermOriginal": 2
                        },
                        "RETAIL": true,
                        "RC": true,
                        "TIMES": [{
                            "FROM": "10",
                            "TO": "14"
                        }, {
                            "FROM": "14",
                            "TO": "18"
                        }, {
                            "FROM": "18",
                            "TO": "22"
                        }, {
                            "FROM": "10",
                            "TO": "22"
                        }],
                        "METHOD": "COMMON",
                        "FREE_FROM": 50000,
                        "RC_AVAILABLE": true,
                        "RM_AVAILABLE": true,
                        "WHITELIST_PAYMENTS": [],
                        "MIN_PRODUCT_QUANTITY": 0,
                        "NAME": "Стандартная курьерская доставка",
                        "DATE": "послезавтра (пятница, 18&nbsp;марта)",
                        "DATE_MAXCOMMON": "2022-03-18",
                        "UNAVAILABLE_PAYMENTS": []
                    }
                }
            },
            "4": {
                "ID": "4",
                "NAME": "В магазине",
                "ACTIVE": "Y",
                "DESCRIPTION": null,
                "SORT": "200",
                "LOGOTIP": null,
                "CURRENCY": "RUB",
                "TRACKING_PARAMS": false,
                "ALLOW_EDIT_SHIPMENT": "Y",
                "LID": null,
                "WEIGHT_FROM": "",
                "WEIGHT_TO": "",
                "ORDER_PRICE_FROM": "",
                "ORDER_PRICE_TO": "",
                "ORDER_CURRENCY": "",
                "PERIOD_FROM": 0,
                "PERIOD_TO": 0,
                "PERIOD_TYPE": null,
                "PRICE": 0,
                "STORE": "",
                "DATA": [{
                    "REGION": "mo",
                    "REAL_NAME": "Самовывоз",
                    "DESCRIPTION": null,
                    "PRICE": 0,
                    "MAX_DAYS": 1,
                    "MIN_DAYS": 1,
                    "FREE_FROM": 50000,
                    "NAME": "Забрать в магазине",
                    "DATE": "",
                    "DATE_MAXCOMMON": "2022-03-16",
                    "UNAVAILABLE_PAYMENTS": []
                }]
            },
            "pickup": {
                "DATA": {
                    "active": null,
                    "timeToAddDay": null,
                    "skuCount": null,
                    "skuProductCount": null,
                    "shipmentType": {
                        "0": "static",
                        "1": "static",
                        "NAME": null,
                        "DATE": null,
                        "DATE_MAXCOMMON": "2022-03-15"
                    },
                    "costForDeliveryFreeFrom": null,
                    "TIMES": null
                }
            },
            "7": {
                "ID": "7",
                "NAME": "Самовывоз из магазина",
                "ACTIVE": "Y",
                "DESCRIPTION": "PICKUP",
                "SORT": "100",
                "LOGOTIP": null,
                "CURRENCY": "RUB",
                "TRACKING_PARAMS": [],
                "ALLOW_EDIT_SHIPMENT": "Y",
                "LID": "",
                "WEIGHT_FROM": "",
                "WEIGHT_TO": "",
                "ORDER_PRICE_FROM": "",
                "ORDER_PRICE_TO": "",
                "ORDER_CURRENCY": "",
                "PERIOD_FROM": "0",
                "PERIOD_TO": "0",
                "PERIOD_TYPE": "D",
                "PRICE": 0,
                "STORE": "",
                "DATA": [{
                    "REGION": "mo",
                    "REAL_NAME": null,
                    "DESCRIPTION": null,
                    "PRICE": 0,
                    "MAX_DAYS": null,
                    "MIN_DAYS": null,
                    "FREE_FROM": 50000,
                    "NAME": null,
                    "DATE": null,
                    "DATE_MAXCOMMON": "2022-03-15",
                    "UNAVAILABLE_PAYMENTS": []
                }]
            },
            "PICKPOINT": {
                "ID": "PICKPOINT",
                "NAME": "Доставка PickPoint",
                "ACTIVE": "Y",
                "SORT": 100,
                "CURRENCY": "RUB",
                "ALLOW_EDIT_SHIPMENT": "Y",
                "DELIVERY_FROM_RC": true,
                "DELIVERY_FROM_RM": false,
                "DATA": {
                    "COMMON": {
                        "NAME": "Забрать в пункте выдачи",
                        "REAL_NAME": "Забрать в пункте выдачи",
                        "MIN_ORDER_SUM": 1,
                        "MAX_ORDER_SUM": 50000,
                        "FREE_FROM": 999999,
                        "DELIVERY_TYPE": "PICKPOINT",
                        "UNAVAILABLE_PAYMENTS": [],
                        "DATE": null,
                        "DATE_MAXCOMMON": "2022-03-15"
                    }
                }
            }
        },
        "PAYMENTS": {
            "0": 4,
            "1": 6,
            "2": 8,
            "9": 11
        },
        "DELIVERY_TO_GIFT_CARD": {
            "RETAIL": true,
            "RC": true,
            "PICKUP": true,
            "RCPICKUP": false,
            "PICKPOINT": true
        },
        "DELIVERY_TO_PAYMENT": {
            "RETAIL": [4, 6, 8],
            "RC": [4, 6, 8],
            "PICKUP": [4, 8],
            "RCPICKUP": [8],
            "PICKPOINT": [11, 4, 6, 8]
        },
        "ITEMS": {
            "CW5992-106-7": {
                "article": "CW5992-106-7",
                "price": "15699",
                "count": "1",
                "sum": "15699",
                "brand": "Jordan",
                "base_price": "0",
                "oldPrice": "15699",
                "discount": 0,
                "isServiceProgram": false
            }
        },
        "ACTION_SETS": []
    }
}
*/