document.addEventListener("DOMContentLoaded", function(){
    chrome.storage.local.get('profiles', function(storage){
        for (profileName in storage.profiles){
            $("#profileDropdown").append(new Option(profileName, profileName));
        }
    })
    $('#cardNumber').mask("0000 0000 0000 0000");
    $('#cardDate').mask("00/00");
    $('#cardCVC').mask("000");
    $('#phone').mask("##(000)000-00-00", {reverse: true});
    document.querySelector("#profileDropdown").addEventListener("change", function(){
        let profileName = this.value;
        if (profileName !== "Create new profile") {
            document.querySelector("#removeProfile").style.display = "block";
            document.querySelector("#duplicateProfile").style.display = "block";
            $("#profileSave").text("Save");
            chrome.storage.local.get('profiles', function(storage){
                $('#profileName').val(profileName);
                for (key in storage.profiles[profileName]){
                    $('#'+key).val(storage.profiles[profileName][key]);
                }
            });
        } else {
            document.querySelector("#removeProfile").style.display = "none";
            document.querySelector("#duplicateProfile").style.display = "none";
            $("#profileSave").text("Create");
            $("#profilesBox :input").each(function (){
                $(this).val("");
            })
        }
    });
    
    document.querySelector("#profileName").addEventListener("change", function(){
        if (document.querySelector("#profileDropdown").value !== "Create new profile"){
            if (document.querySelector("#profileName").value === document.querySelector("#profileDropdown").value){
                $("#profileSave").text("Save");
            }
            else {
                $("#profileSave").text("Create");
            }
        } else {
        
        }
    })
    document.querySelector("#profileSave").addEventListener("click", function(){
        chrome.storage.local.get('profiles', function(storage){
            if (storage.profiles === undefined){
                storage.profiles = {};
            }
            if ($('#profileName').val() !== "" && $('#profileName').val() !== "Create new profile"){
                storage.profiles[$('#profileName').val()] = {
                    'name': $('#name').val(),
                    'country': $('#country').val(),
                    'state': $('#state').val(),
                    'city': $('#city').val(),
                    'address1': $('#address1').val(),
                    'address2': $('#address2').val(),
                    'zip': $('#zip').val(),
                    'phone': $('#phone').val(),
                    'email': $('#email').val(),
                    'cardNumber': $('#cardNumber').val(),
                    'cardDate': $('#cardDate').val(),
                    'cardCVC': $('#cardCVC').val(),
                    'extra': $('#extra').val()
                }
                chrome.storage.local.set({'profiles': storage.profiles}, function(){});
                dropdownProfiles = [];
                $('#profileDropdown option').each(function() {
                    dropdownProfiles.push($(this).val())
                });
                if (!dropdownProfiles.includes($('#profileName').val())){
                    $("#profileDropdown").append(new Option($('#profileName').val(), $('#profileName').val()));
                };
                $("#profilesBox :input").each(function (){
                    $(this).val("");
                })
            }
        });
    })
    document.querySelector("#duplicateProfile").addEventListener("click", function(){
        chrome.storage.local.get('profiles', function(storage){
            let duplicateProfileName = $('#profileName').val()
            let i = 0
            while (Object.keys(storage.profiles).includes(duplicateProfileName)){
                i += 1
                duplicateProfileName = `${$('#profileName').val()}_${i}`
            }

            storage.profiles[duplicateProfileName] = {
                'name': $('#name').val(),
                'country': $('#country').val(),
                'state': $('#state').val(),
                'city': $('#city').val(),
                'address1': $('#address1').val(),
                'address2': $('#address2').val(),
                'zip': $('#zip').val(),
                'phone': $('#phone').val(),
                'email': $('#email').val(),
                'cardNumber': $('#cardNumber').val(),
                'cardDate': $('#cardDate').val(),
                'cardCVC': $('#cardCVC').val(),
                'extra': $('#extra').val()
            }
            chrome.storage.local.set({'profiles': storage.profiles}, function(){});
            dropdownProfiles = [];
            $('#profileDropdown option').each(function() {
                dropdownProfiles.push($(this).val())
            });
            if (!dropdownProfiles.includes(duplicateProfileName)){
                $("#profileDropdown").append(new Option(duplicateProfileName, duplicateProfileName));
            };
            $("#profilesBox :input").each(function (){
                $(this).val("");
            })
        })
    })
    document.querySelector("#removeProfile").addEventListener("click", function(){
        chrome.storage.local.get('profiles', function(storage){
            delete storage.profiles[$('#profileName').val()]
            chrome.storage.local.set({'profiles': storage.profiles}, function(){});
            dropdownProfiles = [];
            $('#profileDropdown option').each(function() {
                dropdownProfiles.push($(this).val())
            });
            $(`#profileDropdown option[value='${$('#profileName').val()}']`).remove();
            $("#profilesBox :input").each(function (){
                $(this).val("");
            })
            document.querySelector("#removeProfile").style.display = "none";
        })
    })
});