var profile = {
    "firstName": "Роман",
    "lastName": "Малютин",
    "state": "",
    "city": "Химки",
    "address1": "Заречная",
    "address2": "6/1",
    "zip": "141435",
    "phone": "+7(999)848-40-01",
    "email": "therealmal23@gmail.com",
    "passport": "",
    "cardNumber": "4377 7200 0020 6011",
    "cardName": "ROMAN MALYUTIN",
    "cardCVC": "123",
    "cardMonth": "11",
    "cardYear": "23"
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
}


const callback = function(mutationsList, observer){
    for (mutation of mutationsList){
        switch (mutation.type){
            case "childList":
                for (x of mutation.addedNodes){
                    if (x.tagName == "FORM" || x.tagName == "MAIN"){
                        autofillTextFields(afTextFields);
                        autofillCheckboxes(getEls("input[type='checkbox']"));
                        break;
                    }
                }
                break;
            case "attributes":
                if (mutation.target.tagName == "BODY"){
                    autofillTextFields(afTextFields);
                    autofillCheckboxes(getEls("input[type='checkbox']"));
                    break;
                }
        }
    }
};

const observer = new MutationObserver(callback);

window.onload = () => {
    autofillYoomoney();
    observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true
    });
};