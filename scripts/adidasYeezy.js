let adidasDomains = {
    'ru': 'https://www.adidas.ru/delivery',
    'uk': 'https://www.adidas.co.uk/delivery',
    'com':'https://www.adidas.com/us/delivery',
    'th': 'https://www.adidas.co.th/on/demandware.store/Sites-adidas-TH-Site/th_TH/COShipping-Show',
    'tr': 'https://www.adidas.com.tr/on/demandware.store/Sites-adidas-TR-Site/tr_TR/COShipping-Show',
    'au': 'https://www.adidas.com.au/on/demandware.store/Sites-adidas-AU-Site/en_AU/COShipping-Show'
}

let region = window.location.hostname.split('.')[window.location.hostname.split('.').length-1];
chrome.storage.local.get('adidasSize', function(storage){
    let atcURI = 'https://' + window.location.hostname + '/on/demandware.store/Sites-adidas-'+region.toUpperCase()+'-Site/'+region+'-'+region.toUpperCase()+'/Cart-MiniAddProduct?layer=Add%20To%20Bag%20overlay&pid='+productID+'_'+storage.adidasSize.var+'&Quantity=1&masterPid='+productID+'add-to-cart-button=';
    fetch(atcURI).then(window.location = adidasDomains[region]);
})