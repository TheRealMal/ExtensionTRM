function getEl(querySelector){
    return document.querySelector(querySelector);
};
function getEls(querySelector){
    return document.querySelectorAll(querySelector);
};

var profile = {
    "firstName": "Roman",
    "lastName": "Malyutin",
    "state": "İstanbul",
    "city": "KAĞITHANE",
    "address1": "3-4A Merkez mah. Seçkin Sok.",
    "address2": "IST10930",
    "zip": "34406",
    "phone": "5498230612",
    "email": "therealmal23@gmail.com",
    "passport": "11111111111",
    "cardNumber": "1234123412341234",
    "cardName": "ROMAN MALYUTIN",
    "cardCVC": "123",
    "cardMonth": "11",
    "cardYear": "2023"
}

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
    "input[data-encrypted-name='cvc']": profile.cardCVC
};
let afSelectFields = {
    "#dwfrm_shipping_shiptoaddress_shippingAddress_countyProvince": profile.state,
    "#dwfrm_shipping_shiptoaddress_shippingAddress_city": profile.city,
    "input[data-encrypted-name='expiryMonth']": profile.cardMonth,
    "input[data-encrypted-name='expiryYear']": profile.cardYear,
};

function fillField(id, value){
	let element = getEl(id);
	if (element && element.value !== value){
        element.value = value;
        element.dispatchEvent(new Event('change'));
	};
};

function fillCheckbox(element) {
    if (element && !element.checked){
        element.checked = true;
        element.dispatchEvent(new Event('change'));
    }
}

function autofillCheckboxes(checkboxes){
    for (checkbox of checkboxes) {
        fillCheckbox(checkbox);
    };
};
function autofillTextFields(fields) {
    Object.keys(fields).forEach(id => {
        fillField(id, fields[id]);
    });
};

function autofill(){
    autofillTextFields(afTextFields);
    autofillCheckboxes(getEls("input[type='checkbox']"));
    // Shipping details
    if (getEl("#dwfrm_shipping_shiptoaddress_shippingAddress_countyProvince") && getEl("#dwfrm_shipping_shiptoaddress_shippingAddress_countyProvince").value !== afSelectFields["#dwfrm_shipping_shiptoaddress_shippingAddress_countyProvince"]){
        getEls("div.materialize-element")[5].click();
        getEl("div.dwfrm_shipping_shiptoaddress_shippingAddress_countyProvince > [data-value='"+afSelectFields["#dwfrm_shipping_shiptoaddress_shippingAddress_countyProvince"]+"']").click();
    };
    if (getEl("#dwfrm_shipping_shiptoaddress_shippingAddress_city") && getEl("#dwfrm_shipping_shiptoaddress_shippingAddress_city").value !== afSelectFields["#dwfrm_shipping_shiptoaddress_shippingAddress_city"]){
        getEls("div.materialize-element")[6].click();
        getEl("div.dwfrm_shipping_shiptoaddress_shippingAddress_city > [data-value='"+afSelectFields["#dwfrm_shipping_shiptoaddress_shippingAddress_city"]+"']").click();
    };
    if (getEl("[name='dwfrm_shipping_submitshiptoaddress']")){
        getEl("[name='dwfrm_shipping_submitshiptoaddress']").click();
    };

    // Card details
    if (getEl("input[data-encrypted-name='expiryMonth']") && getEl("input[data-encrypted-name='expiryMonth']").value !== afSelectFields["input[data-encrypted-name='expiryMonth']"]){
        getEl("fieldset > .exp-date > .month > div > div").click();
        getEl("fieldset > .exp-date > .month > div > div > .materialize-select-list > [data-value='"+afSelectFields["input[data-encrypted-name='expiryMonth']"]+"']").click();
    };
    if (getEl("input[data-encrypted-name='expiryYear']") && getEl("input[data-encrypted-name='expiryYear']").value !== afSelectFields["input[data-encrypted-name='expiryYear']"]){
        getEl("fieldset > .exp-date > .year > div > div").click();
        getEl("fieldset > .exp-date > .year > div > div > .materialize-select-list > [data-value='"+afSelectFields["input[data-encrypted-name='expiryYear']"]+"']").click();
        //alert("Ready to checkout")
    };
};

autofill();

const callback = function(mutationsList, observer) {
    for (mutation of mutationsList){
        for (x of mutation.addedNodes){
            if (x.tagName != "SPAN"){
                autofill();
            }
        }
    }
};

const observer = new MutationObserver(callback);

observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true
})