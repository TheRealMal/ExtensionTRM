chrome.storage.local.get(null, function(storage){
    profile = {
        "firstName": storage.profiles[storage.km20.profile]["name"].split(" ")[1],
        "lastName": storage.profiles[storage.km20.profile]["name"].split(" ")[0],
        "country": storage.profiles[storage.km20.profile]["country"],
        "city": storage.profiles[storage.km20.profile]["city"],
        "address1": storage.profiles[storage.km20.profile]["address1"],
        "address2": storage.profiles[storage.km20.profile]["address2"],
        "zip": storage.profiles[storage.km20.profile]["zip"],
        "phone": "+"+storage.profiles[storage.km20.profile]["phone"],
        "email": storage.profiles[storage.km20.profile]["email"],
        "cardNumber": storage.profiles[storage.km20.profile]["cardNumber"],
        "cardName": storage.profiles[storage.km20.profile]["name"],
        "cardCVC": storage.profiles[storage.km20.profile]["cardCVC"],
        "cardMonth": storage.profiles[storage.km20.profile]["cardDate"].split("/")[0],
        "cardYear": storage.profiles[storage.km20.profile]["cardDate"].split("/")[1],
        "extra": storage.profiles[storage.km20.profile]["extra"]
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
    async function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    window.onload = () => {
        async function addToCart(sizeVariant){
            try {
                const response = await fetch("https://www.km20.ru/ajax/cart/addItem.php", {
                    "headers": {
                        "accept": "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                        "cache-control": "no-cache",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest"
                    },
                    "referrer": "https://www.km20.ru",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": `product_id=${sizeVariant}&product_size=1`,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                })
                if (response.headers.get('Server') === "nginx"){
                    const data = await response.json()
                    if (data['STATUS'] !== "OK"){
                        if (data['REASON'] === "LIMIT"){
                            await sendError(`Failed to ATC; Retrying ${sizeVariant}`)
                            return await addToCart(sizeVariant)
                        } else if (data['REASON'] === ""){
                            await sendNotification(`Added to cart ${sizeVariant}`)
                            return true
                        }
                    } else {
                        await sendNotification(`Added to cart ${sizeVariant}`)
                        return true
                    }
                } else {
                    await sendError(`Variti tempban; Refresh page and restart`)
                    return false
                }
            } catch {
                await sendError(`Failed to ATC; Retrying ${sizeVariant}`)
                return await addToCart(sizeVariant)
            }
        }
        
        async function sendCheckout(){
            var formData  = new FormData();
            const roistat = await getCookie('roistat_visit')
            formData.append('sessid', document.querySelector('input#sessid').value)
            formData.append('soa-action', 'saveOrderAjax')
            formData.append('location_type', 'code')
            formData.append('BUYER_STORE', '1')
            formData.append('ORDER_PROP_18', profile.email)
            formData.append('ORDER_PROP_11', profile.firstName)
            formData.append('ORDER_PROP_12', profile.lastName)
            formData.append('ORDER_PROP_7_fancy', profile.phone.replace('(','').replace(')',' ').slice(2))
            formData.append('ORDER_PROP_7', profile.phone.replaceAll('-','').replace('(','').replace(')','').slice(1))
            formData.append('ORDER_PROP_39', roistat === undefined ? '' : roistat) // ?
            formData.append('ORDER_DESCRIPTION', '')
            formData.append('PERSON_TYPE', '2')
            formData.append('PROFILE_ID', profile.extra)
            formData.append('ORDER_PROP_2', profile.country)
            formData.append('RECENT_DELIVERY_VALUE', profile.country)
            formData.append('ORDER_PROP_28', profile.zip)
            formData.append('ZIP_PROPERTY_CHANGED', 'Y')
            formData.append('ORDER_PROP_29', profile.address1)
            formData.append('ORDER_PROP_30', profile.address2.split('/')[0] === undefined ? '' : profile.address2.split('/')[0])
            formData.append('ORDER_PROP_31', profile.address2.split('/')[1] === undefined ? '' : profile.address2.split('/')[1])
            formData.append('ORDER_PROP_32', profile.address2.split('/')[2] === undefined ? '' : profile.address2.split('/')[2]) // Floor
            formData.append('ORDER_PROP_33', profile.address2.split('/')[3] === undefined ? '' : profile.address2.split('/')[3]) // Apt
            formData.append('DELIVERY_ID', '3') // DHL - 88, instore - 3
            formData.append('PAY_SYSTEM_ID', '15')
            formData.append('ORDER_TERMS', 'Y')
            formData.append('save', 'Y')
            let orderID = ''
            try {
                var checkoutTimestamp = (new Date()).toJSON().split('T')[1].slice(0, -1);
                const response = await fetch("https://www.km20.ru/cart/order/", {
                    "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "iframe",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "same-origin",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1"
                    },
                    "referrer": "https://www.km20.ru/cart/order/",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": formData,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                })
                const data = await response.json() 
                orderID = data['order']['ID']
                return [orderID, checkoutTimestamp]
            } catch {
                await sendError(`Failed to checkout; Retrying ${sizeVariant}`)
                sendCheckout()
            }
        }
        document.querySelector('div.size_choose-dd > div.ik_select_list').addEventListener('click', function(){
            chrome.storage.local.get('km20', function(storage){
                if (storage.km20.status && storage.km20.atc && storage.km20.aco){
                    document.querySelector('div.size_choose-dd').querySelectorAll('div.ik_select_list > div > ul > li.ik_select_option').forEach((sizeEl) => {
                        if (sizeEl.classList.contains('ik_select_active')){
                            (async () => {
                                let sizeVariant = sizeEl.getAttribute('data-value')
                                console.log('Choosen size:', sizeEl.getAttribute('data-value'))
                                var atc = await addToCart(sizeVariant)
                                if (atc){
                                    var checkout = await sendCheckout()
                                    var orderID = checkout[0]
                                    var checkoutTimestamp = checkout[1]
                                    await sendNotification('Checked out')
                                    await chrome.runtime.sendMessage({message: "publicSuccess", site: "KM20", item: document.querySelector('h1.prod_title').textContent, size: document.querySelector('div.size_choose div.ik_select_link_text').textContent.replace('\n','').trim(), time: checkoutTimestamp}, function(response){});
                                    await chrome.runtime.sendMessage({message: "privateSuccess", status:'Successfully checked out!', site: "KM20", item: document.querySelector('h1.prod_title').textContent, size: document.querySelector('div.size_choose div.ik_select_link_text').textContent.replace('\n','').trim(), profile: storage.km20.profile, orderId: `[${orderID}](https://www.km20.ru/personal/order/${orderID}/)`, image: document.querySelector('img.prod_img ').src}, function(response){});
                                    window.location.href = `https://www.km20.ru/cart/order/payment/personal.php?ORDER_ID=${orderID}&AJAX=N`
                                }
                            })()
                        }
                    })
                };
            });
        })

    }
})