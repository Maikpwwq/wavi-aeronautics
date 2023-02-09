import React from "react";

const App = (html, css, preloadedState, manifest) => {
    const mainStyles = manifest ? manifest["main.css"] : "assets/app.css";
    const mainBuild = manifest ? manifest["main.js"] : "assets/app.js";
    const vendorBuild = manifest ? manifest["vendors.js"] : "assets/vendor.js";
    return `
        <html lang="en">
            <head> 
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="author" content="Wavi Aeronautics" >
                <meta
                name="description"
                content="Manufacture, distribution and maintenance of Drones. Get updated with the latest trends in technology and advanced VToL equipment."
                >
                <meta
                name="keywords"
                content="drone, pilotos fpv, fpv, controladora, receptora, baterias para drone, googles, gafas fpv, props, hélices, Kits FPV, Drones RC, Control remoto"
                >
                <meta name="google-site-verification" content="HXuPDd0BHjnltDHLqyQkYG5_IRx968JwaWKFEIvOdOI">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${css}
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                <link rel="stylesheet" href="${mainStyles}" type="text/css"/>
                <title>Wavi Aeronautics</title>
            </head>
            <body>
                <div id="root">${html}</div>
                <script >
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
                    /</g,
                    "\\u003c"
                )},
                </script>
                <script src="${mainBuild}" type="application/javascript"></script>
                <script src="${vendorBuild}" type="application/javascript"></script>

                <!-- Messenger Plugin de chat Code -->
                <div id="fb-root"></div>

                <!-- Your Plugin de chat code -->
                <div id="fb-customer-chat" class="fb-customerchat">
                </div>

                <script>
                var chatbox = document.getElementById('fb-customer-chat');
                chatbox.setAttribute("page_id", "106215451580305");
                chatbox.setAttribute("attribution", "biz_inbox");
                </script>

                <!-- Your SDK code -->
                <script>
                window.fbAsyncInit = function() {
                    FB.init({
                    xfbml            : true,
                    version          : 'v14.0'
                    });
                };

                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s); js.id = id;
                    js.src = 'https://connect.facebook.net/es_LA/sdk/xfbml.customerchat.js';
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
                </script>
            </body>
        </html>
    `
}

export default App