chrome.storage.local.get(null, function(storage){
    profile = {
        "firstName": storage.profiles[storage.adidas.profile.ru]["name"].split(" ")[1],
        "lastName": storage.profiles[storage.adidas.profile.ru]["name"].split(" ")[0],
        "city": storage.profiles[storage.adidas.profile.ru]["city"],
        "address1": storage.profiles[storage.adidas.profile.ru]["address1"],
        "address2": storage.profiles[storage.adidas.profile.ru]["address2"],
        "zip": storage.profiles[storage.adidas.profile.ru]["zip"],
        "phone": "+"+storage.profiles[storage.adidas.profile.ru]["phone"],
        "email": storage.profiles[storage.adidas.profile.ru]["email"],
        "cardNumber": storage.profiles[storage.adidas.profile.ru]["cardNumber"],
        "cardName": storage.profiles[storage.adidas.profile.ru]["name"],
        "cardCVC": storage.profiles[storage.adidas.profile.ru]["cardCVC"],
        "cardMonth": storage.profiles[storage.adidas.profile.ru]["cardDate"].split("/")[0],
        "cardYear": storage.profiles[storage.adidas.profile.ru]["cardDate"].split("/")[1]
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
        "input[name='firstName']": profile.firstName,
        "input[name='lastName']": profile.lastName,
        "input[name='address1']": profile.address1,
        "input[name='houseNumber']": profile.address2,
        "input[name='zipcode']": profile.zip,
        "input[name='phoneNumber']": profile.phone,
        "input[name='emailAddress']": profile.email,
        "input[name='city']": profile.city
    };
    let afIFrameFields = {
        "input[name='card-number']": profile.cardNumber,
        "input[name='security-code']": profile.cardCVC,
        "input[name='expiry-month']": profile.cardMonth,
        "input[name='expiry-year']": profile.cardYear
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

    function autofillYoomoney(){
        autofillTextFields(afIFrameFields);
        chrome.storage.local.get('adidas', function(storage){
            if (storage.adidas.aco && getEl("button[type='submit']")){
                getEl("button[type='submit']").click();
            };
        });
    }


    const callback = function(mutationsList, observer){
        for (mutation of mutationsList){
            switch (mutation.type){
                case "childList":
                    for (x of mutation.addedNodes){
                        if (x.tagName == "FORM" || x.tagName == "MAIN"){
                            autofillTextFields(afTextFields);
                            autofillCheckboxes(getEls("input[type='checkbox']"));
                            chrome.storage.local.get('adidas', function(storage){
                                if (storage.adidas.aco && getEl("button[data-auto-id='review-and-pay-button']")){
                                    getEl("button[data-auto-id='review-and-pay-button']").click();
                                }
                            });
                            break;
                        }
                    }
                    break;
                case "attributes":
                    if (mutation.target.tagName == "BODY"){
                        autofillTextFields(afTextFields);
                        autofillCheckboxes(getEls("input[type='checkbox']"));
                        chrome.storage.local.get('adidas', function(storage){
                            if (storage.adidas.aco && getEl("button[data-auto-id='review-and-pay-button']")){
                                getEl("button[data-auto-id='review-and-pay-button']").click();
                            }
                        });
                        break;
                    }
            }
        }
    };

    const observer = new MutationObserver(callback);

    window.onload = () => {
        chrome.storage.local.get('adidas', function(storage){
            if (storage.adidas.status && storage.adidas.af){
                autofillYoomoney();
                observer.observe(document.body, {
                    attributes: true,
                    childList: true,
                    subtree: true
                });
            };
        });
    };
});