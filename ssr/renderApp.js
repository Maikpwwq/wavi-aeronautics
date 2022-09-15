import React from "react";
import { renderToString } from "react-dom/server"; // , renderToNodeStream
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "./createEmotionCache";
import createEmotionServer from "@emotion/server/create-instance";
import theme from "../src/modules/theme";
// import ReactDOMServer from 'react-dom/server';
import { Provider } from "react-redux";
// import { createStore } from "redux";
import ConfigureAppStore from "../src/store/index";
// import { configureStore } from "@reduxjs/toolkit";
import { StaticRouter } from "react-router-dom/server";
import serverRoutes from "./routes/serverRoutes";
import reducer from "../src/reducers/reducers";
import initialState from "./initialState";

// const { ServerDataContext, resolveData } = createServerContext();

const setResponse = (html, css, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest["main.css"] : "assets/app.css";
  const mainBuild = manifest ? manifest["main.js"] : "assets/app.js";
  const vendorBuild = manifest ? manifest["vendors.js"] : "assets/vendor.js";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head> 
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
        <meta http-equiv="Content-Security-Policy" content="
          default-src 'unsafe-inline' https://www.facebook.com/v14.0/plugins/customerchat.php; 
          img-src 'self' https://firebasestorage.googleapis.com/; 
          connect-src 'self' https://wavi-aeronautics-drones.web.app/src/ https://www.google-analytics.com https://analytics.google.com https://www.facebook.com/plugins/customer_chat/SDK/ https://www.facebook.com/plugins/customer_chat/facade/; 
          script-src 'self' 'unsafe-inline' https://wavi-aeronautics-drones.web.app/src/ https://cdn.polyfill.io https://code.jquery.com https://www.google-analytics.com https://connect.facebook.net/es_LA/sdk/xfbml.customerchat.js;
          style-src 'self' 'unsafe-inline' https://wavi-aeronautics-drones.web.app/ https://cdn.jsdelivr.net https://use.fontawesome.com https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap https://fonts.googleapis.com/icon?family=Material+Icons; 
          font-src 'self' 'unsafe-inline' https://fonts.gstatic.com/s/roboto/v30/ https://fonts.gstatic.com/s/materialicons/v139/;"
        <meta name="author" content="Michael Arias">
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
        <!-- "application/javascript" -->
        <script src="${mainBuild}" ></script>
        <script src="${vendorBuild}" type="text/javascript"></script>

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
    `;
};

const renderApp = (app) => {
  app.get("*", (req, res) => {
    // BEGIN New redirect handling
    // const redirectInfo = requiresRedirect(req)
    // if (redirectInfo !== false) {
    //   return res.redirect(redirectInfo.destination)
    // }
    // END
    // https://mui.com/material-ui/guides/server-rendering/
    const cache = createEmotionCache();
    const { extractCriticalToChunks, constructStyleTagsFromChunks } =
      createEmotionServer(cache);
    const preloadState = initialState();
    const store = ConfigureAppStore(preloadState);
    // const store = configureStore({
    //   reducer: reducer,
    //   preloadState: initialState,
    // });
    //const store = createStore(reducer, initialState);
    const Routing = serverRoutes;
    // We need to render app twice.
    // First - render App to reqister all effects
    // const context = { url: undefined }; context={context}
    const html = renderToString(
      // const httpContext: HttpContextData = { cacheControl: [], statusCode: 200, };
      // <HttpProvider context={httpContext}></HttpProvider>
      <Provider store={store}>
        <StaticRouter location={req.url}>
          <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
              <Routing />
            </ThemeProvider>
          </CacheProvider>
        </StaticRouter>
      </Provider>
    );
    // if (httpContext.redirectLocation) {
    //   // Somewhere a `<Redirect>` was rendered
    //   // res.redirect(301, context.url);
    //   console.log("redirecting to", context.url);
    //   res.writeHead(301, {
    //     Location: context.url,
    //   });
    // }
    // // Wait for all effects to finish
    // const data = await resolveData();
    // // Inject into html initial data
    // res.write(data.toHtml());
    // // Render App for the second time
    // // This time data form effects will be avaliable in components
    // const htmlStream = renderToNodeStream(
    //   <ServerDataContext>
    //     <Provider store={store}>
    //       <StaticRouter location={req.url} context={{}}>
    //         <Routing />
    //       </StaticRouter>
    //     </Provider>
    //   </ServerDataContext>,
    // );
    // Grab the CSS from emotion
    const emotionChunks = extractCriticalToChunks(html);
    const emotionCss = constructStyleTagsFromChunks(emotionChunks);
    // const finalState = store.getState();
    const finalState = store.getState();
    console.log("p", finalState);
    res.send(setResponse(html, emotionCss, finalState, req.hashManifest));
  });
};

export default renderApp;
