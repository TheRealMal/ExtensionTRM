chrome.storage.local.get(null, function(storage){
    if (storage.nft.solport.status){
        function sendNotification(message){
            iziToast.show({
                title: '[TRM]',
                message: message,
                position: 'topRight',
                color: 'blue'
            });
        };
    }
})