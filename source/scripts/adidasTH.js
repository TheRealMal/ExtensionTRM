chrome.storage.local.get(null, function(storage){
    profile = {
        "firstName": storage.profiles[storage.adidas.profile.th]["name"].split(" ")[1],
        "lastName": storage.profiles[storage.adidas.profile.th]["name"].split(" ")[0],
        "state": storage.profiles[storage.adidas.profile.th]["state"],
        "city": storage.profiles[storage.adidas.profile.th]["city"],
        "address1": storage.profiles[storage.adidas.profile.th]["address1"],
        "address2": storage.profiles[storage.adidas.profile.th]["address2"],
        "zip": storage.profiles[storage.adidas.profile.th]["zip"],
        "phone": storage.profiles[storage.adidas.profile.th]["phone"].split("(")[1].replaceAll("-","").replace(")",""),
        "email": storage.profiles[storage.adidas.profile.th]["email"],
        "cardNumber": storage.profiles[storage.adidas.profile.th]["cardNumber"],
        "cardName": storage.profiles[storage.adidas.profile.th]["name"],
        "cardCVC": storage.profiles[storage.adidas.profile.th]["cardCVC"],
        "cardMonth": storage.profiles[storage.adidas.profile.th]["cardDate"].split("/")[0],
        "cardYear": "20" + storage.profiles[storage.adidas.profile.th]["cardDate"].split("/")[1]
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
        "select[name='shippingAddress.countyProvince']": profile.state,
        "#shippingAddress-firstName": profile.firstName,
        "#shippingAddress-lastName": profile.lastName,
        "#shippingAddress-address1": profile.address1,
        "#shippingAddress-address2": profile.address2,
        "#shippingAddress-phoneNumber": profile.phone,
        "#shippingAddress-emailAddress": profile.email,
        "#card-number": profile.cardNumber,
        "#name": profile.cardName,
        "#expiryDate": profile.cardMonth + profile.cardYear.slice(-2),
        "#security-number-field": profile.cardCVC,
        "select[name='shippingAddress.city']": profile.city,
        "select[name='shippingAddress.zipcode']": profile.zip,
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

    function autofill(){
        autofillTextFields(afTextFields);
        autofillCheckboxes(getEls("input[type='checkbox']"));
        chrome.storage.local.get('adidas', function(storage){
            if (storage.adidas.aco && getEl("button[data-auto-id='review-and-pay-button']")){
                getEl("button[data-auto-id='review-and-pay-button']").click();
            }
            if (storage.adidas.aco && getEl("button[data-auto-id='place-order-button']")){
                getEl("button[data-auto-id='place-order-button']").click();
            }
        });
    };

    autofill();

    const callback = function(mutationsList, observer) {

        for (mutation of mutationsList){
            switch (mutation.type){
                case "childList":
                    if (mutation.target.tagName == "FORM" || mutation.target.tagName == "MAIN" || mutation.target.tagName == "BODY"){
                        autofill();
                        break;
                    }
                    for (x of mutation.addedNodes){
                        if (x.tagName == "INPUT"){
                            autofill();
                            break;
                        }
                    }                  
                    break;
                case "attributes":
                    if (mutation.target.tagName == "FORM" || mutation.target.tagName == "MAIN"){
                        autofill();
                        break;
                    }
                    break;
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