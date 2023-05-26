# ExtensionTRM
Browser extension to automate & speed up some basic customer actions  
![Demo](/demo.png)

## Supported sites
### Adidas RU/TR/TH/PL
- Auto ATC (AddToCart)
- Autofill
- ACO (AutoCheckOut)
- Full requests ACO
- Force ATC (Worked before droptime)
### KM20
- ATC Loop (For KM20+ drops)
- ACO
### Streetbeat
- ACO
- Local restocks/drops monitor

## Extension features
- Discord webhook support
- Profile creation/modification/removal/duplication
- Settings import/export

## Install

1. Click `Code` > `Download ZIP`  
2. Unzip downloaded archive in some directory
3. Go to `Manage Extensions` tab and turn on **Developer mode**
3. Upload that directory to your chrome browser

## Adidas TR adyen solution
Adyen server solution using ExpressJS  
Old files in `/adyen`
```js
...
app.post('/2.0/adyen', (req, res) => {
    const adyenEncrypt = require('./adyen/v/0_1_22')
    const adyenKey = "10001|C4F415A1A41A283417FAB7EF8580E077284BCC2B06F8A6C1785E31F5ABFD38A3E80760E0CA6437A8DC95BA4720A83203B99175889FA06FC6BABD4BF10EEEF0D73EF86DD336EBE68642AC15913B2FC24337BDEF52D2F5350224BD59F97C1B944BD03F0C3B4CA2E093A18507C349D68BE8BA54B458DB63D01377048F3E53C757F82B163A99A6A89AD0B969C0F745BB82DA7108B1D6FD74303711065B61009BC8011C27D1D1B5B9FC5378368F24DE03B582FE3490604F5803E805AEEA8B9EF86C54F27D9BD3FC4138B9DC30AF43A58CFF7C6ECEF68029C234BBC0816193DF9BD708D10AAFF6B10E38F0721CF422867C8CC5C554A357A8F51BA18153FB8A83CCBED1";
    const options = {};
    const cardData = {
        number : req.query.cardNumber,       // 'xxxx xxxx xxxx xxxx'
        cvc : req.query.cvc,                 //'xxx'
        holderName : req.query.holderName,   // 'John Doe'
        expiryMonth : req.query.expiryMonth, //'MM'
        expiryYear : req.query.expiryYear,   // 'YYYY'
        generationtime : new Date().toISOString() // new Date().toISOString()
    };
    const cseInstance = adyenEncrypt.createEncryption(adyenKey, options);
    cseInstance.validate(cardData);
    const dataEncrypted = cseInstance.encrypt(cardData);
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json({status: '200', data: dataEncrypted})
})
...
```
