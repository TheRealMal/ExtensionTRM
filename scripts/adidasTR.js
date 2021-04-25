chrome.storage.local.get(null, function(storage){
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

    function getEl(querySelector){
        return document.querySelector(querySelector);
    };
    function getEls(querySelector){
        return document.querySelectorAll(querySelector);
    };
    function sendNotification(message){
        iziToast.show({
            title: '[TRM]',
            message: message,
            position: 'topRight',
            color: 'blue'
        });
    };

    let afTextFields = {
        "#dwfrm_shipping_shiptoaddress_shippingAddress_firstName": profile.firstName,
        "#dwfrm_shipping_shiptoaddress_shippingAddress_lastName": profile.lastName,
        "#dwfrm_shipping_shiptoaddress_shippingAddress_address1": profile.address1,
        "#dwfrm_shipping_shiptoaddress_shippingAddress_address2": profile.address2,
        "#dwfrm_shipping_shiptoaddress_shippingAddress_postalCode": profile.zip,
        "#dwfrm_shipping_shiptoaddress_shippingAddress_phone": profile.phone,
        "#dwfrm_shipping_email_emailAddress": profile.email,
        "#dwfrm_shipping_billTypeIndividual_billTypeIndividual": profile.passport,
        "input[data-encrypted-name='number']": profile.cardNumber,
        "input[data-encrypted-name='holderName']": profile.cardName,
        "input[data-encrypted-name='cvc']": profile.cardCVC,
        "#dwfrm_shipping_shiptoaddress_shippingAddress_countyProvince": profile.state,
        "#dwfrm_shipping_shiptoaddress_shippingAddress_city": profile.city,
    };

    function fillField(id, value){
        let element = getEl(id); 
        if (element && element.value !== value){
            element.focus();
            element.value = value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.blur();
            return 1;
        };
        return 0;
    };

    function fillCheckbox(element){
        if (element && !element.checked){
            element.click();
        };
    };

    function autofillCheckboxes(checkboxes){
        for (checkbox of checkboxes) {
            fillCheckbox(checkbox);
        };
    };
    function autofillTextFields(fields){
        let result = 0;
        Object.keys(fields).forEach(id => {
            result += fillField(id, fields[id]);
        });
        if (result > 0){
            sendNotification('Filled adidas info');
        };
    };
    function autofillCardDate(){
        if (getEl("input[data-encrypted-name='expiryMonth']") && getEl("input[data-encrypted-name='expiryMonth']").value !== profile.cardMonth){
            getEl("fieldset > .exp-date > .month > div > div").click();
            getEl("fieldset > .exp-date > .month > div > div > .materialize-select-list > [data-value='"+profile.cardMonth+"']").click();
        };
        if (getEl("input[data-encrypted-name='expiryYear']") && getEl("input[data-encrypted-name='expiryYear']").value !== profile.cardYear){
            getEl("fieldset > .exp-date > .year > div > div").click();
            getEl("fieldset > .exp-date > .year > div > div > .materialize-select-list > [data-value='"+profile.cardYear+"']").click();
        };
    }

    function autofill(){
        autofillTextFields(afTextFields);
        autofillCheckboxes(getEls("input[type='checkbox']"));
        autofillCardDate();
        chrome.storage.local.get('adidas', function(storage){
            if (storage.adidas.aco && getEl("button[name='dwfrm_shipping_submitshiptoaddress']")){
                getEl("button[name='dwfrm_shipping_submitshiptoaddress']").click();
            }
            if (storage.adidas.aco && getEl("div.payment-submit > button")){
                getEl("div.payment-submit > button").click();
            }
        });
        //https://www.adidas.com.tr/on/demandware.store/Sites-adidas-TR-Site/tr_TR/COSummary2-ShowConfirmation
    };

    autofill();

    const callback = function(mutationsList, observer) {

        for (mutation of mutationsList){
            switch (mutation.type){
                case "childList":
                    for (x of mutation.addedNodes){
                        if (x.tagName != "SPAN" && x.tagName != "DIV" && x.tagName != "A" && x.tagName != "UL"){
                            autofill();
                            break;
                        }
                    }
                    break;
                case "attributes":
                    if (mutation.target.tagName != "SPAN" && mutation.target.tagName != "DIV" && mutation.target.tagName != "A" && mutation.target.tagName != "INPUT" && mutation.target.tagName != "UL"){
                        autofill();
                        break;
                    }
            }
        }
    };

    const observer = new MutationObserver(callback);

    window.onload = () => {
        chrome.storage.local.get('adidas', function(storage){
            if (storage.adidas.status && storage.adidas.af){
                observer.observe(document.body, {
                    attributes: true,
                    childList: true,
                    subtree: true
                });
            };
        });
    };

});