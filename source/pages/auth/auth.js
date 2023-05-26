document.addEventListener("DOMContentLoaded", function(){
    chrome.storage.local.get('license', function(storage){
        if (storage.license){
            window.location.href = "/pages/main/main.html";
        }
    });
    var authButton = document.querySelector("button.authButton");
    var authInput = document.querySelector("input.authInput");
    authButton.addEventListener("click", function(){
        chrome.runtime.sendMessage({message: "authorize", key: document.querySelector("input.authInput").value}, function(response){
            if (response == "success"){
                window.location.href = "/pages/main/main.html";
            }
            else {
                document.querySelector("input.authInput").placeholder = "Wrong key!";
                document.querySelector("input.authInput").value = "";
            }
        });
    });
    authInput.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            authButton.click();
        }
      });
});