
window.onload = () => {
    chrome.storage.local.get(null, function(storage){
        if (storage.lamoda.status && storage.lamoda.aco){(async function() {
            // ---------------------- ATC ALL SIZES
            let value = `; ${document.cookie}`;
            let parts = value.split(`; ${'csrftoken'}=`);
            if (parts.length === 2){
                var csrftoken = parts.pop().split(';').shift()
            }

            let sizes = document.querySelector(".ii-select__scroll .ii-select__column").querySelectorAll("div")

            for (size of sizes){
                await fetch('https://www.lamoda.ru/cart/add/'+size.dataset.value, {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'same-origin',
                    headers: {
                        'X-CSRFToken': csrftoken
                    }
                })
            }
            // --------------------------------------
            let data = {
                "city_aoid": storage.profiles[storage.lamoda.profile]["country"].split(" ")[1],
                "region_aoid": storage.profiles[storage.lamoda.profile]["country"].split(" ")[0],
                "customer": {
                  "email": storage.profiles[storage.lamoda.profile]["email"],
                  "first_name": storage.profiles[storage.lamoda.profile]["name"].split(" ")[1],
                  "last_name": storage.profiles[storage.lamoda.profile]["name"].split(" ")[0],
                  "phone": "+"+storage.profiles[storage.lamoda.profile]["phone"].replaceAll("-","").replace(")","").replace("(",""),
                  "middle_name": ""
                },
                "address": {
                  "apartment": "",
                  "region": storage.profiles[storage.lamoda.profile]["state"],
                  "region_aoid": storage.profiles[storage.lamoda.profile]["country"].split(" ")[0],
                  "city": storage.profiles[storage.lamoda.profile]["city"],
                  "city_aoid": storage.profiles[storage.lamoda.profile]["country"].split(" ")[1]
                },
                "delivery": {
                  "type": "pickup",
                  "service_level_code": "economy",
                  "pickup_code": storage.profiles[storage.lamoda.profile]["address1"],
                  "pickup_type": "lamoda",
                  "pickup_id": storage.profiles[storage.lamoda.profile]["address2"],
                  "interval_id": "0"
                },
                "payment_methods": [
                  {
                    "cart_package_id": "1___1",
                    "payment_method_code": "PaytureVTB"
                  }
                ],
                "device_data": {
                  "adid": null,
                  "app_version": null,
                  "platform": null,
                  "platform_version": null,
                  "device_type": null,
                  "device_info": null,
                  "screen_info": null,
                  "local_datetime": null
                },
                "location": "a.checkout_sub",
                "checkout_type": "full",
                "subscribe": false,
                "note": "",
                "is_phone_verification_supported": true
            }
            await fetch("https://www.lamoda.ru/api/v1/delivery/intervals?country=ru&city_aoid="+storage.profiles[storage.lamoda.profile]["country"].split(" ")[1]+"&delivery_type=pickup&service_level_code=plus&pickup_code="+storage.profiles[storage.lamoda.profile]["address1"]+"&pickup_id="+storage.profiles[storage.lamoda.profile]["address2"],
            {
                method: "GET",
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "content-type": "application/json",
                    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                mode: "cors"
            })
            .then(response => response.json())
            .then(intervalData => {
                for (interval of intervalData){
                    if (interval["intervals"][0]["is_available"]){
                        data["delivery"]["interval_id"] = interval["intervals"][0]["id"]
                        fetch("https://www.lamoda.ru/api/v1/orders/create", {
                            method: "POST",
                            headers: {
                                "accept": "application/json, text/plain, */*",
                                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                                "content-type": "application/json",
                                "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin"
                            },
                            referrer: "https://www.lamoda.ru/checkout/cart/",
                            referrerPolicy: "unsafe-url",
                            body: JSON.stringify(data),
                            mode: "cors"
                        })
                        .then(response => response.json())
                        .then(data => {
                            let item = data.orders[0]["items"][0]["short_sku"]
                            let sizes = ""
                            for (i of data.orders[0]["items"]){
                                sizes += i["size_ru_title"] + "\n"
                            }
                            chrome.runtime.sendMessage({message: "publicSuccess", status: "Successfully checked out!", site: window.location.hostname, item: item, size: sizes}, function(response){});
                            chrome.runtime.sendMessage({message: "privateSuccess", status: "Successfully checked out!", site: window.location.hostname, item: item, size: sizes, profile: storage.lamoda.profile, orderId: "["+data.orders[0]["order_number"]+"]("+data.orders[0]["payment"]["prepayment"]["payment_url"]+")"}, function(response){});
                        })
                        break;
                    }
                }
            })
        })();
        };
    });
};
