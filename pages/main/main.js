document.addEventListener("DOMContentLoaded", function(){
    let adidasSizesTab = {
        '3K UK':'230',
        '4K UK':'240',
        '5K UK':'250',
        '5.5K UK':'260',
        '6K UK':'270',
        '7K UK':'290',
        '7.5K UK':'310',
        '8.5K UK':'330',
        '9.5K UK':'350',
        '10K UK':'370',
        '11K UK':'390',
        '11.5K UK':'410',
        '12.5K UK':'430',
        '13.5K UK':'450',
        '1 UK':'470',
        '2 UK':'490',
        '2.5 UK':'510',
        '3 UK':'520',
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
            opt = document.createElement('option');
            opt.value = profile;
            opt.innerHTML = profile;
            document.querySelector('select#adidasProfileTH').appendChild(opt);
            opt = document.createElement('option');
            opt.value = profile;
            opt.innerHTML = profile;
            document.querySelector('select#km20Profile').appendChild(opt);
            opt = document.createElement('option');
            opt.value = profile;
            opt.innerHTML = profile;
            document.querySelector('select#streetbeatProfile').appendChild(opt);
        }
    });
    let adidasOpt = {};
    chrome.storage.local.get('adidas', function(storage){
        document.querySelector('input#adidasSwitch').checked = storage.adidas.status;
        document.querySelector('select#adidasSizes').value = storage.adidas.size.UK;
        document.querySelector('select#adidasProfileRU').value = storage.adidas.profile["ru"];
        document.querySelector('select#adidasProfileTR').value = storage.adidas.profile["tr"];
        document.querySelector('select#adidasProfileTH').value = storage.adidas.profile["th"];
        document.querySelector('input#adidasATCcheckbox').checked = storage.adidas.atc;
        document.querySelector('input#adidasACOcheckbox').checked = storage.adidas.aco;
        document.querySelector('input#adidasAFcheckbox').checked = storage.adidas.af;
        document.querySelector('input#adidasSPcheckbox').checked = storage.adidas.isSpecial;
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
        chrome.storage.local.set({'adidas': adidasOpt}, function(){});
    });
    document.querySelector("select#adidasProfileTR").addEventListener('change', function(){
        if (typeof adidasOpt.profile !== "object"){
            adidasOpt.profile = {};
        }
        adidasOpt.profile.tr = this.value;
        chrome.storage.local.set({'adidas': adidasOpt}, function(){});
    });
    document.querySelector("select#adidasProfileTH").addEventListener('change', function(){
        if (typeof adidasOpt.profile !== "object"){
            adidasOpt.profile = {};
        }
        adidasOpt.profile.th = this.value;
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
    document.querySelector("input#adidasSPcheckbox").addEventListener('change', function(){
        adidasOpt.isSpecial = this.checked;
        chrome.storage.local.set({'adidas': adidasOpt}, function(){});
    });
    
    let km20Opt = {};
    chrome.storage.local.get('km20', function(storage){
        document.querySelector('input#km20Switch').checked = storage.km20.status;
        document.querySelector('select#km20Profile').value = storage.km20.profile;
        document.querySelector('input#km20ATCcheckbox').checked = storage.km20.atc;
        document.querySelector('input#km20ACOcheckbox').checked = storage.km20.aco;
        km20Opt = storage.km20;
    });
    document.querySelector("input#km20Switch").addEventListener('change', function(){
        km20Opt.status = this.checked;
        chrome.storage.local.set({'km20': km20Opt}, function(){});
    });
    document.querySelector("select#km20Profile").addEventListener('change', function(){
        if (typeof km20Opt.profile !== "object"){
            km20Opt.profile = {};
        }
        km20Opt.profile = this.value;
        chrome.storage.local.set({'km20': km20Opt}, function(){});
    });
    document.querySelector("input#km20ATCcheckbox").addEventListener('change', function(){
        km20Opt.atc = this.checked;
        chrome.storage.local.set({'km20': km20Opt}, function(){});
    });
    document.querySelector("input#km20ACOcheckbox").addEventListener('change', function(){
        km20Opt.aco = this.checked;
        chrome.storage.local.set({'km20': km20Opt}, function(){});
    });

    let streetbeatOpt = {};
    chrome.storage.local.get('streetbeat', function(storage){
        document.querySelector('input#streetbeatSwitch').checked = storage.streetbeat.status;
        document.querySelector('select#streetbeatProfile').value = storage.streetbeat.profile;
        document.querySelector('input#streetbeatATCcheckbox').checked = storage.streetbeat.atc;
        document.querySelector('input#streetbeatACOcheckbox').checked = storage.streetbeat.aco;
        streetbeatOpt = storage.streetbeat;
    });
    document.querySelector("input#streetbeatSwitch").addEventListener('change', function(){
        streetbeatOpt.status = this.checked;
        chrome.storage.local.set({'streetbeat': streetbeatOpt}, function(){});
    });
    document.querySelector("select#streetbeatProfile").addEventListener('change', function(){
        if (typeof streetbeatOpt.profile !== "object"){
            streetbeatOpt.profile = {};
        }
        streetbeatOpt.profile = this.value;
        chrome.storage.local.set({'streetbeat': streetbeatOpt}, function(){});
    });
    document.querySelector("input#streetbeatATCcheckbox").addEventListener('change', function(){
        streetbeatOpt.atc = this.checked;
        chrome.storage.local.set({'streetbeat': streetbeatOpt}, function(){});
    });
    document.querySelector("input#streetbeatACOcheckbox").addEventListener('change', function(){
        streetbeatOpt.aco = this.checked;
        chrome.storage.local.set({'streetbeat': streetbeatOpt}, function(){});
    });


    document.querySelector("button#adidasAddToCart").addEventListener('click', function(){
        chrome.runtime.sendMessage({message: "adidasAddToCart"}, function(response){});
    });
    chrome.storage.local.get('license', function(storage){
        chrome.runtime.sendMessage({message: "authorize", key: storage.license}, function(response){
            if (response !== "success"){
                window.location.href = "/pages/auth/auth.html";
            }
        });
    })
});
