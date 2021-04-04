document.addEventListener("DOMContentLoaded", function(){
    let adidasSizesTab = {
        '3.5 UK':'530',
        '4 UK':'540',
        '4.5 UK':'550',
        '5 UK':'560',
        '5.5 UK':'570',
        '6 UK':'580',
        '6.5 UK':'590',
        '7 UK':'600',
        '7.5 UK':'610',
        '8 UK':'620',
        '8.5 UK':'630',
        '9 UK':'640',
        '9.5 UK':'650',
        '10 UK':'660',
        '10.5 UK':'670',
        '11 UK':'680',
        '11.5 UK':'690',
        '12 UK':'700',
        '12.5 UK':'710',
        '13 UK':'720',
        '13,5 UK':'730'
    };
    /* Adidas turn on/off */
    chrome.storage.local.get('adidas', function(storage){
        document.querySelector('#adidasSwitch').checked = storage.adidas;
    });
    document.querySelector("#adidasSwitch").addEventListener('change', function(){
        chrome.storage.local.set({'adidas': this.checked}, function(){});
    });
    /* Adidas choose size */
    chrome.storage.local.get('adidasSize', function(storage){
        document.querySelector('select#adidasSizes').value = storage.adidasSize.UK;
    });
    document.querySelector("#adidasSizes").addEventListener('change', function(){
        chrome.storage.local.set({'adidasSize': {'UK': this.value, 'var': adidasSizesTab[this.value]}}, function(){});
    });
});