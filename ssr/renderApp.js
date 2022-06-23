import React from "react";
import { renderToString } from "react-dom/server"; // , renderToNodeStream

// import ReactDOMServer from 'react-dom/server';
import { Provider } from "react-redux";
import { createStore } from "redux";
import { StaticRouter } from "react-router-dom/server";
import serverRoutes from "./routes/serverRoutes";
import reducer from "../src/reducers/reducers";
import initialState from "../src/initialState";

// const { ServerDataContext, resolveData } = createServerContext();

const setResponse = (html, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest["main.css"] : "assets/app.css";
  const mainBuild = manifest ? manifest["main.js"] : "assets/app.js";
  const vendorBuild = manifest ? manifest["vendors.js"] : "assets/vendor.js";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head> 
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="author" content="Michael Arias">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
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
        <script src="${mainBuild}" type="text/javascript"></script>
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
    res.header("Access-Control-Allow-Origin", "http://localhost:3003");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    const store = createStore(reducer, initialState);
    const Routing = serverRoutes;
    // We need to render app twice.
    // First - render App to reqister all effects
    const context = { url: undefined };
    const html = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <Routing />
        </StaticRouter>
      </Provider>
    );
    if (context.url !== undefined) {
      // Somewhere a `<Redirect>` was rendered
      // res.redirect(301, context.url);
      console.log("redirecting to", context.url);
      res.writeHead(301, {
        Location: context.url,
      });
    }
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
    const finalState = store.getState();
    // console.log('p', finalState.playing);
    res.send(setResponse(html, finalState, req.hashManifest));
  });
};

export default renderApp;
