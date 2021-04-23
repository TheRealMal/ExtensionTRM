document.addEventListener("DOMContentLoaded", function(){
    /* Webhook */
    chrome.storage.local.get('discordWebhook', function(storage){
        if (storage.discordWebhook){
            document.querySelector('input#webhookInput').value = storage.discordWebhook;
        }
    });
    document.querySelector("#exportSettings").addEventListener('click', function(){
        chrome.storage.local.get(null, function(storage){
            navigator.clipboard.writeText(JSON.stringify(storage));
        });
    });
    document.querySelector("#importSettings").addEventListener('click', function(){
        if (document.querySelector("#settingsInput").style.display !== "none" && document.querySelector("#settingsInput").style.display !== ""){
            chrome.storage.local.set(JSON.parse(document.querySelector("#settingsInput").value), function(){
                document.querySelector("#settingsInput").style.display = "none";
            });
        }
        else {
            document.querySelector("#settingsInput").value = "";
            document.querySelector("#settingsInput").style.display = "table";
        }
    });
    document.querySelector("#discordSave").addEventListener('click', function(){
        chrome.storage.local.set({'discordWebhook': document.querySelector("input#webhookInput").value}, function(){});
        fetch(document.querySelector("input#webhookInput").value,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "content": null,
                    "embeds": [{
                        "title": "Successfully checked out!",
                        "color": 9240739,
                        "fields": [
                            {
                                "name": "Site",
                                "value": "Test Website"
                            },
                            {
                                "name": "Item",
                                "value": "Test Item"
                            },
                            {
                                "name": "Size",
                                "value": "N/A"
                            },
                            {
                                "name": "Profile",
                                "value": "||Test Profile||"
                            },
                            {
                                "name": "Order",
                                "value": "||#1488||"
                            }
                        ],
                        "footer": {
                            "text": "TheRealMal EXT",
                            "icon_url": "https://i.imgur.com/Csera95.png"
                        },
                        "thumbnail": {
                            "url": "https://i.imgur.com/Csera95.png"
                        }
                    }]
                })
            }
        );
    });
});