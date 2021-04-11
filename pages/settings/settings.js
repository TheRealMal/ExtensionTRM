document.addEventListener("DOMContentLoaded", function(){
    /* Webhook */
    chrome.storage.local.get('discordWebhook', function(storage){
        if (storage.discordWebhook){
            document.querySelector('input#webhookInput').value = storage.discordWebhook;
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
                        "color": 7209090,
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