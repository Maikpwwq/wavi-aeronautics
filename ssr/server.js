import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import webpack from "webpack";
import helmet from "helmet";
import cors from "cors";
import * as path from "path";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackConfig from "../config/webpack.dev";
import { sharingInformationService } from "../src/services/sharing-information";
// import { modifyDetail } from "../src/store/states/product";
// import storeRoutes from "./routes/storeRoutes.js";
// import webpackConfig from '../config/webpack.prod';

import renderApp from "./renderApp";
import getManifest from "./getManifest";

import SignInAuth from "./auth/SignInAuth.js";
import SignUpAuth from "./auth/SignUpAuth.js";
import { getProductById } from "../src/services/sharedServices.js";
import { encode } from "punycode";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
const { REACT_APP_ENV, REACT_APP_PORT } = process.env;

//CORS middleware
var allowCrossDomain = function (req, res, next) {
  // res.header("X-Frame-Options", "SAMEORIGIN");
  // res.header("X-Content-Type-Options", "nosniff");
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  // "https://wavi-aeronautics-drones.web.app/",
  //   "https://connect.facebook.net",
  //   "https://web.facebook.com/",
  //   "http://localhost:3000",
  //   "https://firebasestorage.googleapis.com/"
  res.header("Accept-Language", "es-ES,es;q=0.9");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, HEAD, OPTIONS"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
};

const app = express();
// app.use(helmet());
app.use(allowCrossDomain);
app.use(cors({ origin: "*", credentials: true, optionsSuccessStatus: 200 }));
app.options(
  "*",
  cors({ origin: "*", credentials: true, optionsSuccessStatus: 200 })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public"))); // express-static-gzip , "assets"

if (REACT_APP_ENV === "development") {
  // console.log('Development config', webpackConfig);
  // const { publicPath } = webpackConfig.output;
  const compiler = webpack(webpackConfig);
  const serverConfig = { serverSideRender: true }; // Dev middleware  publicPath: publicPath
  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use((req, res, next) => {
    if (!req.hashManifest) req.hashManifest = getManifest();
    next();
  });
  app.use(express.static(path.join(__dirname, "/public")));
  // app.use(express.static(`${__dirname}/public`));
  app.use(helmet());
  // app.use(
  //   helmet.contentSecurityPolicy({
  //     directives: {
  //       'default-src': ["'none'"],
  //       'script-src': ["'self'", "'sha256-lKtLIbt/r08geDBLpzup7D3pTCavi4hfYSO45z98900='"],
  //       'img-src': ["'self'", 'https://firebasestorage.googleapis.com/'],
  //       'style-src-elem': ["'self'", 'https://fonts.googleapis.com'],
  //       'font-src': ['https://fonts.gstatic.com'],
  //       'upgradeInsecureRequest': [],
  //       'media-src': ['*'],
  //     },
  //   }),
  // );
  // app.use(
  //   helmet({
  //     contentSecurityPolicy: false,
  //   }),
  // );
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        "media-src": ["*"],
        "default-src": ["*"],
        "script-src": ["*"],
        "img-src": [
          "'self'",
          "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/",
        ],
        "object-src": "'none'",
      },
    })
  );
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable("x-powered-by");
  // app.set("x-powered-by", false);
}

// Handling routes request
// app.use("/tienda*", storeRoutes)

// POST method route
app.post("/sign-in*", function (req, res) {
  const { email, password } = req.body;
  if (email !== undefined && password !== undefined) {
    // console.log("POST request to sign-in", email, password);
    SignInAuth({ email, password, res });
  }
});

app.post("/sign-up*", function (req, res) {
  const { firstName, lastName, email, password } = req.body;
  if (
    email !== undefined &&
    password !== undefined &&
    firstName !== undefined &&
    lastName !== undefined
  ) {
    // console.log("POST request to sign-up", req.body);
    SignUpAuth({ firstName, lastName, email, password, res });
  }
});

app.post("/*", function (req, res) {
  console.log("POST request to the homepage", req.body);
  res.send("POST request to the homepage");
  res.redirect("/");
});

app.get(
  [
    "/tienda/producto*",
    "/tienda/drones/producto*",
    "/tienda/radio-control/producto*",
    "/tienda/trasmisor-receptor/producto*",
    "/tienda/accesorios/producto*",
  ],
  function (req, res, next) {
    const { id, category } = req.query;
    if (!!id) {
      // console.log("GET request to the product", p);
      getProductById(id, category).subscribe((data) => {
        console.log("Aqui no entra", data);
      });
      const productData = sharingInformationService.getSubject();
      productData.subscribe((data) => {
        if (!!data) {
          console.log("initDetail", data[0]);
          try {
            res.set({ ProductDetail: JSON.stringify(data[0]) });
          } catch (error) {
            console.log("Error", error);
          }
          // res.append("ProductDetail", JSON.stringify(data[0]));
          // try {
          //   res.append("ProductDetail", JSON.stringify(data[0]));
          // } catch (error) {
          //   console.log("Error", error);
          // }
          next();
        }
      });
    }
  }
);

// GET method route same as app.get("*", renderApp);
renderApp(app);

app.listen(REACT_APP_PORT, (err, res) => {
  if (err) console.log(err);
  else {
    console.log(
      `Server running on mode ${REACT_APP_ENV}, on url http://localhost:${REACT_APP_PORT}`
    );
  }
});
