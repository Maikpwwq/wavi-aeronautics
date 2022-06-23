import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';
import helmet from 'helmet';
import cors from 'cors';
import * as path from "path";
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../config/webpack.dev';
// import webpackConfig from '../config/webpack.prod';

import renderApp from './renderApp';
import getManifest from './getManifest';

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
const { REACT_APP_ENV, REACT_APP_PORT } = process.env;

const app = express();
app.use(cors());
app.use(express.static("public"));

if (REACT_APP_ENV === 'development') {
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
  app.use(express.static(path.join(__dirname, '/public')));
  // app.use(express.static(`${__dirname}/public`));
  app.use(helmet());
  // app.use(
  //   helmet.contentSecurityPolicy({
  //     directives: {
  //       'default-src': ["'self'"],
  //       'script-src': ["'self'", "'sha256-lKtLIbt/r08geDBLpzup7D3pTCavi4hfYSO45z98900='"],
  //       'img-src': ["'self'", 'http://dummyimage.com'],
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
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
  // app.set("x-powered-by", false);
}
renderApp(app); // app.get("*", renderApp);

app.listen(REACT_APP_PORT, (err, res) => {
  if (err) console.log(err);
  else {
    console.log(
      `Server running on mode ${REACT_APP_ENV}, on url http://localhost:${REACT_APP_PORT}`,
    );
  }
});
