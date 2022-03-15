for (x of document.querySelectorAll('script')){
    if (x.src.startsWith('https://long-cdn.frisbuy.ru/')){
        productID = (new URL(x.src)).searchParams.get('sku')
        break
    }
}

async function getStock(id){
    try {
        const response = await fetch(`https://street-beat.ru/local/templates/streetbeat/components/multisite/catalog.detail/street_beat/ajax.php?action=getShopsAvailability&productId=${id}&cityId=19`)
        return response.json()
    } catch {
        return getStock(id)
    }
}

async function sendATC(sizeID){
    fetch(`https://street-beat.ru/restapi/v1/basket/${sizeID}`, {
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: "action=add&count=1&isDeltaQty=1&properties%5BSIZE_TYPE%5D=tab_rus",
        method: "POST",
        mode: "cors",
        credentials: "include"
    });
}

(async () => {
    var stock = await getStock(productID)
    var sizes = new Set()
    for (let shop of stock.shops){
        for (let size of Object.keys(shop.availableOffersCount)){
            sizes.add(size)
        }
    }
    for (let size of sizes){
        await sendATC(size)
    }
})()