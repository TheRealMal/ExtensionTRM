var startTimeout = 0
if (window.location.href.includes("?url=")){
  startTimeout = 6000
}
  setTimeout(() => {var sbMonitorHead = document.createElement('body')
  var sbMonitorHTMLHead = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TRM Extension</title>
      <style>
          body {
              background-color: rgb(11, 11, 11);
              color: white;
              font-family: Helvetica;
          }
          .box {
              z-index: 10001;
              position: fixed;
              background-color: rgb(33, 33, 33, 0.9);
              border-radius: 10px;
              width: 400px;
              height: 340px;
              display: table;
              text-align: center;
              position: absolute;
              top: 50%;
              left: 50%;
              margin-right: -50%;
              transform: translate(-50%, -50%)
          }
          .box-title span {
              font-size: 40px;
              font-weight: 500;
          }
          .box-body {
              display: block;
          }
          .customButton {
              border: 1px solid white;
              border-radius: 5px;
              color: white;
              transition: 0.3s;
              cursor: pointer;
          }
          .customButton:hover {
              background-color: white;
              color: rgb(11, 11, 11);
          }
          input[name="sbMonitor"]{
              border-radius: 5px;
              opacity: 1;
              background-color: #fff;
              width: 230px;
              justify-content: center;
              text-align: center;
              margin: 5px auto;
              color: #020005;
              font-family: 'Rubik', sans-serif;
              font-size: 18px;
              font-style: normal;
              font-weight: 400;
              padding: 2.5px 0 2.5px 0;
              display: flex;
          }
          input[name="sbMonitor"]{
            border-radius: 5px;
            opacity: 1;
            background-color: #fff;
            width: 230px;
            justify-content: center;
            text-align: center;
            margin: 5px auto;
            color: #020005;
            font-family: 'Rubik', sans-serif;
            font-size: 18px;
            font-style: normal;
            font-weight: 400;
            padding: 2.5px 0 2.5px 0;
            display: flex;
        }
          #monitor-button {
              text-align: center;
              display: block;
              width: 150px;
              margin: 10px auto;
          }

          input[name="restock-sbMonitor"]{
            border-radius: 5px;
            opacity: 1;
            background-color: #fff;
            width: 230px;
            justify-content: center;
            text-align: center;
            margin: 5px auto;
            color: #020005;
            font-family: 'Rubik', sans-serif;
            font-size: 18px;
            font-style: normal;
            font-weight: 400;
            padding: 2.5px 0 2.5px 0;
            display: flex;
        }
        input[name="restock-sbMonitor"]{
          border-radius: 5px;
          opacity: 1;
          background-color: #fff;
          width: 230px;
          justify-content: center;
          text-align: center;
          margin: 5px auto;
          color: #020005;
          font-family: 'Rubik', sans-serif;
          font-size: 18px;
          font-style: normal;
          font-weight: 400;
          padding: 2.5px 0 2.5px 0;
          display: flex;
      }
        #restock-monitor-button {
            text-align: center;
            display: block;
            width: 150px;
            margin: 10px auto;
        }
      </style>
      <style>
          .white {
            height: 98vh;
          }
          .white:before {
            z-index: 1000;
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
          }
          .white:after {
            z-index: 1000;
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 20vh;
            background-image: linear-gradient(0deg, rgb(15, 15, 15) 0%, rgba(235, 235, 235, 0) 100%);
          }
          
          .squares {
            height: 100%;
            display: flex;
            justify-content: space-around;
            overflow: hidden;
          }
          
          .square {
            -webkit-animation: squares 9.5s linear infinite;
                    animation: squares 9.5s linear infinite;
            align-self: flex-end;
            width: 1em;
            height: 1em;
            transform: translateY(100%);
            background: #ebebeb;
          }
          .square:nth-child(2) {
            height: 1.5em;
            width: 3em;
            -webkit-animation-delay: 1s;
                    animation-delay: 1s;
            -webkit-animation-duration: 17s;
                    animation-duration: 17s;
            -webkit-filter: blur(5px);
          }
          .square:nth-child(3) {
            height: 2em;
            width: 1em;
            -webkit-animation-delay: 1.5s;
                    animation-delay: 1.5s;
            -webkit-animation-duration: 8s;
                    animation-duration: 8s;
            -webkit-filter: blur();
          }
          .square:nth-child(4) {
            height: 1em;
            width: 1.5em;
            -webkit-animation-delay: 0.5s;
                    animation-delay: 0.5s;
            -webkit-filter: blur(3px);
            -webkit-animation-duration: 13s;
                    animation-duration: 13s;
          }
          .square:nth-child(5) {
            height: 1.25em;
            width: 2em;
            -webkit-animation-delay: 4s;
                    animation-delay: 4s;
            -webkit-filter: blur(2px);
            -webkit-animation-duration: 11s;
                    animation-duration: 11s;
          }
          .square:nth-child(6) {
            height: 2.5em;
            width: 2em;
            -webkit-animation-delay: 2s;
                    animation-delay: 2s;
            -webkit-filter: blur(1px);
            -webkit-animation-duration: 9s;
                    animation-duration: 9s;
          }
          .square:nth-child(7) {
            height: 5em;
            width: 2em;
            -webkit-filter: blur(2.5px);
            -webkit-animation-duration: 12s;
                    animation-duration: 12s;
          }
          .square:nth-child(8) {
            height: 1em;
            width: 3em;
            -webkit-animation-delay: 5s;
                    animation-delay: 5s;
            -webkit-filter: blur(6px);
            -webkit-animation-duration: 18s;
                    animation-duration: 18s;
          }
          .square:nth-child(9) {
            height: 1.5em;
            width: 2em;
            -webkit-filter: blur(0.5px);
            -webkit-animation-duration: 9s;
                    animation-duration: 9s;
          }
          .square:nth-child(9) {
            height: 3em;
            width: 2.4em;
            -webkit-animation-delay: 6s;
                    animation-delay: 6s;
            -webkit-filter: blur(0.5px);
            -webkit-animation-duration: 12s;
                    animation-duration: 12s;
          }
          
          @-webkit-keyframes squares {
            from {
              transform: translateY(100%) rotate(-50deg);
            }
            to {
              transform: translateY(calc(-100vh + -100%)) rotate(20deg);
            }
          }
          
          @keyframes squares {
            from {
              transform: translateY(100%) rotate(-50deg);
            }
            to {
              transform: translateY(calc(-100vh + -100%)) rotate(20deg);
            }
          }
      </style>
  </head>
  <body>
      <div class="box">
          <div class="box-title">
              <span>TRM Streetbeat</span>
          </div>
          <div class="box-body">
              <div class="box-body-block" id="monitor">
                  <hr style="display:inline-block; margin-right:10px; width:134px; margin-bottom: 6px;"><span>Initial</span><hr style="display:inline-block; margin-left:10px; width:134px; margin-bottom: 6px;">
                  <input name="sbMonitor" placeholder="https://street-beat.ru/d/..." class="customInput">
                  <input name="sbMonitorDelay" placeholder="Delay" class="customInput" value="2000">
                  <a class="customButton" id="monitor-button">Start</a>
                  <div class="box-lastcheck">
                      <span>Last check: </span>
                  </div>
              </div>
              <div class="box-body-block" id="restock-monitor">
                  <hr style="display:inline-block; margin-right:10px; width:134px; margin-bottom: 6px;"><span>Restocks</span><hr style="display:inline-block; margin-left:10px; width:134px; margin-bottom: 6px;">
                  <input name="restock-sbMonitor" placeholder="product id" class="customInput">
                  <input name="restock-sbMonitorDelay" placeholder="Delay" class="customInput" value="2000">
                  <a class="customButton" id="restock-monitor-button">Start</a>
                  <div class="box-lastcheck">
                      <span>Last check: </span>
                  </div>
              </div>
          </div>
      </div>
      <div class="background-particles">
          <div class='white'>
              <div class='squares'>
                <div class='square'></div>
                <div class='square'></div>
                <div class='square'></div>
                <div class='square'></div>
                <div class='square'></div>
                <div class='square'></div>
                <div class='square'></div>
                <div class='square'></div>
                <div class='square'></div>
                <div class='square'></div>
              </div>
          </div>
          <div class="grey"></div>
      </div>
      <script>
          var monitorButton = document.querySelector('#monitor-button');
          var monitorInterval;
          function sbMonitor(){
              var url = document.querySelector('input[name="sbMonitor"]').value;
              document.querySelector('div#monitor div.box-lastcheck span').innerHTML = \`Last check: \${(new Date()).toISOString()}\`
              fetch(url, {redirect: "error"})
              .then(response => response.status)
              .then(status => {
                  if (status == 200){
                    monitorButton.click();
                    sendShareWebhook(url);
                    window.open(url, '_blank').focus();
                  } else if (status == 404){
                    document.querySelector('input[name="sbMonitor"]').value = "Product not loaded";
                    monitorButton.click();
                  } else if (status == 403){
                    var link = new URL(window.location.href)
                    link.searchParams.set('url', url)
                    link.searchParams.set('d', document.querySelector('input[name="sbMonitorDelay"]').value)
                    window.location = link.toString()
                  }
              })
          }

          monitorButton.addEventListener('click', function(){
              if (monitorButton.innerHTML === "Start"){
                  monitorButton.innerHTML = "Stop"
                  monitorInterval = setInterval(sbMonitor, Number(document.querySelector('input[name="sbMonitorDelay"]').value))
              } else {
                  monitorButton.innerHTML = "Start"
                  clearInterval(monitorInterval)
              }
          })
          function sendShareWebhook(link, sizes='', name='', imgUrl=''){
            fetch(
              'https://discord.com/api/webhooks/954454077864026172/MZhPt1wy6OUucZAUKcsx4o6CDO-ZowaaUipne6DclNTZQ15l8D0HXGCV8ZyJ1GyIc25F',
              {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  allowed_mentions: {
                    parse: ['users', 'roles'],
                  },
                  embeds: [
                    {
                      color: 2829361,
                      title: 'Кто-то что-то поймал' + (name === '' ? '' : \`\\n\${name}\`),
                      description: link + (sizes === '' ? '' : \`\\n\${sizes}\`),
                      footer: {
                        text: 'SResellera • @therealmal',
                        icon_url:
                          'https://i.imgur.com/ZqSZr3Q.png',
                      },
                    thumbnail: {
                      url:
                        imgUrl,
                    }
                  },
                  ],
                }),
              }
            );
          }
      </script>
      <script>
        var restockMonitorButton = document.querySelector('#restock-monitor-button');
        var restockData = {
          name: "",
          img: "",
          sizes: {}
        };
        var newRestockData = {
          name: "",
          img: "",
          sizes: {}
        };
        var restockMonitorInterval;
        function restockSbMonitor(){
            var id = document.querySelector('input[name="restock-sbMonitor"]').value;
            document.querySelector('div#restock-monitor div.box-lastcheck span').innerHTML = \`Last check: \${(new Date()).toISOString()}\`;
            (async () => {
              const response = await fetch(\`https://street-beat.ru/local/components/multisite/account.favorites/ajax.php?id=\${id}&action=add&type=account&template=account_favorite_list\`)
              if (await response.status === 403){
                var link = new URL(window.location.href)
                link.searchParams.set('id', id)
                link.searchParams.set('d', document.querySelector('input[name="restock-sbMonitorDelay"]').value)
                window.location = link.toString()
              }
              var parser = new DOMParser();
              var responseHTML = parser.parseFromString(await response.text(), 'text/html');
              for (item of responseHTML.querySelectorAll("div.segmentstream_product")){
                  if (item.getAttribute('data-product-id') === id){
                      sizes = {}
                      for (let size of item.querySelector("ul[data-size-type=\\"tab_us\\"]").querySelectorAll("li")){
                          if (size.classList.length === 0){
                              size = size.querySelector("input")
                              sizes[size.getAttribute("data-size")] = size.getAttribute("data-sku-id")
                          }
                      }
                      newRestockData = {
                          name: item.getAttribute("data-product-name"),
                          sizes: sizes,
                          img: item.querySelector("div.js-popup-open").getAttribute("data-image"),
                          url: item.querySelector("div.js-popup-open").getAttribute("data-url")
                      }
                  }
              }
              if (restockData["name"] != ""){
                if (newRestockData["sizes"].length > restockData["sizes"].length){
                  restockMonitorButton.click();
                  sendShareWebhook(newRestockData["url"], Object.keys(newRestockData["sizes"]).join('US \\n'), newRestockData["name"], newRestockData["img"]);
                  window.open(newRestockData["url"], '_blank').focus();
                } else if (newRestockData["sizes"].length === restockData["sizes"].length && !newRestockData.every(function(value, index) { return value === restockData[index]})){
                  restockMonitorButton.click();
                  sendShareWebhook(newRestockData["url"], Object.keys(newRestockData["sizes"]).join('US \\n'), newRestockData["name"], newRestockData["img"]);
                  window.open(newRestockData["url"], '_blank').focus();
                } else if (newRestockData["sizes"].filter(function(obj) { return restockData["sizes"].indexOf(obj) !== -1; }) !== newRestockData["sizes"]){
                  restockMonitorButton.click();
                  sendShareWebhook(newRestockData["url"], Object.keys(newRestockData["sizes"]).join('US \\n'), newRestockData["name"], newRestockData["img"]);
                  window.open(newRestockData["url"], '_blank').focus();
                }
              }
              restockData = newRestockData
          })()
        }

          restockMonitorButton.addEventListener('click', function(){
              if (restockMonitorButton.innerHTML === "Start"){
                restockMonitorButton.innerHTML = "Stop"
                  restockMonitorInterval = setInterval(restockSbMonitor, Number(document.querySelector('input[name="restock-sbMonitorDelay"]').value))
              } else {
                restockMonitorButton.innerHTML = "Start"
                  clearInterval(restockMonitorInterval)
              }
          })
      </script>
      <script>
        const params = new URLSearchParams(window.location.search);
        if (params.has("url")){
          document.querySelector('input[name="sbMonitor"]').value = params.get("url")
        }
        if (params.has("id")){
          document.querySelector('input[name="restock-sbMonitor"]').value = params.get("id")
        }
        if (params.has("d")){
          document.querySelector('input[name="sbMonitorDelay"]').value = params.get("d")
          document.querySelector('input[name="restock-sbMonitorDelay"]').value = params.get("d")
        }
        if (params.has("url") && params.has("d")){
          document.querySelector('#monitor-button').click()
        } else if (params.has("id") && params.has("d")){
          document.querySelector('#restock-monitor-button').click()
        }
      </script>
  </body>
  </html>
  `
  sbMonitorHead.innerHTML = sbMonitorHTMLHead.trim()
  document.open()
  document.write(sbMonitorHTMLHead)
  document.close()
}, startTimeout)
