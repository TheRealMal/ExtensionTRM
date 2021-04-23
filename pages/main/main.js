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
        '13,5 UK':'730',
        'random': 'random',
        'smallest': 'smallest',
        'largest': 'largest'
    };
    chrome.storage.local.get('profiles', function(storage){
        for (profile in storage.profiles){
            let opt = document.createElement('option');
            opt.value = profile;
            opt.innerHTML = profile;
            document.querySelector('select#adidasProfileRU').appendChild(opt);
            opt = document.createElement('option');
            opt.value = profile;
            opt.innerHTML = profile;
            document.querySelector('select#adidasProfileTR').appendChild(opt);
        }
    });
    let adidasOpt = {};
    chrome.storage.local.get('adidas', function(storage){
        document.querySelector('input#adidasSwitch').checked = storage.adidas.status;
        document.querySelector('select#adidasSizes').value = storage.adidas.size.UK;
        document.querySelector('select#adidasProfileRU').value = storage.adidas.profile["ru"];
        document.querySelector('select#adidasProfileTR').value = storage.adidas.profile["tr"];
        document.querySelector('input#adidasATCcheckbox').checked = storage.adidas.atc;
        document.querySelector('input#adidasACOcheckbox').checked = storage.adidas.aco;
        document.querySelector('input#adidasAFcheckbox').checked = storage.adidas.af;
        adidasOpt = storage.adidas;
    });
    document.querySelector("input#adidasSwitch").addEventListener('change', function(){
        adidasOpt.status = this.checked;
        chrome.storage.local.set({'adidas': adidasOpt}, function(){});
    });
    document.querySelector("select#adidasSizes").addEventListener('change', function(){
        adidasOpt.size = {};
        adidasOpt.size.UK = this.value, adidasOpt.size.var = adidasSizesTab[this.value];
        chrome.storage.local.set({'adidas': adidasOpt}, function(){});
    });
    document.querySelector("select#adidasProfileRU").addEventListener('change', function(){
        if (typeof adidasOpt.profile !== "object"){
            adidasOpt.profile = {};
        }
        adidasOpt.profile.ru = this.value;
        console.log(adidasOpt.profile);
        chrome.storage.local.set({'adidas': adidasOpt}, function(){});
    });
    document.querySelector("select#adidasProfileTR").addEventListener('change', function(){
        if (typeof adidasOpt.profile !== "object"){
            adidasOpt.profile = {};
        }
        adidasOpt.profile.tr = this.value;
        console.log(adidasOpt.profile);
        chrome.storage.local.set({'adidas': adidasOpt}, function(){});
    });
    document.querySelector("input#adidasATCcheckbox").addEventListener('change', function(){
        adidasOpt.atc = this.checked;
        chrome.storage.local.set({'adidas': adidasOpt}, function(){});
    });
    document.querySelector("input#adidasACOcheckbox").addEventListener('change', function(){
        adidasOpt.aco = this.checked;
        chrome.storage.local.set({'adidas': adidasOpt}, function(){});
    });
    document.querySelector("input#adidasAFcheckbox").addEventListener('change', function(){
        adidasOpt.af = this.checked;
        chrome.storage.local.set({'adidas': adidasOpt}, function(){});
    });
});
